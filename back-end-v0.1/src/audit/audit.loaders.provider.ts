// src/audit/audit.loaders.provider.ts
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from '@nestjs/common';
import { AuditRegistry } from './audit.registry';
import { Contract } from '../modules/contracts/entities/contracts.entity';
import { Proposals } from '../modules/proposals/entities/proposals.entity';
import { User } from '../modules/user/entities/user.entity';
import { Companies } from '../modules/companies/entities/companies.entity';

export const AuditLoadersProvider: Provider = {
  provide: 'AUDIT_LOADERS',
  useFactory: (
    registry: AuditRegistry,
    contractRepo: Repository<Contract>,
    proposalRepo: Repository<Proposals>,
    userRepo: Repository<User>,
    companiesRepo: Repository<Companies>,
  ) => {
    // contracts
    registry.register('contracts', async (id: string | number) => {
      const idNum = Number(id);
      if (Number.isNaN(idNum)) return null;
      return contractRepo.findOne({
        where: { idContrato: idNum },
        relations: ['proposta', 'compliance', 'atribuicoes'],
      });
    });

    // proposals
    registry.register('proposals', async (id: string | number) => {
      const idNum = Number(id);
      if (Number.isNaN(idNum)) return null;
      return proposalRepo.findOne({
        where: { idProposta: idNum },
        relations: ['empresa', 'contrato', 'atribuicoes'],
      });
    });

    // usuarios
    registry.register('usuarios', async (id: string | number) => {
      const idNum = Number(id);
      if (Number.isNaN(idNum)) return null;
      return userRepo.findOne({
        where: { idUsuario: idNum },
        relations: ['cargo', 'permissoesExtras'],
      });
    });

    // companies
    registry.register('companies', async (id: string | number) => {
      const idNum = Number(id);
      if (Number.isNaN(idNum)) return null;
      return companiesRepo.findOne({
        where: { idEmpresa: idNum },
      });
    });

    // se você tiver documentos futuramente:
    // registry.register('documentos', (id) => documentRepo.findOne({ where: { idDocumento: Number(id) } }));

    // precisa retornar algo
    return true;
  },
  inject: [
    AuditRegistry,
    getRepositoryToken(Contract),
    getRepositoryToken(Proposals),
    getRepositoryToken(User),
    getRepositoryToken(Companies),
  ],
};
