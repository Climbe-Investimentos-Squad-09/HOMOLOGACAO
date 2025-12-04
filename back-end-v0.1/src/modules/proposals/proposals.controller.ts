// src/modules/proposals/proposals.controller.ts
import { UseGuards, Controller, Get, Post, Put, Delete, Body, Param, Query, Patch, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
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
import { driveService } from '../drive/drive.service';


@ApiTags('proposals')
@ApiBearerAuth()
@Controller('proposals')
export class ProposalsController {
  constructor(
    private readonly proposals: ProposalsService,
    private readonly driveService: driveService
  ) {}

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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria proposta com arquivo obrigatório' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idEmpresa: { type: 'number' },
        idEmissor: { type: 'number' },
        valorProposta: { type: 'number' },
        prazoValidade: { type: 'string' },
        statusProposta: { type: 'string', enum: Object.values(StatusProposta) },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  async create(
    @Body() dto: CreateProposalsDto, 
    @UploadedFile() file: any,
    @Req() req: any,
  ) {
    if (!file || file.mimetype !== 'application/pdf') {
      throw new Error('Arquivo PDF é obrigatório');
    }

    let proposal;
    let uploadResult;
    
    try {
      proposal = await this.proposals.create(dto);
      
      const fileName = `Proposta_${proposal.idProposta}_${file.originalname}`;
      uploadResult = await this.driveService.uploadFile(file, 'Empresa', fileName);
      
      if (!uploadResult.webViewLink) {
        await this.proposals.delete(proposal.idProposta);
        throw new Error('Falha ao obter link do arquivo após upload');
      }
      
      await this.proposals.updateDriveLink(proposal.idProposta, uploadResult.webViewLink);
      proposal.driveLink = uploadResult.webViewLink;
      
      return proposal;
    } catch (error) {
      if (proposal && proposal.idProposta) {
        try {
          await this.proposals.delete(proposal.idProposta);
        } catch (deleteError) {
          console.error('Erro ao deletar proposta após falha no upload:', deleteError);
        }
      }
      throw error;
    }
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
