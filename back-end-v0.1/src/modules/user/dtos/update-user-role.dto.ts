// src/modules/user/dtos/update-user-role.dto.ts
import { IsInt, IsOptional, IsArray, ArrayNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 3, required: false, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idCargo?: number | null;

  @ApiProperty({ example: [1, 2, 5], required: false })
  @IsOptional() @IsArray() @ArrayNotEmpty() @Type(() => Number)
  permissoesExtras?: number[]; // IDs das permissões extras
}
