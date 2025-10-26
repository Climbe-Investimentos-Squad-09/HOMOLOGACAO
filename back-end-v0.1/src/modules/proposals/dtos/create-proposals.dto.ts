// src/modules/proposals/dtos/create-proposals.dto.ts
import { IsString, IsOptional, IsISO8601 } from 'class-validator';
import { StatusProposta } from '../entities/proposals.entity';

export class CreateProposalsDto {

    @IsString()
    idEmpresa!: number;

    @IsString()
    idEmissor!: number;

    @IsString()
    valorProposta!: number;

    @IsString()
    prazoValidade!: string;

    @IsString()
    statusProposta!: StatusProposta;

    @IsISO8601()
    @IsOptional()
    dataCriacao?: string;
    
}
