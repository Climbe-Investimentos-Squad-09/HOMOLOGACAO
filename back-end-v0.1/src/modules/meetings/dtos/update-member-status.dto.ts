// src/modules/meetings/dtos/update-member-status.dto.ts
import { IsEnum } from 'class-validator';
import { StatusConvite } from '../Entities/meeting-member.entity';

export class UpdateParticipanteStatusDto {
  @IsEnum(StatusConvite)
  statusConvite!: StatusConvite;
}
