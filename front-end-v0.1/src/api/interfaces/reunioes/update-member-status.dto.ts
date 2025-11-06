export enum StatusConvite {
  PENDENTE = 'Pendente',
  ACEITO = 'Aceito',
  RECUSADO = 'Recusado',
}


export interface UpdateParticipanteStatusDto {
  statusConvite: StatusConvite;
}
