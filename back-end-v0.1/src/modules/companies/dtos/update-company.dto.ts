// src/calendar/dto/create-empresa.dto.ts
import { IsString, IsOptional, IsISO8601, IsNumber } from 'class-validator';

export class UpdateCompanyDto {

    @IsNumber()
    @IsOptional()
    idEmpresa?: number;

    @IsString()
    razaoSocial?: string;

    @IsString()
    nomeFantasia?: string;

    @IsString()
    cnpj?: string;

    @IsString()
    endereco?: string;

    @IsString()
    telefone?: string;

    @IsString()
    email?: string;

    @IsString()
    representanteLegal?: string;
}
