// src/modules/proposals/dtos/update-proposals.dto.ts
import { IsInt, IsOptional, IsISO8601, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProposalsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idEmpresa?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valorProposta?: number;

  @IsOptional()
  @IsISO8601()
  prazoValidade?: string; // 'YYYY-MM-DD'
}