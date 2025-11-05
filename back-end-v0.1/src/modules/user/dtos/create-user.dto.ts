// src/modules/user/dtos/create-user.dto.ts
import { IsEmail, IsOptional, IsString, MinLength, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString() nomeCompleto!: string;

  @ApiProperty({ example: '123.456.789-09', required: false })
  @IsOptional() @IsString() cpf?: string;

  @ApiProperty({ example: 'usuario@exemplo.com' })
  @IsEmail() email!: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional() @IsString() contato?: string;

  @ApiProperty({ example: 'senha123', minLength: 6, required: false })
  @IsOptional() @IsString() @MinLength(6) senha?: string; // pode ser omitida em OAuth

  @ApiProperty({ example: 2, required: false, description: 'id do cargo inicial (opcional)' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idCargo?: number;
}
