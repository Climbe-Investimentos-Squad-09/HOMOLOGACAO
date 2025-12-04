// src/modules/proposals/proposals.service.ts
import { UseGuards, Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Proposals, StatusProposta } from './entities/proposals.entity';
import { ProposalAssignee } from './entities/proposal-assignee.entity';
import { CreateProposalsDto } from './dtos/create-proposals.dto';
import { UpdateProposalsDto } from './dtos/update-proposals.dto';
import { AssignProposalDto } from './dtos/assign-proposals.dto';
import { User } from '../user/entities/user.entity';

import { driveService } from '../drive/drive.service';

@Injectable()
export class ProposalsService {
  constructor(
    @InjectRepository(Proposals)
    private readonly proposalsRepo: Repository<Proposals>,
    @InjectRepository(ProposalAssignee)
    private readonly propAssignRepo: Repository<ProposalAssignee>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private DriveService: driveService
  ) {}

  // -------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------
  async create(
    dto: CreateProposalsDto
  ): Promise<Proposals> {
    if (!dto) throw new BadRequestException('Dados da proposta são obrigatórios');

    if (!dto.idEmpresa || dto.idEmpresa <= 0) throw new BadRequestException('ID da empresa é obrigatório');
    if (!dto.idEmissor || dto.idEmissor <= 0) throw new BadRequestException('ID do emissor é obrigatório');
    if (!dto.valorProposta || dto.valorProposta <= 0) throw new BadRequestException('Valor da proposta é obrigatório');
    if (!dto.prazoValidade) throw new BadRequestException('Prazo de validade é obrigatório');

    // status default na entity é EM_ANALISE; aqui só valida se vier
    if (dto.statusProposta && !Object.values(StatusProposta).includes(dto.statusProposta)) {
      throw new BadRequestException('Status da proposta inválido');
    }

    const proposal = this.proposalsRepo.create({
      idEmpresa: dto.idEmpresa,
      idEmissor: dto.idEmissor,
      valorProposta: dto.valorProposta,
      prazoValidade: dto.prazoValidade,
      statusProposta: dto.statusProposta ?? StatusProposta.EM_ANALISE,
    });

    this.DriveService.createFolder("", false, dto.idEmpresa)
    return this.proposalsRepo.save(proposal);
  }

  // -------------------------------------------------------------------
  // READ / LIST COM FILTROS
  // -------------------------------------------------------------------
  async findByFilters(query: any): Promise<Proposals[]> {
    const {
      idEmpresa,
      idEmissor,
      statusProposta,
      from, // YYYY-MM-DD
      to,   // YYYY-MM-DD
    } = query || {};

    const qb = this.proposalsRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.empresa', 'empresa')
      .leftJoinAndSelect('p.atribuicoes', 'atribuicoes')
      .leftJoinAndSelect('atribuicoes.usuario', 'usuario')
      .leftJoin('p.idEmissor', 'emissor')
      .addSelect(['emissor.idUsuario', 'emissor.nomeCompleto']);

    if (idEmpresa) qb.andWhere('p.idEmpresa = :idEmpresa', { idEmpresa: Number(idEmpresa) });
    if (idEmissor) qb.andWhere('p.idEmissor = :idEmissor', { idEmissor: Number(idEmissor) });
    if (statusProposta) qb.andWhere('p.statusProposta = :statusProposta', { statusProposta });

    if (from && to) {
      // between inclusivo
      qb.andWhere('p.dataCriacao BETWEEN :from::timestamptz AND :to::timestamptz', {
        from: `${from}T00:00:00Z`,
        to: `${to}T23:59:59Z`,
      });
    } else if (from) {
      qb.andWhere('p.dataCriacao >= :from::timestamptz', { from: `${from}T00:00:00Z` });
    } else if (to) {
      qb.andWhere('p.dataCriacao <= :to::timestamptz', { to: `${to}T23:59:59Z` });
    }

    qb.orderBy('p.dataCriacao', 'DESC');

    return qb.getMany();
  }

  async findById(id: string): Promise<Proposals> {
    const num = Number(id);
    if (!num) throw new BadRequestException('ID da proposta inválido');

    const proposal = await this.proposalsRepo.findOne({ 
      where: { idProposta: num },
      relations: ['empresa', 'atribuicoes', 'atribuicoes.usuario', 'idEmissor']
    });
    if (!proposal) throw new NotFoundException('Proposta não encontrada');

    return proposal;
  }

  // -------------------------------------------------------------------
  // UPDATE (dados gerais, não status)
  // -------------------------------------------------------------------
  async update(id: string | number, dto: UpdateProposalsDto): Promise<Proposals> {
    const num = Number(id);
    if (!num) throw new BadRequestException('ID da proposta inválido');

    const proposal = await this.proposalsRepo.findOne({ where: { idProposta: num } });
    if (!proposal) throw new NotFoundException('Proposta não encontrada');

    if (dto.valorProposta !== undefined && dto.valorProposta <= 0) {
      throw new BadRequestException('Valor da proposta deve ser maior que zero');
    }

    if (dto.idEmpresa !== undefined && dto.idEmpresa <= 0) {
      throw new BadRequestException('ID da empresa inválido');
    }

    // statusProposta não é atualizado aqui; há endpoint próprio
    const toSave: Partial<Proposals> = {
      ...proposal,
      ...(dto.idEmpresa !== undefined ? { idEmpresa: dto.idEmpresa } : {}),
      ...(dto.valorProposta !== undefined ? { valorProposta: dto.valorProposta } : {}),
      ...(dto.prazoValidade !== undefined ? { prazoValidade: dto.prazoValidade } : {}),
      // dataCriacao em geral não deve ser mexida; se quiser suportar, descomente:
      // ...(dto.dataCriacao ? { dataCriacao: new Date(dto.dataCriacao) } : {}),
    };

    return this.proposalsRepo.save(toSave);
  }

  // -------------------------------------------------------------------
  // DELETE
  // -------------------------------------------------------------------
  async delete(id: string | number): Promise<{ message: string }> {
    const num = Number(id);
    if (!num) throw new BadRequestException('ID da proposta inválido');

    const proposal = await this.proposalsRepo.findOne({ where: { idProposta: num } });
    if (!proposal) throw new NotFoundException('Proposta não encontrada');

    await this.proposalsRepo.remove(proposal);
    return { message: 'Proposta removida com sucesso' };
  }

  // -------------------------------------------------------------------
  // ASSIGN (ANALISTA / CSO / CMO) — substitui se já houver alguém no papel
  // -------------------------------------------------------------------
  async assign(idProposta: number, rawDto: AssignProposalDto | any, _user?: any) {
    if (!idProposta) throw new BadRequestException('ID da proposta inválido');

    const proposta = await this.proposalsRepo.findOne({ where: { idProposta } });
    if (!proposta) throw new NotFoundException('Proposta não encontrada');

    // Normaliza payload (Swagger exemplo usa userId)
    const dto: AssignProposalDto = {
      idUsuario: Number(rawDto.idUsuario ?? rawDto.userId),
      role: rawDto.role,
    };

    if (!dto.idUsuario || dto.idUsuario <= 0) throw new BadRequestException('idUsuario inválido');
    if (!dto.role || !['ANALISTA', 'CSO', 'CMO'].includes(dto.role)) {
      throw new BadRequestException('role inválido (ANALISTA | CSO | CMO)');
    }

    // Garante que usuário existe
    const usuario = await this.userRepo.findOne({ where: { idUsuario: dto.idUsuario as any } as any });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    // Verifica se já existe alguém nesse papel para a proposta
    const existing = await this.propAssignRepo.findOne({
      where: { proposta: { idProposta }, role: dto.role as any },
      relations: ['proposta', 'usuario'],
    });

    if (existing) {
      // Se já é o mesmo usuário, não faz nada
      if ((existing.usuario as any).idUsuario === dto.idUsuario) return existing;

      // Substitui (regra de negócio atual)
      await this.propAssignRepo.remove(existing);
    }

    const newAssign = this.propAssignRepo.create({
      proposta: { idProposta } as any,
      usuario: { idUsuario: dto.idUsuario } as any,
      role: dto.role as any,
    });

    return this.propAssignRepo.save(newAssign);
  }

  // -------------------------------------------------------------------
  // UPDATE STATUS — endpoint dedicado
  // -------------------------------------------------------------------
  async updateStatus(idProposta: number, dto: { statusProposta: StatusProposta }, user?: any) {
    if (!idProposta) throw new BadRequestException('ID da proposta inválido');
    if (!dto?.statusProposta) throw new BadRequestException('statusProposta é obrigatório');

    if (user) {
      const roleName = user.cargo?.nome || user.cargo?.nomeCargo
      if (!roleName || !['SysAdmin', 'Compliance'].includes(roleName)) {
        throw new BadRequestException('Apenas Compliance e Admin podem alterar o status de propostas');
      }
    }

    const proposta = await this.proposalsRepo.findOne({ where: { idProposta } });
    if (!proposta) throw new NotFoundException('Proposta não encontrada');

    // Regras simples de transição (ajuste se quiser algo mais rígido)
    const current = proposta.statusProposta;
    const next = dto.statusProposta;

    if (current === next) return proposta;

    const allowedFromAnalise = [StatusProposta.APROVADA, StatusProposta.RECUSADA];
    if (current === StatusProposta.EM_ANALISE && !allowedFromAnalise.includes(next)) {
      throw new BadRequestException(`Transição inválida a partir de ${current}`);
    }

    // Se quiser bloquear sair de APROVADA/RECUSADA, descomente:
    // if ([StatusProposta.APROVADA, StatusProposta.RECUSADA].includes(current)) {
    //   throw new BadRequestException(`Não é permitido alterar status após ${current}`);
    // }

    proposta.statusProposta = next;

    return this.proposalsRepo.save(proposta);
  }
}
