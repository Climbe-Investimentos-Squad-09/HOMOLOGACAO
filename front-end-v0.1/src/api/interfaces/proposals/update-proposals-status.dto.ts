export enum StatusProposta {
  EM_ANALISE = 'Em_analise',
  APROVADA = 'Aprovada',
  RECUSADA = 'Recusada'
}
export interface UpdateProposalStatusDto {
  statusProposta: StatusProposta; // 'Em_analise' | 'Aprovada' | 'Recusada'
}
