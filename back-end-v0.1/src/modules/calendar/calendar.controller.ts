import { Controller, Post, Get, Param, Put, Delete, Body, UsePipes, ValidationPipe } from '@nestjs/common';

import { calendarService } from "./calendar.service";
import {sendCalendarDTO} from "./dtos/calendar.dto";
import { indexAccountDTO } from './dtos/indexAccounts.dto';

@Controller('meetings')
export class CalendarController{
    constructor(
            private readonly CalendarService: calendarService,
        ) {}

  //Get - Listar todas as reuniões - lista no terminal da ide
  @Get('')  
    async getall(
      @Body("code") code: string | qs.ParsedQs
    ){
        try{
            return this.CalendarService.listEvents('primary', code);
        }catch(error: any){
            console.log("Erro ao listar eventos")
        }
    };

    //Get - Listar detalhes da reunião
    @Get(':id')
    async getonly(
        @Param('id') id: string,
        @Body("code") code: string | qs.ParsedQs
    ){    
        try{
            if(!id){
                console.log("Campos obrigatórios faltando")
                
            }else{
                this.CalendarService.eventDetail(id, code);
            }
        }catch(error: any){
            console.log("Erro ao listar detalhes do evento: " + error)
        }
   };

    //Alerta: em data, o horário está sendo salvo 3 horas antes do recebido
    //Post - Agendar Reunião
    //Query: titulo, empresa_id, data, hora, presencial, local, pauta
    @Post('')
    async postMeeting(
        @Body("body") body: sendCalendarDTO,
        @Body("code") code: string | qs.ParsedQs
    ){
        const data: Date = new Date(body.data);
    
        try{
            this.CalendarService.createReunion(body, code);          
        }catch(error: any){
            console.log("Erro ao agendar reunião")
        }
    };
    
    //Put - Adicionar Participantes
    //Query: id_usuario - verificar envio individual ou conjunto de ids
    @Put('')
    async postParticipants(
        @Body("body") body: indexAccountDTO,
        @Body("code") code: string | qs.ParsedQs
    ){
    
        try{
            this.CalendarService.indexAccounts(body, code);
        }catch(error: any){
            console.log("Erro ao apagar evento")
        }
    };
    
    //Delete - Remover Reunião
    @Delete(':id')
    async daleteonly(
        @Param('id') id: string, 
        @Body("code") code: string | qs.ParsedQs
    ){    
        try{
            this.CalendarService.removeEvent(id, code);
            
        }catch(error: any){
            console.log("Erro ao apagar evento")
        }
    };
}