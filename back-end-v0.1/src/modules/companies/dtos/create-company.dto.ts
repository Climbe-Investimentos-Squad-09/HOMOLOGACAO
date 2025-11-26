// src/calendar/dto/create-empresa.dto.ts
import { IsString, IsOptional, IsISO8601 } from 'class-validator';

export class CreateCompanyDto {
    
    @IsString()
    razaoSocial!: string;

    @IsString()
    nomeFantasia!: string;

    @IsString()
    cnpj!: string;

    @IsString()
    endereco!: string;

    @IsString()
    telefone!: string;

    @IsString()
    email!: string;

    @IsString()
    representanteLegal!: string;
}
