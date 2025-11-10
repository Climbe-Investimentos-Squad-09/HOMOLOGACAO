// src/modules/permissions/permission.controller.ts
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam, ApiBody,
} from '@nestjs/swagger';

import { PermissionsService } from './permission.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';

import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { BulkCreatePermissionDto } from './dtos/bulk-permission.dto';

@ApiTags('permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  // LIST
  @Permissions('permissoes:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista permissões (filtros por q/nome, ordem por nome)' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Busca textual (nome/descricao)' })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() q: any) {
    return this.service.findByFilters(q);
  }

  @Permissions('permissoes:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de uma permissão' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.service.findById(+id);
  }

  // CREATE
  @Permissions('permissoes:criar')
  @Post()
  @ApiOperation({ summary: 'Cria nova permissão' })
  @ApiBody({ type: CreatePermissionDto })
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  // BULK CREATE
  @Permissions('permissoes:criar')
  @Post('bulk')
  @ApiOperation({ summary: 'Cria permissões em lote (ignora as já existentes)' })
  @ApiBody({ type: BulkCreatePermissionDto })
  bulkCreate(@Body() dto: BulkCreatePermissionDto) {
    return this.service.bulkCreate(dto);
  }

  // UPDATE
  @Permissions('permissoes:editar')
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza permissão' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdatePermissionDto })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.service.update(+id, dto);
  }

  // DELETE
  @Permissions('permissoes:excluir')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove permissão' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.service.delete(+id);
  }
}
