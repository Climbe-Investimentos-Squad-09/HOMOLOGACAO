import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsInt()
  idEmpresa!: number;

  @IsOptional()
  @IsInt()
  idContrato?: number;

  @IsOptional()
  @IsInt()
  idResponsavel?: number;
}

