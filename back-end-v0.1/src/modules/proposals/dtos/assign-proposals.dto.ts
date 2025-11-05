// src/modules/proposals/dtos/assign-proposal.dto.ts
import { IsEnum, IsInt, IsArray, ArrayMinSize, ValidateNested, IsOptional, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

// papéis válidos para atribuição em PROPOSTAS
export enum ProposalAssigneeRoleDto {
  ANALISTA = 'ANALISTA',
  CSO = 'CSO',
  CMO = 'CMO',
}

// atribuição unitária: 1 usuário + 1 papel
export class AssignProposalDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idUsuario!: number;

  @IsEnum(ProposalAssigneeRoleDto)
  role!: ProposalAssigneeRoleDto;
}

// atribuição em lote (opcional)
export class AssignManyProposalDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssignProposalDto)
  items!: AssignProposalDto[];

  // se true, remove atribuições atuais e substitui pelas novas
  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}
