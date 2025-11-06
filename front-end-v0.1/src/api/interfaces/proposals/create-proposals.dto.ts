export enum StatusProposta {
  EM_ANALISE = 'Em_analise',
  APROVADA = 'Aprovada',
  RECUSADA = 'Recusada'
}
export interface CreateProposalsDto {    
    idEmpresa: number;   // FK para empresa
    
    idEmissor: number;   // FK para usuário
    
    valorProposta: number;
    
    prazoValidade: string;

    statusProposta: StatusProposta;
    
    dataCriacao?: Date;
}

