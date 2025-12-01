import { Controller, Post, Get, Param, Put, Delete, Body, UsePipes, ValidationPipe,  HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import * as fs from 'fs/promises';
import FileType from 'file-type';

import { driveService } from "./drive.service";
import {SendDriveDTO} from "./dtos/drive.dto";
import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Controller('drive')
@UseGuards(GoogleOAuthGuard)
export class DriveController{
  constructor(
      private readonly DriveService: driveService,
  ) {}

  //Get - Listar todos os Documentos - lista no terminal da ide
  @Get('')
    async getall(@GoogleTokensDecorator() tokens: GoogleTokens){
        try{
            return this.DriveService.listDocuments(tokens);
        }catch(error: any){
            console.log("Erro ao listar documentos: " + error)
            throw error;
        }
    };

  //Post - Enviar Documentos.  Query: arquivo, tipo_documento, empresa_id
  @Post('')
  async postonly(
    @Body() body: SendDriveDTO,
    @GoogleTokensDecorator() tokens: GoogleTokens,
  ){
      const allowedTypes = ['application/pdf'];
      const buffer = await fs.readFile(body.arquivo); // lê o arquivo completo ou parcialmente
      const type = await FileType.fileTypeFromBuffer(buffer);

      if(type?.mime.toString() !== undefined && allowedTypes.includes(type?.mime.toString())){
        try {
            const result = await this.DriveService.sendDocument(tokens, body, type.mime);
            return result;
          } catch (error: any) {
            console.error("Erro ao enviar Documento:", error);
            throw error;
          }
      }else{
        console.log("\n Arquivo não enviado, formato não aceito")
        throw new HttpException('Arquivo não enviado, formato não aceito', HttpStatus.NOT_FOUND);
      }
    };

  //Put - Validar Documento
//    router.put("/api/v1/documents/:id/validate", async (req: Request<{}, {}, SendEmailModules>, res: Response) => {    });

  //Delete - Remover Documento
  @Delete(':id')
  async deleteonly(
    @Param('id') id: string,
    @GoogleTokensDecorator() tokens: GoogleTokens,
  ){
        try {
          const result = await this.DriveService.removeDocuments(tokens, id);
          return result;
        } catch (error: any) {
            console.error("Erro ao deletar Arquivo:", error);
            throw error;
        }

   };

}