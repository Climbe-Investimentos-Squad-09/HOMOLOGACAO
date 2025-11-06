export enum StatusAtividade {
  PENDENTE = 'Pendente',
  EM_PROGRESSO = 'Em_progresso',
  CONCLUIDA = 'Concluida',
}
export interface AddAtividadeDto {
  descricao: string;

  idResponsavel?: number;

  prazo?: string;

  status?: StatusAtividade;
}
