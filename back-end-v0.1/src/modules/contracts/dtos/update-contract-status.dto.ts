// src/modules/contracts/dtos/update-contract-status.dto.ts
import { IsEnum, IsISO8601, IsOptional, ValidateIf } from 'class-validator';
import { StatusContrato } from '../entities/contracts.entity';

export class UpdateContractStatusDto {
  @IsEnum(StatusContrato)
  statusContrato!: StatusContrato;

  @IsOptional()
  @ValidateIf((o) => o.statusContrato === StatusContrato.Encerrado || o.statusContrato === StatusContrato.Rescindido)
  @IsISO8601()
  dataEncerramento?: string;
}
