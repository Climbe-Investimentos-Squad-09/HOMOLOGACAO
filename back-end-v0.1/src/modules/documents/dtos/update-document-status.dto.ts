import { IsEnum } from 'class-validator';
import { StatusDocumento } from '../entities/documents.entity';

export class UpdateDocumentStatusDto {
  @IsEnum(StatusDocumento)
  status!: StatusDocumento;
}

