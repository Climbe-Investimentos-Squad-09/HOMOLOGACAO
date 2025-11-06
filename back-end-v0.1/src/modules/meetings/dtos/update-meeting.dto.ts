import { PartialType } from '@nestjs/mapped-types';
import { CreateReuniaoDto } from './create-meeting.dto';
import { IsEnum, IsOptional, IsISO8601, IsString, ValidateIf } from 'class-validator';
import { StatusReuniao, ModalidadeReuniao } from '../Entities/meeting.entity';

export class UpdateReuniaoDto extends PartialType(CreateReuniaoDto) {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  pauta?: string;
  
  @IsEnum(StatusReuniao)
  @IsOptional()
  status?: StatusReuniao;

  @IsEnum(ModalidadeReuniao)
  @IsOptional()
  modalidade?: ModalidadeReuniao;

  @IsISO8601({ strict: true })
  @IsOptional()
  dataHoraInicio?: string;

  @IsISO8601({ strict: true })
  @IsOptional()
  dataHoraFim?: string;

  @ValidateIf(o => o.modalidade === ModalidadeReuniao.PRESENCIAL)
  @IsString()
  @IsOptional()
  local?: string;

  @ValidateIf(o => o.modalidade === ModalidadeReuniao.REMOTO)
  @IsString()
  @IsOptional()
  linkRemoto?: string;
}
