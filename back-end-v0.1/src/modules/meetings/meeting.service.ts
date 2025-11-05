// src/modules/meetings/reunioes.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ModalidadeReuniao, Reuniao, StatusReuniao } from './entities/meeting.entity';
import { ReuniaoParticipante, StatusConvite } from './entities/meeting-member.entity';
import { ReuniaoAtividade, StatusAtividade } from './entities/meeting-activity.entity';
import { CreateReuniaoDto } from './dtos/create-meeting.dto';
import { UpdateReuniaoDto } from './dtos/update-meeting.dto';
import { AddParticipanteDto } from './dtos/add-member.dto';
import { UpdateParticipanteStatusDto } from './dtos/update-member-status.dto';
import { AddAtividadeDto } from './dtos/add-activity.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReunioesService {
  constructor(
    @InjectRepository(Reuniao) private readonly reuniaoRepo: Repository<Reuniao>,
    @InjectRepository(ReuniaoParticipante) private readonly partRepo: Repository<ReuniaoParticipante>,
    @InjectRepository(ReuniaoAtividade) private readonly atividadeRepo: Repository<ReuniaoAtividade>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  // Hierarquia - Compara/identifica Cargos de alta hierarquia
  private isSuperior(cargoNome?: string | null) {
    return ['SysAdmin', 'Compliance', 'CEO'].includes(cargoNome || '');
  }

  private validateDates(inicio: Date, fim: Date) {
    if (!(inicio instanceof Date) || !(fim instanceof Date) || isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
      throw new BadRequestException('Datas inválidas');
    }
    if (inicio >= fim) throw new BadRequestException('dataHoraInicio deve ser anterior a dataHoraFim');
  }

  private validateModalidade(dto: { modalidade: ModalidadeReuniao; local?: string; linkRemoto?: string }) {
    if (dto.modalidade === ModalidadeReuniao.PRESENCIAL && !dto.local) {
      throw new BadRequestException('Campo "local" é obrigatório quando a modalidade é PRESENCIAL');
    }
    if (dto.modalidade === ModalidadeReuniao.REMOTO && !dto.linkRemoto) {
      throw new BadRequestException('Campo "linkRemoto" é obrigatório quando a modalidade é REMOTO');
    }
  }

  async create(dto: CreateReuniaoDto, currentUser: any) {
    const inicio = new Date(dto.dataHoraInicio);
    const fim = new Date(dto.dataHoraFim);
    this.validateDates(inicio, fim);
    this.validateModalidade(dto);

    const entity = this.reuniaoRepo.create({
      titulo: dto.titulo,
      pauta: dto.pauta,
      dataHoraInicio: inicio,
      dataHoraFim: fim,
      modalidade: dto.modalidade,
      local: dto.local,
      linkRemoto: dto.linkRemoto,
      criador: { idUsuario: currentUser.id } as User,
      status: StatusReuniao.AGENDADA,
    });

    const saved = await this.reuniaoRepo.save(entity);

    // criador como participante ACEITO
    const part = this.partRepo.create({
      reuniao: saved,
      usuario: { idUsuario: currentUser.id } as User,
      statusConvite: StatusConvite.ACEITO,
    });
    await this.partRepo.save(part);

    return saved;
  }

  async findById(id: number) {
    const r = await this.reuniaoRepo.findOne({
      where: { idReuniao: id },
      relations: ['participantes', 'participantes.usuario', 'atividades', 'criador'],
    });
    if (!r) throw new NotFoundException('Reunião não encontrada');
    return r;
  }

  async findByPeriod(from?: string, to?: string) {
    if (from && to) {
      return this.reuniaoRepo.find({
        where: { dataHoraInicio: Between(new Date(from), new Date(to)) },
        order: { dataHoraInicio: 'ASC' },
      });
    }
    if (from) {
      return this.reuniaoRepo.find({
        where: { dataHoraInicio: MoreThanOrEqual(new Date(from)) },
        order: { dataHoraInicio: 'ASC' },
      });
    }
    if (to) {
      return this.reuniaoRepo.find({
        where: { dataHoraInicio: LessThanOrEqual(new Date(to)) },
        order: { dataHoraInicio: 'ASC' },
      });
    }
    return this.reuniaoRepo.find({ order: { dataHoraInicio: 'ASC' } });
  }

  async update(id: number, dto: UpdateReuniaoDto, currentUser: any) {
    const existing = await this.findById(id);

    const isOwner = existing.criador?.idUsuario === currentUser.id;
    const isSup = this.isSuperior(currentUser?.cargo?.nome);
    if (!isOwner && !isSup) {
      throw new ForbiddenException('Apenas o criador ou cargos superiores podem editar');
    }

    const inicio = dto.dataHoraInicio ? new Date(dto.dataHoraInicio) : existing.dataHoraInicio;
    const fim = dto.dataHoraFim ? new Date(dto.dataHoraFim) : existing.dataHoraFim;
    this.validateDates(inicio, fim);

    const modalidade = dto.modalidade ?? existing.modalidade;
    const local = dto.local ?? existing.local;
    const linkRemoto = dto.linkRemoto ?? existing.linkRemoto;
    this.validateModalidade({ modalidade, local, linkRemoto });

    Object.assign(existing, {
      titulo: dto.titulo ?? existing.titulo,
      pauta: dto.pauta ?? existing.pauta,
      dataHoraInicio: inicio,
      dataHoraFim: fim,
      modalidade,
      local,
      linkRemoto,
      status: dto.status ?? existing.status,
    });

    return this.reuniaoRepo.save(existing);
  }

  async remove(id: number, currentUser: any) {
    const existing = await this.findById(id);
    const isOwner = existing.criador?.idUsuario === currentUser.id;
    const isSup = this.isSuperior(currentUser?.cargo?.nome);
    if (!isOwner && !isSup) {
      throw new ForbiddenException('Apenas o criador ou cargos superiores podem excluir');
    }
    await this.reuniaoRepo.remove(existing);
    return { message: 'Reunião removida' };
  }

  async addParticipante(id: number, dto: AddParticipanteDto, currentUser: any) {
    const r = await this.findById(id);
    const isOwner = r.criador?.idUsuario === currentUser.id;
    const isSup = this.isSuperior(currentUser?.cargo?.nome);
    if (!isOwner && !isSup) {
      throw new ForbiddenException('Apenas o criador ou cargos superiores podem convidar');
    }
    const user = await this.userRepo.findOne({ where: { idUsuario: dto.idUsuario } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const entity = this.partRepo.create({
      reuniao: r,
      usuario: user,
      statusConvite: StatusConvite.PENDENTE,
    });
    return this.partRepo.save(entity);
  }

  async updateParticipanteStatus(id: number, dto: UpdateParticipanteStatusDto, currentUser: any) {
    const p = await this.partRepo.findOne({
      where: { id },
      relations: ['usuario', 'reuniao', 'reuniao.criador'],
    });
    if (!p) throw new NotFoundException('Participação não encontrada');

    if (p.usuario.idUsuario !== currentUser.id) {
      throw new ForbiddenException('Você só pode atualizar seu próprio status de convite');
    }

    p.statusConvite = dto.statusConvite;
    return this.partRepo.save(p);
  }

  async addAtividade(idReuniao: number, dto: AddAtividadeDto, currentUser: any) {
    const r = await this.findById(idReuniao);
    const isOwner = r.criador?.idUsuario === currentUser.id;
    const isSup = this.isSuperior(currentUser?.cargo?.nome);
    if (!isOwner && !isSup) {
      throw new ForbiddenException('Apenas o criador ou cargos superiores podem criar atividades');
    }

    const atividade = this.atividadeRepo.create({
      reuniao: r,
      descricao: dto.descricao,
      responsavel: dto.idResponsavel ? ({ idUsuario: dto.idResponsavel } as User) : undefined,
      prazo: dto.prazo ? new Date(dto.prazo) : undefined,
      status: dto.status ?? StatusAtividade.PENDENTE,
    });
    return this.atividadeRepo.save(atividade);
  }
}