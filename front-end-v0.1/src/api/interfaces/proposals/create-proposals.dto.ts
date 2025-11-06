import { StatusProposta } from '../entities/proposals.entity';

export interface CreateProposalsDto {    
    idEmpresa: number;   // FK para empresa
    
    idEmissor: number;   // FK para usuário
    
    valorProposta: number;
    
    prazoValidade: string;

    statusProposta: StatusProposta;
    
    dataCriacao?: Date;
}

