import fs = require('fs');
import { google, drive_v3 } from "googleapis";
import { AuthModule } from '../auth/auth.module';

import { OAuth2Client } from 'google-auth-library';
import { Injectable, Inject } from '@nestjs/common';

import  {SendDriveDTO}  from './dtos/drive.dto';

@Injectable()
export class driveService{
    private Drive: drive_v3.Drive;

    //Construtor
    constructor() {
    const oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({
      access_token: 'SEU_ACCESS_TOKEN_AQUI',
      refresh_token: 'SEU_REFRESH_TOKEN_AQUI',
      scope: 'https://www.googleapis.com/auth/calendar',
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
        data: SendDriveDTO
    ){
        try{
            //Metadados
            const fileMetadata = {
                name: data.name,
                mimeType: data.tipo_documento,
            };

            //Conteúdo
            const media = {
                mimeType: 'text/plain',
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
}