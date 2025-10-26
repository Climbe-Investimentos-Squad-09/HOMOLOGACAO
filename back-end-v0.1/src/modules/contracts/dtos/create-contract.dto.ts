import { IsInt, IsOptional, IsEnum, IsDateString } from 'class-validator';

export class CreateContractDto {
    
    
  @IsInt()
  idProposta?: number;

  @IsOptional()
  @IsInt()
  idCompliance?: number;

  @IsOptional()
  @IsEnum(['Ativo', 'Encerrado', 'Rescindido'])
  statusContrato?: string;

  @IsOptional()
  @IsDateString()
  dataEncerramento?: string;
}