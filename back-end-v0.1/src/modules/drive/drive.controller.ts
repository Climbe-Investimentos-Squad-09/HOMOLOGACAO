import { Controller, Post, Get, Param, Put, Delete, Body, UsePipes, ValidationPipe } from '@nestjs/common';

import { driveService } from "./drive.service";
import {SendDriveDTO} from "./dtos/drive.dto";

@Controller('documents')
export class DriveController{
  constructor(
      private readonly DriveService: driveService,
  ) {}

  //Get - Listar todos os Documentos - lista no terminal da ide
  @Get('')    
    async getall(){
        try{
            this.DriveService.listDocuments();
        }catch(error: any){
            console.log("Erro ao listar documentos: " + error)
        }
    };

  //Post - Enviar Documentos.  Query: arquivo, tipo_documento, empresa_id
  @Post('')    
  async postonly(@Body() body: SendDriveDTO){
        try {
            const result = await this.DriveService.sendDocument(body);
          } catch (error: any) {
            console.error("Erro ao enviar Documento:", error);
          }
    };

  //Put - Validar Documento
//    router.put("/api/v1/documents/:id/validate", async (req: Request<{}, {}, SendEmailModules>, res: Response) => {    });

  //Delete - Remover Documento
  @Delete(':id') 
  async deleteonly(@Param('id') id: string){
        try {
          const result = await this.DriveService.removeDocuments(id);
        } catch (error: any) {
            console.error("Erro ao deletar Arquivo:", error);
        }

   };

}