// src/modules/user/dtos/update-user-role.dto.ts
import { IsInt, IsOptional, IsArray, ArrayNotEmpty, Min, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ example: 3, required: false, nullable: true })
  @IsOptional()
  @Transform(({ value }) => {
    // Se for string vazia, null ou undefined, retornar null
    if (value === null || value === undefined || value === '' || value === 'null') {
      return null;
    }
    // Tentar converter para número
    const num = Number(value);
    return isNaN(num) ? null : num;
  })
  @ValidateIf((o, value) => value !== null && value !== undefined)
  @IsInt()
  idCargo?: number | null;

  @ApiProperty({ example: [1, 2, 5], required: false })
  @IsOptional() @IsArray() @ArrayNotEmpty() @Type(() => Number)
  permissoesExtras?: number[]; // IDs das permissões extras
}
