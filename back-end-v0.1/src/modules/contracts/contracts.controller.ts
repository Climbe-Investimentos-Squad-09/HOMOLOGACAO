// src/modules/contracts/contracts.controller.ts
import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseInterceptors, UploadedFile, Req
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody, ApiConsumes
} from '@nestjs/swagger';

import { ContractsService } from './contracts.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';

import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { UpdateContractStatusDto } from './dtos/update-contract-status.dto';
import { AssignContractDto, AssignManyContractDto } from './dtos/assign-contract.dto';
import { StatusContrato } from './entities/contracts.entity';
import { driveService } from '../drive/drive.service';

@ApiTags('contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contracts: ContractsService,
    private readonly driveService: driveService
  ) {}

  // -------- LISTAGEM / DETALHE ------------------------------------------------

  @Permissions('contratos:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista contratos por filtros' })
  @ApiQuery({ name: 'idProposta', required: false, type: Number })
  @ApiQuery({ name: 'idCompliance', required: false, type: Number })
  @ApiQuery({ name: 'statusContrato', required: false, enum: StatusContrato })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'Data final (YYYY-MM-DD)' })
  findAll(@Query() query: any) {
    return this.contracts.findByFilters(query);
  }

  @Permissions('contratos:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do contrato' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.contracts.findById(+id);
  }

  // -------- CRIAÇÃO -----------------------------------------------------------

  @Permissions('contratos:criar')
  @Auditable({ entity: 'contracts', action: AuditAction.CREATE, entityIdFromResult: 'idContrato' })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Cria contrato a partir de uma proposta com arquivo opcional' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idProposta: { type: 'number' },
        idCompliance: { type: 'number' },
        statusContrato: { type: 'string', enum: Object.values(StatusContrato) },
        dataInicio: { type: 'string' },
        dataFim: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body() dto: CreateContractDto,
    @UploadedFile() file: any
  ) {
    const contract = await this.contracts.create(dto);
    
    if (file && file.mimetype === 'application/pdf') {
      try {
        const fileName = `Contrato_${contract.idContrato}_${file.originalname}`;
        const uploadResult = await this.driveService.uploadFile(file, 'Empresa', fileName);
        
        if (uploadResult.webViewLink) {
          await this.contracts.updateDriveLink(contract.idContrato, uploadResult.webViewLink);
          contract.driveLink = uploadResult.webViewLink;
        }
      } catch (error) {
        console.error('Erro ao fazer upload do arquivo:', error);
      }
    }
    
    return contract;
  }

  // -------- UPDATE GERAL (não status) ----------------------------------------

  @Permissions('contratos:editar')
  @Auditable({ entity: 'contracts', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados do contrato (não altera status)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: UpdateContractDto,
    examples: {
      exemplo: {
        summary: 'Atualizar compliance',
        value: { idCompliance: 5 },
      },
    },
  })
  update(@Param('id') id: string, @Body() dto: UpdateContractDto) {
    return this.contracts.update(+id, dto);
  }

  // -------- STATUS ------------------------------------------------------------

  @Permissions('contratos:editar')
  @Auditable({ entity: 'contracts', action: AuditAction.STATUS_CHANGE, entityIdParam: 'id', loadBefore: true })
  @Patch(':id/status')
  @ApiOperation({ summary: 'Altera status do contrato (Encerrar/Rescindir exige data)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: UpdateContractStatusDto,
    examples: {
      encerrar: { summary: 'Encerrar', value: { statusContrato: StatusContrato.Encerrado, dataEncerramento: '2026-02-01' } },
      rescindir: { summary: 'Rescindir', value: { statusContrato: StatusContrato.Rescindido, dataEncerramento: '2025-11-10' } },
    },
  })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateContractStatusDto) {
    return this.contracts.updateStatus(+id, dto);
  }

  // -------- ASSIGNS -----------------------------------------------------------

  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'contracts', action: AuditAction.ASSIGN, entityIdParam: 'id', loadBefore: true })
  @Post(':id/assign')
  @ApiOperation({ summary: 'Atribui usuário (ANALISTA/CSO/CMO) ao contrato' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: AssignContractDto,
    examples: {
      analista: { summary: 'Atribuir Analista', value: { idUsuario: 7, role: 'ANALISTA' } },
      cso: { summary: 'Atribuir CSO', value: { idUsuario: 5, role: 'CSO' } },
    },
  })
  assign(@Param('id') id: string, @Body() dto: AssignContractDto) {
    return this.contracts.assign(+id, dto);
  }

  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'contracts', action: AuditAction.ASSIGN, entityIdParam: 'id', loadBefore: true })
  @Post(':id/assign/bulk')
  @ApiOperation({ summary: 'Atribui vários usuários ao contrato (substitui existentes se solicitado)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    type: AssignManyContractDto,
    examples: {
      exemplo: {
        summary: 'Substituir Analista e CSO',
        value: {
          replaceExisting: true,
          items: [
            { idUsuario: 10, role: 'ANALISTA' },
            { idUsuario: 11, role: 'CSO' }
          ]
        }
      }
    }
  })
  assignBulk(@Param('id') id: string, @Body() dto: AssignManyContractDto) {
    return this.contracts.assignBulk(+id, dto);
  }

  // -------- DELETE ------------------------------------------------------------

  @Permissions('contratos:excluir')
  @Auditable({ entity: 'contracts', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Exclui contrato' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.contracts.delete(+id);
  }
}
