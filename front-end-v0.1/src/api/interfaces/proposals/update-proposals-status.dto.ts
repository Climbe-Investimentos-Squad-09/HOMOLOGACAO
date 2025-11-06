import { StatusProposta } from '../entities/proposals.entity';

export interface UpdateProposalStatusDto {
  statusProposta!: StatusProposta; // 'Em_analise' | 'Aprovada' | 'Recusada'
}
