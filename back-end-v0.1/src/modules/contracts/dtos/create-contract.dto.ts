// src/modules/contracts/dtos/create-contract.dto.ts
import { IsInt, IsOptional, IsEnum, IsISO8601, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { StatusContrato } from '../entities/contracts.entity';

export class CreateContractDto {
  @Type(() => Number) @IsInt() @Min(1)
  idProposta!: number;

  @IsOptional()
  @Type(() => Number) @IsInt() @Min(1)
  idCompliance?: number;

  @IsOptional()
  @IsEnum(StatusContrato)
  statusContrato?: StatusContrato;

  @IsOptional()
  @ValidateIf((o) => o.statusContrato === StatusContrato.Encerrado || o.statusContrato === StatusContrato.Rescindido)
  @IsISO8601()
  dataEncerramento?: string;

  @IsOptional()
  @IsISO8601()
  dataInicio?: string;

  @IsOptional()
  @IsISO8601()
  dataFim?: string;
}
