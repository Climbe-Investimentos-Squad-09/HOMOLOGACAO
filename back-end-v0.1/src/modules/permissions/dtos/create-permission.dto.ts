// src/modules/permissions/dtos/create-permission.dto.ts
import { IsString, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'contratos:editar',
    description: 'Nome único da permissão no formato recurso:acao (lowercase, sem espaços)',
  })
  @IsString()
  @Matches(/^[a-z0-9_]+:[a-z0-9_]+$/, {
    message: 'Formato inválido. Use "recurso:acao" em lowercase, sem espaços. Ex.: contratos:editar',
  })
  nome!: string;

  @ApiProperty({ example: 'Permite editar contratos', required: false })
  @IsOptional()
  @IsString()
  descricao?: string;
}
