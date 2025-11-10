import fs = require('fs');
import { google, drive_v3 } from "googleapis";
import { AuthModule } from '../auth/auth.module';
import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';
import * as FS from 'fs/promises';
import FileType from 'file-type';

import { gmailService } from '../gmail/gmail.service';
import  {SendDriveDTO}  from './dtos/drive.dto';

@Injectable()
export class driveService{
    private Drive: drive_v3.Drive;
    //Construtor
    constructor(private GmailService: gmailService,) {
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

        if(id !== "" && id !== undefined){
            
        }else{
            let valor = await this.createFolder(nome);
       
            if (valor !== undefined) id = valor ?? "";
        }

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
        nome: string
    ){
        
        const emailProprietario = "caio.chagas@souunit.com.br";
        // The metadata for the new folder.
        const fileMetadata = {
            name: nome,
            mimeType: 'application/vnd.google-apps.folder',
        };

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

        this.GmailService.sendEmail(
            {
                "toEmailAddress": emailProprietario,
                    
                "messageSubject": "Copiar Planilha",
                    
                "bodyText": "Insira a planilha para a pasta: " + file.data.id
            }
        );

        return file.data.id?.toString();
    }

}