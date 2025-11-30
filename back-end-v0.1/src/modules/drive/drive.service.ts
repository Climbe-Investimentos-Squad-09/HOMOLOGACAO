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
        console.log("Cliente Drive criado");
    }

    //Listar Documentos
    async listDocuments(code: string | qs.ParsedQs){
        
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

        oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: oAuth2Client }); 

        try{
            const res = await Drive.files.list({
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

    //Retornar email do usuário
    async getEmailFromIdToken(idToken: string, code: string | qs.ParsedQs): Promise<string> {
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 
        
        const ticket = await oAuth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        return payload?.email ?? "";
    }

    //Enviar Documentos. Query: arquivo, tipo_documento, empresa_id
     async sendDocument(
        data: SendDriveDTO,
        mimeT: string,
        code: string | qs.ParsedQs
    ){
        const nome = data.name;
        let id = await this.searchFolder(nome, code);

        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

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
            const response = await Drive.files.create({
                requestBody: fileMetadata,
                media: media, 
                fields: "id"
            });

            if(
                (response.data.id !== "" && response.data.id !== undefined  && response.data.id !== null) &&
                (response.data.driveId !== "" && response.data.driveId !== undefined  && response.data.driveId !== null)&&
                (response.data.name !== "" && response.data.name !== undefined  && response.data.name !== null)
                ){
                
                if(oAuth2Client.credentials.id_token !== "" && oAuth2Client.credentials.id_token !== undefined  && oAuth2Client.credentials.id_token !== null){
                    this.registerFile({
                        idArquivo: response.data.id,
                        
                        nomeArquivo: response.data.name,
                    
                        nomeEmpresa: data.name,
                    
                        urlArquivo: response.data.driveId,
                    
                        emailUsuario: await this.getEmailFromIdToken(await oAuth2Client.credentials.id_token, code), //Inserir o id do token gerado pelo Oauth
                    
                        dataEnvio: new Date,
                    })
                }
            }

            return response;
        }catch (err) {
            throw err;
        }
    }

    //Validar Documento
    async validateDocument(
        id: string,
        code: string | qs.ParsedQs
    ){
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

        const response = await Drive.files.update({
            fileId: id
        });
        return response;
    }

    //Remover Documento
    async removeDocuments(
        id: string,
        code: string | qs.ParsedQs
    ){
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

        const response = await Drive.files.delete({
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
        code: string | qs.ParsedQs
    ){
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

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
            const result = await Drive.permissions.create({
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
        nome: string,
        code: string | qs.ParsedQs
    ){
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

        // Search for files with the specified query.
        const result = await Drive.files.list({
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
        empr: boolean,
        code: string | qs.ParsedQs
    ){
        const emailProprietario = ""; //Definir email fixo (Dono da Planilha) para cópia do arquivo

        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

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
                val = await this.searchFolder(el.nomeFantasia, code);
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
        const file = await Drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        // Print the ID of the new folder.
        console.log('\nFolder Id:', file.data.id);

        if(file.data.id){
            this.inviteUsertoFolder(emailProprietario, file.data.id, code)
        }

        if(empr!){
            this.GmailService.sendEmail(
                {
                    "toEmailAddress": emailProprietario,
                        
                    "messageSubject": "Copiar Planilha",
                        
                    "bodyText": "Insira a planilha para a pasta: " + file.data.id
                },
                code
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
        id:string,
        code: string | qs.ParsedQs
    ){
        let Drive: drive_v3.Drive;
        
        let oAuth2Client;

        oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
        
        const { tokens } = await oAuth2Client.getToken(String(code));

    oAuth2Client.setCredentials(tokens);

        Drive = google.drive({ version: 'v3', auth: '' }); 

        const copy = await Drive.files.copy({
            fileId: "10UZHgd8KE-3Joo1zx7zwN6gnsfiYlFzB", //Id Fixo
            requestBody: {
                parents: [id]   // nova pasta
            }
        });
        
    }
}