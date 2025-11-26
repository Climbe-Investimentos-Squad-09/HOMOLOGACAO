import fs = require('fs');
import { google, drive_v3 } from "googleapis";
import { AuthModule } from '../auth/auth.module';
import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';
import { File } from './entities/files.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as FS from 'fs/promises';
import FileType from 'file-type';

import { gmailService } from '../gmail/gmail.service';
import  {SendDriveDTO}  from './dtos/drive.dto';
import { CreateFileDto } from './dtos/create-file.dto';

import { Companies } from '../companies/entities/companies.entity';
import { Proposals } from '../proposals/entities/proposals.entity';

@Injectable()
export class driveService{
    private Drive: drive_v3.Drive;
    //Construtor
    constructor(
            @InjectRepository(Companies)
            private readonly companiesRepo: Repository<Companies>,

            @InjectRepository(Proposals)
            private readonly proposalsRepo: Repository<Proposals>,

            @InjectRepository(File)
            private readonly filesRepo: Repository<File>,

            private GmailService: gmailService,
        ) {
        const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
        );
        oAuth2Client.setCredentials({
            access_token: 'SEU_ACCESS_TOKEN_AQUI',
            refresh_token: 'SEU_REFRESH_TOKEN_AQUI',
            scope: 'https://www.googleapis.com/auth/drive',
            token_type: 'Bearer',
            expiry_date: Date.now() + 3600 * 1000,
        });
        this.Drive = google.drive({ version: 'v3', auth: '' }); // Corrigir aqui com o oAuth2Client
        console.log("Cliente Drive criado");
    }

    //Listar Documentos
    async listDocuments(){
        try{
            const res = await this.Drive.files.list({
                q: "mimeType!='application/vnd.google-apps.folder'",
                pageSize: 10,
                fields: 'nextPageToken, files(id, name)',
            });
            
            const files = res.data.files ?? [];
            
            if (files.length === 0) {
                console.log('No files found.');
                return;
            }

            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });

        }catch(error){
            console.log("Erro detectado durante a execução: ");
        }
    }

    //Enviar Documentos. Query: arquivo, tipo_documento, empresa_id
     async sendDocument(
        data: SendDriveDTO,
        mimeT: string
    ){
        const nome = data.name;
        let id = await this.searchFolder(nome);

        try{
            //Metadados
            const fileMetadata = {
                name: data.name,
                mimeType: mimeT,
                parents: [`${id}`]
            };
            
            //Conteúdo
            const media = {
                mimeType: mimeT,
                body: fs.createReadStream(data.arquivo)
            };

            //Lançar para o drive
            const response = await this.Drive.files.create({
                requestBody: fileMetadata,
                media: media, 
                fields: "id"
            });

            /*
            if(
                (response.data.id !== "" && response.data.id !== undefined  && response.data.id !== null) &&
                (response.data.driveId !== "" && response.data.driveId !== undefined  && response.data.driveId !== null)&&
                (response.data.name !== "" && response.data.name !== undefined  && response.data.name !== null)
                ){
                this.registerFile({
                    idArquivo: response.data.id,
                    
                    nomeArquivo: response.data.name,
                
                    nomeEmpresa: data.name,
                
                    urlArquivo: response.data.driveId,
                
                    emailUsuario: "", //Adicionar Escopo de email no projeto cloud (Requisitar email do usuário) ou usar o nome do usuário
                
                    dataEnvio: new Date,
                })
            }
            */

            return response;
        }catch (err) {
            throw err;
        }
    }

    //Validar Documento
    async validateDocument(
        id: string
    ){
        const response = await this.Drive.files.update({
            fileId: id
        });
        return response;
    }

    //Remover Documento
    async removeDocuments(
        id: string
    ){
        const response = await this.Drive.files.delete({
            fileId: id
        });    

        return response;
    }

    // ---------------------------------------------
    // Funções Complementares
    // ---------------------------------------------
    async inviteUsertoFolder(
        nomeEmail:string,
        idPasta: string
    ){
        /** @type {Array<string>} */
        const permissionIds = [];
        
        //Permissões para convidar
        const permission = 
            {
                type: 'user',
                role: 'writer',
                emailAddress: nomeEmail, // e.g., 'user@partner.com'
            };

        // Iterate through the permissions and create them one by one.
            const result = await this.Drive.permissions.create({
                requestBody: permission,
                fileId: idPasta,
                fields: 'id',
            });

            if (result.data.id) {
                permissionIds.push(result.data.id);
                console.log(`Inserted permission id: ${result.data.id}`);
            } else {
                throw new Error('Failed to create permission');
            }
        
        return permissionIds;
    }

    async searchFolder(
        nome: string
    ){
        // Search for files with the specified query.
        const result = await this.Drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='${nome}' and trashed = false`,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
        });

        let val = "";
        // Print the name and ID of each found file.
        (result.data.files ?? []).forEach((file) => {
            console.log('Found file:', file.name, file.id);
            let valor = file.id;

            if (valor !== undefined) val = valor ?? "";
        });

        return val.toString();
    }

    async createFolder(
        nome: string,
        id: any,
        empr: boolean
    ){
        const emailProprietario = ""; //Definir email fixo para envio da planilha

        // Metadados da Pasta
        let fileMetadata = {}

        //Nome da pastaProposta, se não for definida
        let nomeProposta = nome;
        
        //Criação com, ou sem, Pasta Mãe
        //Para pastas de propostas e pastas de empresas
        if((id == undefined && empr!)|| (id == null && empr!)){
            if(nome == "" || nome == undefined || nome == null){
                let qntPropostas = await this.proposalsRepo.createQueryBuilder('u')
                .where('u.idEmpresa = :id', { idEmpresa: id })
                .getCount();

                nomeProposta = "Proposta", (await qntPropostas) + 1
            }
            
            
            const el = await this.companiesRepo.createQueryBuilder('u')
            .select(['u.nomeFantasia'])
            .where('u.idEmpresa = :id', { idEmpresa: id })
            .getOne();
            
            let val;

            if(el !== null){
                val = await this.searchFolder(el.nomeFantasia);
            }

            fileMetadata = {
                name: nomeProposta,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [`${val}`]
            };
        }else{
            fileMetadata = {
                name: nomeProposta,
                mimeType: 'application/vnd.google-apps.folder',
            };
        }

        // Create the new folder.
        const file = await this.Drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        // Print the ID of the new folder.
        console.log('\nFolder Id:', file.data.id);

        if(file.data.id){
            this.inviteUsertoFolder(emailProprietario, file.data.id)
        }

        if(empr!){
            this.GmailService.sendEmail(
                {
                    "toEmailAddress": emailProprietario,
                        
                    "messageSubject": "Copiar Planilha",
                        
                    "bodyText": "Insira a planilha para a pasta: " + file.data.id
                }
            );
        }

        return file.data.id?.toString();
    }

    async registerFile(dto: CreateFileDto): Promise<File> {
        const file = this.filesRepo.create({
              idArquivo: { idArquivo: dto.idArquivo } as any,
              nomeArquivo: { nomeArquivo: dto.nomeArquivo } as any,
              nomeEmpresa: { nomeEmpresa: dto.nomeEmpresa } as any,
              urlArquivo: { urlArquivo: dto.urlArquivo } as any,
              emailUsuario: { emailUsuario: dto.emailUsuario } as any,
              dataEnvio: { dataEnvio: dto.dataEnvio } as any,
            });
        
            return this.filesRepo.save(file);
    }

    //-------------------------------------------------------
    //Cópia da Planilha - Fluxo Local do N8N
    //-------------------------------------------------------
    async copyFile(
        id:string
    ){
        const copy = await this.Drive.files.copy({
            fileId: "10UZHgd8KE-3Joo1zx7zwN6gnsfiYlFzB", //Id Fixo
            requestBody: {
                parents: [id]   // nova pasta
            }
        });
        
    }
}