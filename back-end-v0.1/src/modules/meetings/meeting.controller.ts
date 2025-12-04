// src/modules/meetings/reunioes.controller.ts
import { UseGuards, Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReunioesService } from './meeting.service';
import { CreateReuniaoDto } from './dtos/create-meeting.dto';
import { UpdateReuniaoDto } from './dtos/update-meeting.dto';
import { AddParticipanteDto } from './dtos/add-member.dto';
import { UpdateParticipanteStatusDto } from './dtos/update-member-status.dto';
import { AddAtividadeDto } from './dtos/add-activity.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';

import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@ApiTags('reunioes')
@ApiBearerAuth('bearer')
@Controller('reunioes')
export class ReunioesController {
  
  constructor(private readonly service: ReunioesService) {}

  @Permissions('reunioes:agendar')
  @Auditable({ entity: 'reunioes', action: AuditAction.CREATE, entityIdFromResult: 'idReuniao' })
  @Post()
  @ApiOperation({ summary: 'Cria reunião' })
  @ApiBody({ type: CreateReuniaoDto })
  create(
    @Body() dto: CreateReuniaoDto, 
    @Req() req: any,
  ) {
    return this.service.create(dto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Lista reuniões por período (se informado)' })
  @ApiQuery({ name: 'from', required: false, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, description: 'YYYY-MM-DD' })
  list(@Query('from') from?: string, @Query('to') to?: string) {
    return this.service.findByPeriod(from, to);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista reuniões onde o usuário é criador ou participante' })
  @ApiParam({ name: 'userId', type: Number })
  listForUser(@Param('userId') userId: string) {
    return this.service.findForUser(+userId);
  }

  @Permissions('reunioes:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da reunião' })
  @ApiParam({ name: 'id', type: Number })
  get(@Param('id') id: string) {
    return this.service.findById(+id);
  }

  @Auditable({ entity: 'reunioes', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza reunião (criador ou superiores)' })
  @ApiBody({ type: UpdateReuniaoDto })
  update(
    @Param('id') id: string, 
    @Body() dto: UpdateReuniaoDto, 
    @Req() req: any,
    
  ) {
    return this.service.update(+id, dto, req.user);
  }

  @Auditable({ entity: 'reunioes', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Remove reunião (criador ou superiores)' })
  remove(
    @Param('id') id: string, 
    @Req() req: any,
    
  ) {
    return this.service.remove(+id, req.user);
  }

  @Auditable({ entity: 'reunioes', action: AuditAction.ASSIGN, entityIdParam: 'id', loadBefore: true })
  @Post(':id/participantes')
  @ApiOperation({ summary: 'Convida participante (criador ou superiores)' })
  @ApiBody({ type: AddParticipanteDto })
  addParticipante(@Param('id') id: string, @Body() dto: AddParticipanteDto, @Req() req: any) {
    return this.service.addParticipante(+id, dto, req.user);
  }

  @Auditable({ entity: 'reunioes', action: AuditAction.UPDATE, entityIdParam: 'idParticipacao', loadBefore: true })
  @Put('participantes/:idParticipacao/status')
  @ApiOperation({ summary: 'Participante atualiza seu status (Aceito/Recusado)' })
  @ApiBody({ type: UpdateParticipanteStatusDto })
  updateParticipanteStatus(
    @Param('idParticipacao') idParticipacao: string,
    @Body() dto: UpdateParticipanteStatusDto,
    @Req() req: any,
  ) {
    return this.service.updateParticipanteStatus(+idParticipacao, dto, req.user);
  }

  @Auditable({ entity: 'reunioes', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Post(':id/atividades')
  @ApiOperation({ summary: 'Cria atividade vinculada (criador ou superiores)' })
  @ApiBody({ type: AddAtividadeDto })
  addAtividade(@Param('id') id: string, @Body() dto: AddAtividadeDto, @Req() req: any) {
    return this.service.addAtividade(+id, dto, req.user);
  }
    
}
