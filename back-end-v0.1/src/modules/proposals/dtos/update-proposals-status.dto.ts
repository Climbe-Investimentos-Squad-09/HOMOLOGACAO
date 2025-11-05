// src/modules/proposals/dtos/update-proposal-status.dto.ts
import { IsEnum } from 'class-validator';
import { StatusProposta } from '../entities/proposals.entity';

export class UpdateProposalStatusDto {
  @IsEnum(StatusProposta)
  statusProposta!: StatusProposta; // 'Em_analise' | 'Aprovada' | 'Recusada'
}
