// src/modules/meetings/dtos/add-activity.dto.ts
import { IsString, IsOptional, IsInt, IsISO8601, IsEnum } from 'class-validator';
import { StatusAtividade } from '../Entities/meeting-activity.entity';

export class AddAtividadeDto {
  @IsString()
  descricao!: string;

  @IsOptional()
  @IsInt()
  idResponsavel?: number;

  @IsOptional()
  @IsISO8601()
  prazo?: string;

  @IsOptional()
  @IsEnum(StatusAtividade)
  status?: StatusAtividade;
}
