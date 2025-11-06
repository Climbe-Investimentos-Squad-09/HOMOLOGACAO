export enum ModalidadeReuniao {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  OUTRO = 'OUTRO',
}
export interface CreateReuniaoDto {
  titulo: string;

  pauta?: string;

  dataHoraInicio: string;

  dataHoraFim: string;

  modalidade: ModalidadeReuniao;

  local?: string;        // recomendado se PRESENCIAL

  linkRemoto?: string;   // recomendado se REMOTO
}
