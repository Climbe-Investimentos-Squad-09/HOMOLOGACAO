// src/modules/companies/dtos/create-company-minimal.dto.ts
import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyMinimalDto {
  @ApiProperty({ example: 'Climbe Invest', description: 'Nome fantasia' })
  @IsString()
  nomeFantasia!: string;

  @ApiProperty({ example: 'contato@empresa.com', description: 'E-mail principal' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '(11) 99999-9999', description: 'Contato (telefone/celular)' })
  @IsString()
  contato!: string;
}
