import { StatusAtividade } from '../Entities/meeting-activity.entity';

export interface AddAtividadeDto {
  descricao: string;

  idResponsavel?: number;

  prazo?: string;

  status?: StatusAtividade;
}
