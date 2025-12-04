// src/modules/contracts/contracts.service.ts
import {
  Injectable, BadRequestException, NotFoundException, ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contract, StatusContrato } from './entities/contracts.entity';
import { Proposals, StatusProposta } from '../proposals/entities/proposals.entity';
import { ContractAssignee } from './entities/contract-assignee.entity';
import { User } from '../user/entities/user.entity';

import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';
import { UpdateContractStatusDto } from './dtos/update-contract-status.dto';
import { AssignContractDto, AssignManyContractDto } from './dtos/assign-contract.dto';

import { driveService } from '../drive/drive.service';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepo: Repository<Contract>,
    @InjectRepository(Proposals)
    private readonly proposalsRepo: Repository<Proposals>,
    @InjectRepository(ContractAssignee)
    private readonly contractAssignRepo: Repository<ContractAssignee>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private DriveService: driveService
  ) {}

  // -------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------
  async create(dto: CreateContractDto): Promise<Contract> {
    if (!dto) throw new BadRequestException('Dados do contrato são obrigatórios');
    if (!dto.idProposta || dto.idProposta <= 0) throw new BadRequestException('idProposta é obrigatório');

    // valida proposta
    const proposta = await this.proposalsRepo.findOne({ where: { idProposta: dto.idProposta } });
    if (!proposta) throw new NotFoundException('Proposta não encontrada');

    // regra: 1:1 (uma proposta só pode virar um contrato)
    const existing = await this.contractsRepo.findOne({ where: { proposta: { idProposta: dto.idProposta } as any } });
    if (existing) throw new ConflictException('Já existe contrato para esta proposta');

    // (opcional) só permite criar contrato se proposta estiver APROVADA
    if (proposta.statusProposta !== StatusProposta.APROVADA) {
      throw new BadRequestException('Contrato só pode ser criado a partir de proposta Aprovada');
    }

    // valida compliance se vier
    if (dto.idCompliance && dto.idCompliance <= 0) {
      throw new BadRequestException('idCompliance inválido');
    }
    if (dto.idCompliance) {
      const compUser = await this.userRepo.findOne({ where: { idUsuario: dto.idCompliance as any } as any });
      if (!compUser) throw new NotFoundException('Usuário compliance não encontrado');
    }

    // cria contrato
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let calculatedStatus = dto.statusContrato
    
    if (dto.dataInicio && dto.dataFim) {
      const dataInicio = new Date(dto.dataInicio)
      const dataFim = new Date(dto.dataFim)
      dataInicio.setHours(0, 0, 0, 0)
      dataFim.setHours(0, 0, 0, 0)
      
      if (today < dataInicio) {
        calculatedStatus = 'Em_revisao' as any
      } else if (today > dataFim) {
        calculatedStatus = StatusContrato.Encerrado
      } else {
        calculatedStatus = StatusContrato.Ativo
      }
    } else if (!dto.statusContrato) {
      calculatedStatus = StatusContrato.Ativo
    }

    const contract = this.contractsRepo.create({
      proposta: { idProposta: dto.idProposta } as any,
      compliance: dto.idCompliance ? ({ idUsuario: dto.idCompliance } as any) : undefined,
      statusContrato: calculatedStatus,
      dataEncerramento: dto.dataEncerramento ? new Date(dto.dataEncerramento) : undefined,
      dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : undefined,
      dataFim: dto.dataFim ? new Date(dto.dataFim) : undefined,
    });

    return this.contractsRepo.save(contract);
  }

  // -------------------------------------------------------------------
  // READ
  // -------------------------------------------------------------------
  async findById(id: number): Promise<Contract> {
    if (!id) throw new BadRequestException('ID inválido');

    const contract = await this.contractsRepo.findOne({
      where: { idContrato: id as any },
      relations: ['proposta', 'proposta.empresa', 'compliance', 'atribuicoes', 'atribuicoes.usuario'],
    });
    if (!contract) throw new NotFoundException('Contrato não encontrado');
    // Recalcula status dinamicamente com base em datas (mesma lógica de findByFilters)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (contract.dataInicio && contract.dataFim) {
      const dataInicio = new Date(contract.dataInicio);
      const dataFim = new Date(contract.dataFim);
      dataInicio.setHours(0, 0, 0, 0);
      dataFim.setHours(0, 0, 0, 0);
      let newStatus = contract.statusContrato;
      if (today < dataInicio) {
        newStatus = 'Em_revisao' as any;
      } else if (today > dataFim) {
        newStatus = StatusContrato.Encerrado;
      } else {
        newStatus = StatusContrato.Ativo;
      }
      if (newStatus !== contract.statusContrato) {
        contract.statusContrato = newStatus;
        await this.contractsRepo.save(contract);
      }
    }
    return contract;
  }

  async findByFilters(query: any): Promise<Contract[]> {
    const { idProposta, idCompliance, statusContrato, from, to } = query || {};
    const qb = this.contractsRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.proposta', 'p')
      .leftJoinAndSelect('p.empresa', 'empresa')
      .leftJoinAndSelect('c.compliance', 'u')
      .leftJoinAndSelect('c.atribuicoes', 'atribuicoes')
      .leftJoinAndSelect('atribuicoes.usuario', 'atribuicoes_usuario');

    if (idProposta) qb.andWhere('p.idProposta = :idProposta', { idProposta: Number(idProposta) });
    if (idCompliance) qb.andWhere('u.idUsuario = :idCompliance', { idCompliance: Number(idCompliance) });
    if (statusContrato) qb.andWhere('c.statusContrato = :statusContrato', { statusContrato });

    if (from && to) {
      qb.andWhere('c.dataCriacao BETWEEN :from::timestamptz AND :to::timestamptz', {
        from: `${from}T00:00:00Z`, to: `${to}T23:59:59Z`,
      });
    } else if (from) {
      qb.andWhere('c.dataCriacao >= :from::timestamptz', { from: `${from}T00:00:00Z` });
    } else if (to) {
      qb.andWhere('c.dataCriacao <= :to::timestamptz', { to: `${to}T23:59:59Z` });
    }

    qb.orderBy('c.dataCriacao', 'DESC');
    const contracts = await qb.getMany();
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (const contract of contracts) {
      if (contract.dataInicio && contract.dataFim) {
        const dataInicio = new Date(contract.dataInicio)
        const dataFim = new Date(contract.dataFim)
        dataInicio.setHours(0, 0, 0, 0)
        dataFim.setHours(0, 0, 0, 0)
        
        let newStatus = contract.statusContrato
        
        if (today < dataInicio) {
          newStatus = 'Em_revisao' as any
        } else if (today > dataFim) {
          newStatus = StatusContrato.Encerrado
        } else {
          newStatus = StatusContrato.Ativo
        }
        
        if (newStatus !== contract.statusContrato) {
          contract.statusContrato = newStatus
          await this.contractsRepo.save(contract)
        }
      }
    }
    
    return contracts
  }

  // -------------------------------------------------------------------
  // UPDATE (geral, não status)
  // -------------------------------------------------------------------
  async update(id: number, dto: UpdateContractDto): Promise<Contract> {
    if (!id) throw new BadRequestException('ID inválido');

    const contract = await this.contractsRepo.findOne({ where: { idContrato: id as any } as any });
    if (!contract) throw new NotFoundException('Contrato não encontrado');

    if (dto.idCompliance !== undefined) {
      if (!dto.idCompliance || dto.idCompliance <= 0) {
        throw new BadRequestException('idCompliance inválido');
      }
      const compUser = await this.userRepo.findOne({ where: { idUsuario: dto.idCompliance as any } as any });
      if (!compUser) throw new NotFoundException('Usuário compliance não encontrado');
      (contract as any).compliance = { idUsuario: dto.idCompliance } as any;
    }

    if (dto.dataEncerramento) {
      contract.dataEncerramento = new Date(dto.dataEncerramento);
    }

    return this.contractsRepo.save(contract);
  }

  async updateDriveLink(id: number, driveLink: string): Promise<Contract> {
    const contract = await this.contractsRepo.findOne({ where: { idContrato: id as any } as any });
    if (!contract) throw new NotFoundException('Contrato não encontrado');

    contract.driveLink = driveLink;
    return this.contractsRepo.save(contract);
  }

  // -------------------------------------------------------------------
  // STATUS
  // -------------------------------------------------------------------
  async updateStatus(id: number, dto: UpdateContractStatusDto): Promise<Contract> {
    if (!id) throw new BadRequestException('ID inválido');

    const contract = await this.contractsRepo.findOne({ where: { idContrato: id as any } as any });
    if (!contract) throw new NotFoundException('Contrato não encontrado');

    const next = dto.statusContrato;
    if (!next) throw new BadRequestException('statusContrato é obrigatório');

    if (next === StatusContrato.Ativo) {
      // voltando para ativo → limpa data de encerramento
      contract.statusContrato = StatusContrato.Ativo;
      contract.dataEncerramento = undefined;
    } else {
      // Encerrar/Rescindir exigem data
      if (!dto.dataEncerramento) {
        throw new BadRequestException('dataEncerramento é obrigatória para Encerrar/Rescindir');
      }
      contract.statusContrato = next;
      contract.dataEncerramento = new Date(dto.dataEncerramento);
    }

    return this.contractsRepo.save(contract);
  }

  // -------------------------------------------------------------------
  // ASSIGN (ANALISTA/CSO/CMO) — substitui quem estiver no papel
  // -------------------------------------------------------------------
  async assign(idContrato: number, dto: AssignContractDto) {
    if (!idContrato) throw new BadRequestException('ID do contrato inválido');

    const contract = await this.contractsRepo.findOne({ where: { idContrato: idContrato as any } as any });
    if (!contract) throw new NotFoundException('Contrato não encontrado');

    if (!dto.idUsuario || dto.idUsuario <= 0) throw new BadRequestException('idUsuario inválido');
    if (!dto.role || !['ANALISTA', 'CSO', 'CMO'].includes(dto.role)) {
      throw new BadRequestException('role inválido (ANALISTA | CSO | CMO)');
    }

    const usuario = await this.userRepo.findOne({ where: { idUsuario: dto.idUsuario as any } as any });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const existing = await this.contractAssignRepo.findOne({
      where: { contrato: { idContrato }, role: dto.role as any },
      relations: ['contrato', 'usuario'],
    });

    if (existing) {
      if ((existing.usuario as any).idUsuario === dto.idUsuario) return existing;
      await this.contractAssignRepo.remove(existing);
    }

    const newAssign = this.contractAssignRepo.create({
      contrato: { idContrato } as any,
      usuario: { idUsuario: dto.idUsuario } as any,
      role: dto.role as any,
    });

    return this.contractAssignRepo.save(newAssign);
  }

  async assignBulk(idContrato: number, dto: AssignManyContractDto) {
    if (!idContrato) throw new BadRequestException('ID do contrato inválido');

    const contract = await this.contractsRepo.findOne({ where: { idContrato: idContrato as any } as any });
    if (!contract) throw new NotFoundException('Contrato não encontrado');

    if (!dto.items || !Array.isArray(dto.items) || dto.items.length === 0) {
      throw new BadRequestException('items é obrigatório e deve ter ao menos 1 elemento');
    }

    if (dto.replaceExisting) {
      // remove todas as atribuições atuais do contrato
      const all = await this.contractAssignRepo.find({ where: { contrato: { idContrato } as any } as any });
      if (all.length) await this.contractAssignRepo.remove(all);
    }

    const results = [];
    for (const item of dto.items) {
      results.push(await this.assign(idContrato, item)); // reutiliza regra
    }
    return results;
  }

  // -------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------
  async delete(id: number): Promise<{ message: string }> {
    if (!id) throw new BadRequestException('ID inválido');

    const contract = await this.contractsRepo.findOne({ where: { idContrato: id as any } as any });
    if (!contract) throw new NotFoundException('Contrato não encontrado');

    await this.contractsRepo.remove(contract);
    return { message: 'Contrato removido com sucesso' };
  }
}
