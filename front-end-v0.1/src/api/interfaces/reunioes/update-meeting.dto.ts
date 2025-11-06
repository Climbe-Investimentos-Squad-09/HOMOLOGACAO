import { CreateReuniaoDto } from './create-meeting.dto';

export enum StatusReuniao {
  AGENDADA = 'Agendada',
  EM_ANDAMENTO = 'Em_andamento',
  CONCLUIDA = 'Concluida',
  CANCELADA = 'Cancelada',
  REMARCADA = 'Remarcada',
}

export enum ModalidadeReuniao {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  OUTRO = 'OUTRO',
}

export interface UpdateReuniaoDto extends Partial<CreateReuniaoDto> {  
  titulo?: string;

  pauta?: string;
    
  status?: StatusReuniao;
  
  modalidade?: ModalidadeReuniao;
  
  dataHoraInicio?: string;
  
  dataHoraFim?: string;

  local?: string;
    
  linkRemoto?: string;
}
