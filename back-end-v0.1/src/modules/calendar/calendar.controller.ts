import { Controller, Post, Get, Param, Put, Delete, Body } from '@nestjs/common';

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
    async getall(){
        try{
            return this.CalendarService.listEvents();
        }catch(error: any){
            console.log("Erro ao listar eventos")
        }
    };

    // GET - Auth check to diagnose Google OAuth configuration
    @Get('auth-check')
    async authCheck(){
        return this.CalendarService.checkAuth();
    }

    //Get - Listar detalhes da reunião
    @Get(':id')
    async getonly(@Param('id') id: string){    
        try{
            if(!id){
                console.log("Campos obrigatórios faltando")
                
            }else{
                this.CalendarService.eventDetail(id);
            }
        }catch(error: any){
            console.log("Erro ao listar detalhes do evento: " + error)
        }
   };

    //Alerta: em data, o horário está sendo salvo 3 horas antes do recebido
    //Post - Agendar Reunião
    //Query: titulo, empresa_id, data, hora, presencial, local, pauta
    @Post('')
    async postMeeting(@Body() body: sendCalendarDTO){
        try{
            const created = await this.CalendarService.createReunion(body);
            return created;         
        }catch(error: any){
            console.log("Erro ao agendar reunião", error)
            throw error
        }
    };
    
    //Put - Adicionar Participantes
    //Query: id_usuario - verificar envio individual ou conjunto de ids
    @Put('')
    async postParticipants(@Body() body: indexAccountDTO){
    
        try{
            this.CalendarService.indexAccounts(body);
        }catch(error: any){
            console.log("Erro ao apagar evento")
        }
    };
    
    //Delete - Remover Reunião
    @Delete(':id')
    async daleteonly(@Param('id') id: string){    
        try{
            this.CalendarService.removeEvent(id);
            
        }catch(error: any){
            console.log("Erro ao apagar evento")
        }
    };
}