// src/modules/meetings/dtos/add-member.dto.ts
import { IsInt } from 'class-validator';

export class AddParticipanteDto {
  @IsInt()
  idUsuario!: number;
}
