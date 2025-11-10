import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { RolesService } from './role.service';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { AssignPermissionDto } from './dtos/assign-permission.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.createRole(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, dto);
  }

  @Post('assign')
  assignPermissions(@Body() dto: AssignPermissionDto) {
    return this.rolesService.assignPermissions(dto);
  }

  @Get()
  findAll() {
    return this.rolesService.listRoles();
  }
}
