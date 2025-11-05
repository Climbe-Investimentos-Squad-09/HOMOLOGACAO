import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteCompanyDto {
  @ApiProperty({ example: 'Climbe Investimentos LTDA', required: false })
  @IsOptional()
  @IsString()
  razaoSocial?: string;

  @ApiProperty({ example: 'Climbe Invest', required: false })
  @IsOptional()
  @IsString()
  nomeFantasia?: string;

  @ApiProperty({ example: '12.345.678/0001-99', required: false })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiProperty({ example: 'Av. Paulista, 1000', required: false })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiProperty({ example: '(11) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ example: 'contato@empresa.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'João da Silva', required: false })
  @IsOptional()
  @IsString()
  representanteLegal?: string;
}
