import fs = require('fs');
import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';
import { GOOGLE_AUTH } from '../auth/auth.module';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/files.entity';

import { gmailService } from '../gmail/gmail.service';
import  {SendDriveDTO}  from './dtos/drive.dto';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

import { CreateFileDto } from './dtos/create-file.dto';

import { Companies } from '../companies/entities/companies.entity';
import { Proposals } from '../proposals/entities/proposals.entity';

import path from "path";
const tokenPath = path.join(__dirname, '../../../token.json');
const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

@Injectable()
export class driveService{
    private Drive: drive_v3.Drive;

    constructor(
        private GmailService: gmailService,

        @InjectRepository(Companies)
        private readonly companiesRepo: Repository<Companies>,

        @InjectRepository(Proposals)
        private readonly proposalsRepo: Repository<Proposals>,

        @InjectRepository(File)
        private readonly filesRepo: Repository<File>,

        @Inject(GOOGLE_AUTH) private readonly googleAuth: any,
    ) {
        this.Drive = google.drive({ version: "v3", auth: this.googleAuth });
        console.log("Drive Service inicializado (user-level OAuth)");
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
                return [];
            }

            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });

            return files;
        }catch(error){
            console.log("Erro detectado durante a execução: ", error);
            throw error;
        }
    }

    //Retornar email do usuário -- Verificar Possíveis Erros
    async getEmailFromIdToken(access_token: string) {
        const res = await fetch(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
            }
        );

        const data = await res.json() as any;
        return data?.email;
    }

    //Enviar Documentos. Query: arquivo, tipo_documento, empresa_id
     async sendDocument(
        data: SendDriveDTO,
        mimeT: string,
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
                
                    emailUsuario: await this.getEmailFromIdToken(token.access_token), //Inserir o id do token gerado pelo Oauth
                
                    dataEnvio: new Date,
                })
                
            }

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
        idPasta: string,
    ){
        const permissionIds: string[] = [];

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
        empr: boolean,
        id: any,
    ){  
        // Metadados da Pasta
        let fileMetadata = {}

        //Nome da pastaProposta, se não for definida
        let nomeProposta = nome;
        
        //Criação com, ou sem, Pasta Mãe
        //Para pastas de propostas e pastas de empresas
        if((id != undefined && empr!)|| (id != null && empr!)){
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

        if(empr!){
            const res = await this.Drive.files.copy({
                fileId: '10Y_k-2rSLpOEnk7srhy0QNV8DUWKzMjl',
                requestBody: {
                name: 'relatorio_financeiro.xlsx',
                parents: [`${file.data.id}`]
                }
            });
        }

        // Print the ID of the new folder.
        console.log('\nFolder Id:', file.data.id);
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
}