// src/modules/proposals/proposals.controller.ts
import { UseGuards, Controller, Get, Post, Put, Delete, Body, Param, Query, Patch, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';
import { CreateProposalsDto } from './dtos/create-proposals.dto';
import { UpdateProposalsDto } from './dtos/update-proposals.dto';
import { AssignProposalDto } from './dtos/assign-proposals.dto';
import { UpdateProposalStatusDto } from './dtos/update-proposals-status.dto';
import { StatusProposta } from './entities/proposals.entity';

import { GoogleOAuthGuard } from '../auth/guards/google-oauth.guard';
import { GoogleTokens as GoogleTokensDecorator } from '../auth/decorators/google-tokens.decorator';
import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';


@ApiTags('proposals')
@ApiBearerAuth()
@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposals: ProposalsService) {}

  @Permissions('propostas:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista propostas por filtros' })
  @ApiQuery({ name: 'idEmpresa', required: false, type: Number })
  @ApiQuery({ name: 'idEmissor', required: false, type: Number })
  @ApiQuery({ name: 'statusProposta', required: false, enum: StatusProposta })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'Data final (YYYY-MM-DD)' })
  findAll(@Query() query: any) {
    return this.proposals.findByFilters(query);
  }

  @Permissions('propostas:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe da proposta' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.proposals.findById(id);
  }

  @Permissions('propostas:criar')
  @Auditable({ entity: 'proposals', action: AuditAction.CREATE, entityIdFromResult: 'idProposta' })
  @Post()
  @ApiOperation({ summary: 'Cria proposta' })
  @ApiBody({
    type: CreateProposalsDto,
    examples: {
      padrao: {
        summary: 'Exemplo padrão',
        value: {
          idEmpresa: 1,
          idEmissor: 2,
          valorProposta: 100000.0,
          prazoValidade: '2025-12-31',
          statusProposta: StatusProposta.EM_ANALISE,
          dataCriacao: '2025-10-22',
        },
      },
    },
  })
  create(
    @Body() dto: CreateProposalsDto, 
    @Req() req: any,
  ) {
    return this.proposals.create(
      dto
    );
  }

  @Permissions('propostas:editar')
  @Auditable({ entity: 'proposals', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza proposta' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: UpdateProposalsDto,
    examples: {
      exemplo: {
        summary: 'Alteração de valor e prazo',
        value: {
          valorProposta: 125000.5,
          prazoValidade: '2026-01-15',
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateProposalsDto, @Req() req: any) {
    return this.proposals.update(id, dto);
  }

  @Permissions('propostas:excluir')
  @Auditable({ entity: 'proposals', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Exclui proposta' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.proposals.delete(id);
  }

  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'proposals', action: AuditAction.ASSIGN, entityIdParam: 'id', loadBefore: true })
  @Post(':id/assign')
  @ApiOperation({ summary: 'Atribui usuário (ANALISTA/CSO/CMO) à proposta' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: AssignProposalDto,
    examples: {
      analista: {
        summary: 'Atribuir Analista',
        value: { userId: 7, role: 'ANALISTA' },
      },
      cso: {
        summary: 'Atribuir CSO',
        value: { userId: 5, role: 'CSO' },
      },
    },
  })
  assign(@Param('id') id: string, @Body() dto: AssignProposalDto, @Req() req: any) {
    return this.proposals.assign(+id, dto, req.user);
  }

  @Permissions('propostas:alterar_status')
  @Auditable({ entity: 'proposals', action: AuditAction.STATUS_CHANGE, entityIdParam: 'id', loadBefore: true })
  @Patch(':id/status')
  @ApiOperation({ summary: 'Altera status da proposta' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: UpdateProposalStatusDto,
    examples: {
      aprovar: { summary: 'Aprovar', value: { statusProposta: StatusProposta.APROVADA } },
      recusar: { summary: 'Recusar', value: { statusProposta: StatusProposta.RECUSADA } },
    },
  })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateProposalStatusDto, @Req() req: any) {
    return this.proposals.updateStatus(+id, dto, req.user);
  }
}
