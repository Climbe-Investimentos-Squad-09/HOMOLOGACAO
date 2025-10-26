import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PermissionsService } from './permission.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.permissionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePermissionDto) {
    return this.permissionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.permissionsService.remove(id);
  }
}
