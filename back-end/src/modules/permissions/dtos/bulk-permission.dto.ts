// src/modules/permissions/dtos/bulk-create-permission.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';

export class BulkCreatePermissionDto {
  @ApiProperty({
    type: [CreatePermissionDto],
    example: [
      { nome: 'contratos:visualizar', descricao: 'Listar/obter contratos' },
      { nome: 'contratos:criar', descricao: 'Criar novo contrato' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePermissionDto)
  items!: CreatePermissionDto[];
}
