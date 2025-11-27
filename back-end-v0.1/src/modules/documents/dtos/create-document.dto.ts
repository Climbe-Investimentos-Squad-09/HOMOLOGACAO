import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { StatusDocumento } from '../entities/documents.entity';

export class CreateDocumentDto {
  @IsString()
  name!: string;

  @IsString()
  tipo_documento!: string;

  @IsInt()
  idEmpresa!: number;

  @IsOptional()
  @IsInt()
  idContrato?: number;

  @IsOptional()
  @IsInt()
  idResponsavel?: number;

  @IsOptional()
  @IsEnum(StatusDocumento)
  status?: StatusDocumento;
}

