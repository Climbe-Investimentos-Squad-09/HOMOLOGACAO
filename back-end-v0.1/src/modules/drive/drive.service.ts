import fs = require('fs');
import { google, drive_v3 } from "googleapis";
import { OAuth2Client } from 'google-auth-library';
import { Injectable } from '@nestjs/common';

import { gmailService } from '../gmail/gmail.service';
import  {SendDriveDTO}  from './dtos/drive.dto';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Injectable()
export class driveService{
    constructor(private GmailService: gmailService) {
        console.log("Drive Service inicializado (user-level OAuth)");
    }

    /**
     * Cria OAuth2Client configurado com tokens do usuário
     */
    private createAuthClient(tokens: GoogleTokens): OAuth2Client {
        const client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI,
        );

        client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            scope: tokens.scope,
            token_type: tokens.token_type,
            expiry_date: tokens.expiry_date,
        });

        return client;
    }

    /**
     * Cria instância do Drive API com autenticação do usuário
     */
    private createDriveClient(tokens: GoogleTokens): drive_v3.Drive {
        const authClient = this.createAuthClient(tokens);
        return google.drive({ version: 'v3', auth: authClient });
    }

    //Listar Documentos
    async listDocuments(tokens: GoogleTokens){
        try{
            const drive = this.createDriveClient(tokens);

            const res = await drive.files.list({
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

    //Enviar Documentos. Query: arquivo, tipo_documento, empresa_id
     async sendDocument(
        tokens: GoogleTokens,
        data: SendDriveDTO,
        mimeT: string
    ){
        const nome = data.name;
        let id = await this.searchFolder(tokens, nome);

        if(id !== "" && id !== undefined){

        }else{
            let valor = await this.createFolder(tokens, nome);

            if (valor !== undefined) id = valor ?? "";
        }

        try{
            const drive = this.createDriveClient(tokens);

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
            const response = await drive.files.create({
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
        tokens: GoogleTokens,
        id: string
    ){
        const drive = this.createDriveClient(tokens);
        const response = await drive.files.update({
            fileId: id
        });
        return response;
    }

    //Remover Documento
    async removeDocuments(
        tokens: GoogleTokens,
        id: string
    ){
        const drive = this.createDriveClient(tokens);
        const response = await drive.files.delete({
            fileId: id
        });

        return response;
    }

    // ---------------------------------------------
    // Funções Complementares
    // ---------------------------------------------
    async inviteUsertoFolder(
        tokens: GoogleTokens,
        nomeEmail:string,
        idPasta: string
    ){
        const drive = this.createDriveClient(tokens);
        const permissionIds: string[] = [];

        //Permissões para convidar
        const permission =
            {
                type: 'user',
                role: 'writer',
                emailAddress: nomeEmail, // e.g., 'user@partner.com'
            };

        // Iterate through the permissions and create them one by one.
            const result = await drive.permissions.create({
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
        tokens: GoogleTokens,
        nome: string
    ){
        const drive = this.createDriveClient(tokens);

        // Search for files with the specified query.
        const result = await drive.files.list({
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
        tokens: GoogleTokens,
        nome: string
    ){
        const drive = this.createDriveClient(tokens);

        const emailProprietario = "caio.chagas@souunit.com.br";
        // The metadata for the new folder.
        const fileMetadata = {
            name: nome,
            mimeType: 'application/vnd.google-apps.folder',
        };

        // Create the new folder.
        const file = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        // Print the ID of the new folder.
        console.log('\nFolder Id:', file.data.id);

        if(file.data.id){
            this.inviteUsertoFolder(tokens, emailProprietario, file.data.id)
        }

        // NOTA: GmailService também precisa de tokens
        this.GmailService.sendEmail(
            tokens,
            {
                "toEmailAddress": emailProprietario,

                "messageSubject": "Copiar Planilha",

                "bodyText": "Insira a planilha para a pasta: " + file.data.id
            }
        );

        return file.data.id?.toString();
    }

}