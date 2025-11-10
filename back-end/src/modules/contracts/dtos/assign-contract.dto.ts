// src/modules/contracts/dtos/assign-contract.dto.ts
import { IsEnum, IsInt, IsArray, ArrayMinSize, ValidateNested, IsOptional, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContractAssigneeRoleDto {
  ANALISTA = 'ANALISTA',
  CSO = 'CSO',
  CMO = 'CMO',
}

export class AssignContractDto {
  @Type(() => Number) @IsInt() @Min(1)
  idUsuario!: number;

  @IsEnum(ContractAssigneeRoleDto)
  role!: ContractAssigneeRoleDto;
}

export class AssignManyContractDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssignContractDto)
  items!: AssignContractDto[];

  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}
