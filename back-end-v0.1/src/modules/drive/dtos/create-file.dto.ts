import { Companies } from '../../companies/entities/companies.entity';

import { IsInt, IsOptional, IsEnum, IsISO8601, Min, ValidateIf, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFileDto {
    @Type(() => Number) @IsInt()
    idArquivo!: string;

    @IsString()
    nomeArquivo!: string;

    @IsString()
    nomeEmpresa!: string;

    @IsString()
    urlArquivo!: string;

    @IsString()
    emailUsuario!: string;

    @IsISO8601()
    dataEnvio!: Date; //Adicionar Escopo de email no projeto cloud (Requisitar email do usuário) ou usar o nome do usuário
}