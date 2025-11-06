// papéis válidos para atribuição em PROPOSTAS
export enum ProposalAssigneeRoleDto {
  ANALISTA = 'ANALISTA',
  CSO = 'CSO',
  CMO = 'CMO',
}

// atribuição unitária: 1 usuário + 1 papel
export interface AssignProposalDto {
  idUsuario: number;

  role: ProposalAssigneeRoleDto;
}

// atribuição em lote (opcional)
export interface AssignManyProposalDto {
  items: AssignProposalDto[];

  // se true, remove atribuições atuais e substitui pelas novas
  replaceExisting?: boolean;
}
