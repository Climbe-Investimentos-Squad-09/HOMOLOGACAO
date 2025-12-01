import { Controller, Post, Get, Param, Put, Delete, Body, UseGuards } from '@nestjs/common';

import { calendarService } from "./calendar.service";
import {sendCalendarDTO} from "./dtos/calendar.dto";
import { indexAccountDTO } from './dtos/indexAccounts.dto';
import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Controller('meetings')
@UseGuards(GoogleOAuthGuard)
export class CalendarController{
    constructor(
            private readonly CalendarService: calendarService,
        ) {}

  //Get - Listar todas as reuniões - lista no terminal da ide
  @Get('')
    async getall(@GoogleTokensDecorator() tokens: GoogleTokens){
        try{
            return this.CalendarService.listEvents(tokens);
        }catch(error: any){
            console.log("Erro ao listar eventos")
        }
    };

    // GET - Auth check to diagnose Google OAuth configuration
    @Get('auth-check')
    async authCheck(@GoogleTokensDecorator() tokens: GoogleTokens){
        return this.CalendarService.checkAuth(tokens);
    }

    //Get - Listar detalhes da reunião
    @Get(':id')
    async getonly(
        @Param('id') id: string,
        @GoogleTokensDecorator() tokens: GoogleTokens,
    ){
        try{
            if(!id){
                console.log("Campos obrigatórios faltando")

            }else{
                this.CalendarService.eventDetail(tokens, id);
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
        @Body() body: sendCalendarDTO,
        @GoogleTokensDecorator() tokens: GoogleTokens,
    ){
        try{
            const created = await this.CalendarService.createReunion(tokens, body);
            return created;
        }catch(error: any){
            console.log("Erro ao agendar reunião", error)
            throw error
        }
    };

    //Put - Adicionar Participantes
    //Query: id_usuario - verificar envio individual ou conjunto de ids
    @Put('')
    async postParticipants(
        @Body() body: indexAccountDTO,
        @GoogleTokensDecorator() tokens: GoogleTokens,
    ){

        try{
            this.CalendarService.indexAccounts(tokens, body);
        }catch(error: any){
            console.log("Erro ao apagar evento")
        }
    };

    //Delete - Remover Reunião
    @Delete(':id')
    async daleteonly(
        @Param('id') id: string,
        @GoogleTokensDecorator() tokens: GoogleTokens,
    ){
        try{
            this.CalendarService.removeEvent(tokens, id);

        }catch(error: any){
            console.log("Erro ao apagar evento")
        }
    };
}