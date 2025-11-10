// src/modules/user/user.controller.ts
import {
  Controller, Get, Post, Put, Patch, Delete, Param, Body, Query
} from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiBody
} from '@nestjs/swagger';

import { UserService } from './user.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Auditable } from '../../audit/auditable.decorator';
import { AuditAction } from '../../audit/entities/audit.entity';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { AddPermissionsDto, RemovePermissionsDto } from './dtos/permissions-bulk.dto';
import { SituacaoUsuario } from './enums/situacao-usuario-enum.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  // -------- LIST / DETAIL ----------
  @Permissions('usuarios:visualizar')
  @Get()
  @ApiOperation({ summary: 'Lista usuários por filtros' })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'situacao', required: false, enum: SituacaoUsuario })
  @ApiQuery({ name: 'idCargo', required: false, type: Number })
  findAll(@Query() q: any) {
    return this.users.findByFilters(q);
  }

  @Permissions('usuarios:visualizar')
  @Get(':id')
  @ApiOperation({ summary: 'Detalhe do usuário' })
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.users.findById(+id);
  }

  // -------- CREATE (admin/backoffice) ----------
  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'usuarios', action: AuditAction.CREATE, entityIdFromResult: 'idUsuario' })
  @Post()
  @ApiOperation({ summary: 'Cria usuário (admin/backoffice)' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  // -------- UPDATE PROFILE/ADMIN ----------
  @Permissions('usuarios:editar')
  @Auditable({ entity: 'usuarios', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados do usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(+id, dto);
  }

  // -------- ROLE & EXTRA PERMS ----------
  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'usuarios', action: AuditAction.ASSIGN, entityIdParam: 'id', loadBefore: true })
  @Post(':id/role')
  @ApiOperation({ summary: 'Atribui/atualiza cargo do usuário (opcionalmente define extras)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserRoleDto })
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.users.updateRole(+id, dto);
  }

  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'usuarios', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Post(':id/permissions/add')
  @ApiOperation({ summary: 'Adiciona permissões extras a um usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: AddPermissionsDto })
  addPermissions(@Param('id') id: string, @Body() dto: AddPermissionsDto) {
    return this.users.addPermissions(+id, dto);
  }

  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'usuarios', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Post(':id/permissions/remove')
  @ApiOperation({ summary: 'Remove permissões extras de um usuário' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: RemovePermissionsDto })
  removePermissions(@Param('id') id: string, @Body() dto: RemovePermissionsDto) {
    return this.users.removePermissions(+id, dto);
  }

  // -------- STATUS ----------
  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'usuarios', action: AuditAction.UPDATE, entityIdParam: 'id', loadBefore: true })
  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualiza situação do usuário (ATIVO/BLOQUEADO/PENDENTE)' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserStatusDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateUserStatusDto) {
    return this.users.updateStatus(+id, dto);
  }

  // -------- DELETE ----------
  @Roles('Compliance', 'SysAdmin', 'CEO')
  @Auditable({ entity: 'usuarios', action: AuditAction.DELETE, entityIdParam: 'id', loadBefore: true })
  @Delete(':id')
  @ApiOperation({ summary: 'Remove usuário' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: string) {
    return this.users.delete(+id);
  }
}
