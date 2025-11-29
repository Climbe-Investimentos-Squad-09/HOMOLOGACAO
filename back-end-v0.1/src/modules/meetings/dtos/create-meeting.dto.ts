// src/modules/meetings/dtos/create-reuniao.dto.ts
import { IsString, IsOptional, IsISO8601, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ModalidadeReuniao } from '../Entities/meeting.entity';

export class CreateReuniaoDto {
  @IsString()
  titulo!: string;

  @IsOptional()
  @IsString()
  pauta?: string;

  @IsISO8601()
  dataHoraInicio!: string;

  @IsISO8601()
  dataHoraFim!: string;

  @IsEnum(ModalidadeReuniao)
  modalidade!: ModalidadeReuniao;

  @IsOptional()
  @IsString()
  local?: string;        // recomendado se PRESENCIAL

  @IsOptional()
  @IsString()
  linkRemoto?: string;   // recomendado se REMOTO

  // e-mails dos participantes (para convidar no Google Calendar)
  @IsOptional()
  @IsArray()
  participantesEmails?: string[];

  // Compatibilidade com front: aceitar opcionalmente empresa/contrato
  @IsOptional()
  @IsNumber()
  idEmpresa?: number;

  @IsOptional()
  @IsNumber()
  idContrato?: number;
}
