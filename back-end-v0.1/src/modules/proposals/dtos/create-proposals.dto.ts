// src/modules/proposals/dtos/create-proposals.dto.ts
import { IsInt, IsNumber, IsEnum, IsISO8601 } from 'class-validator';
import { StatusProposta } from '../entities/proposals.entity';

export class CreateProposalsDto {
    @IsInt()
    idEmpresa!: number;   // FK para empresa

    @IsInt()
    idEmissor!: number;   // FK para usuário

    @IsNumber()
    valorProposta!: number;

    @IsISO8601()
    prazoValidade!: string;

    @IsEnum(StatusProposta)
    statusProposta!: StatusProposta;

    @IsISO8601()
    dataCriacao?: Date;
}

