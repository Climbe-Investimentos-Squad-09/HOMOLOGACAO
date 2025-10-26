// src/modules/proposals/dtos/update-proposals.dto.ts
import { IsString, IsOptional, IsISO8601, IsNumber } from 'class-validator';
import { StatusProposta } from '../entities/proposals.entity';

export class UpdateProposalsDto {
    
    @IsNumber()
    @IsOptional()
    idProposta?: number;

    @IsNumber()
    @IsOptional()
    idEmpresa?: number;

    @IsNumber()
    @IsOptional()
    idEmissor?: number;

    @IsNumber()
    @IsOptional()
    valorProposta?: number;

    @IsString()
    @IsOptional()
    prazoValidade?: string;

    @IsString()
    @IsOptional()
    statusProposta?: StatusProposta;

    @IsISO8601()
    @IsOptional()
    dataCriacao?: string;
    
}
