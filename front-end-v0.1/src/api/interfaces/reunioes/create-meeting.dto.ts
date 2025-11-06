import { ModalidadeReuniao } from '../Entities/meeting.entity';

export interface CreateReuniaoDto {
  titulo: string;

  pauta?: string;

  dataHoraInicio: string;

  dataHoraFim: string;

  modalidade: ModalidadeReuniao;

  local?: string;        // recomendado se PRESENCIAL

  linkRemoto?: string;   // recomendado se REMOTO
}
