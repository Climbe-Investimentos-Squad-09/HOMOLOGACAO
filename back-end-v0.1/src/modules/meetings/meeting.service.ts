// src/modules/meetings/reunioes.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { ModalidadeReuniao, Reuniao, StatusReuniao } from './Entities/meeting.entity';
import { ReuniaoParticipante, StatusConvite } from './Entities/meeting-member.entity';
import { ReuniaoAtividade, StatusAtividade } from './Entities/meeting-activity.entity';
import { CreateReuniaoDto } from './dtos/create-meeting.dto';
import { calendarService } from '../calendar/calendar.service';
import { UpdateReuniaoDto } from './dtos/update-meeting.dto';
import { AddParticipanteDto } from './dtos/add-member.dto';
import { UpdateParticipanteStatusDto } from './dtos/update-member-status.dto';
import { AddAtividadeDto } from './dtos/add-activity.dto';
import { User } from '../user/entities/user.entity';

import { GoogleTokens } from '../auth/interfaces/google-tokens.interface';

@Injectable()
export class ReunioesService {
  constructor(
    @InjectRepository(Reuniao) private readonly reuniaoRepo: Repository<Reuniao>,
    @InjectRepository(ReuniaoParticipante) private readonly partRepo: Repository<ReuniaoParticipante>,
    @InjectRepository(ReuniaoAtividade) private readonly atividadeRepo: Repository<ReuniaoAtividade>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly calendar: calendarService,
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
    // Para REMOTO, permitimos ausência de linkRemoto na criação;
    // o link será preenchido automaticamente com o gerado pelo Google Calendar
    // em etapas seguintes do fluxo.
  }

  async create(tokens: GoogleTokens, dto: CreateReuniaoDto, currentUser: any) {
   
    
    if (!currentUser || !currentUser.idUsuario) {
      throw new BadRequestException('Usuário não autenticado ou inválido');
    }
    
    const userId = currentUser.idUsuario;
    
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
      criador: { idUsuario: userId } as User,
      status: StatusReuniao.AGENDADA,
    });

    const saved = await this.reuniaoRepo.save(entity);



    const google = await this.calendar.createReunion(tokens, {
      titulo: dto.titulo,
      empresa_id: String(currentUser?.empresa?.idEmpresa || ''),
      data: inicio,
      hora: '',
      presencial: dto.modalidade === ModalidadeReuniao.PRESENCIAL,
      local: dto.local || '',
      pauta: dto.pauta || '',
      participantesEmails: dto.participantesEmails || [],
    } as any);

    if (google?.id) {
      console.log('4. Atualizando googleEventId e linkRemoto...');
      await this.reuniaoRepo.update(saved.idReuniao, {
        googleEventId: google.id,
        linkRemoto: dto.modalidade === ModalidadeReuniao.REMOTO ? (dto.linkRemoto || google.htmlLink) : saved.linkRemoto,
      });
      
    }

    const part = this.partRepo.create({
      reuniao: { idReuniao: saved.idReuniao } as Reuniao,
      usuario: { idUsuario: userId } as User,
      statusConvite: StatusConvite.ACEITO,
    });

    await this.partRepo.save(part);
    console.log('Participante salvo');

    // adiciona participantes enviados no DTO
    if (dto.participantesEmails && dto.participantesEmails.length) {
      
      for (const email of dto.participantesEmails) {
        const user = await this.userRepo.findOne({ where: { email } as any });
        if (user && user.idUsuario !== userId) {
          // Verifica se já não existe
          const already = await this.partRepo.findOne({
            where: {
              reuniao: { idReuniao: saved.idReuniao } as any,
              usuario: { idUsuario: user.idUsuario } as any,
            },
          });
          if (!already) {
            const p = this.partRepo.create({ 
              reuniao: { idReuniao: saved.idReuniao } as Reuniao,
              usuario: { idUsuario: user.idUsuario } as User,
              statusConvite: StatusConvite.PENDENTE 
            });
            await this.partRepo.save(p);
          }
        }
      }
    }

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

  async findForUser(userId: number) {
    
    const user = await this.userRepo.findOne({ where: { idUsuario: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    
    const qb = this.reuniaoRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.criador', 'criador')
      .leftJoinAndSelect('r.participantes', 'participantes')
      .leftJoinAndSelect('participantes.usuario', 'pUsuario')
      .where('criador.idUsuario = :userId OR pUsuario.idUsuario = :userId', { userId })
      .orderBy('r.dataHoraInicio', 'ASC');
    
    const meetings = await qb.getMany();
    
    return meetings;
  }

  async update(tokens: GoogleTokens, id: number, dto: UpdateReuniaoDto, currentUser: any) {
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

    const saved = await this.reuniaoRepo.save(existing);
    // sincroniza atualização no Google, se houver id
    if (existing.googleEventId) {
      const attendees = [] as { email: string }[];
      const parts = await this.partRepo.find({ where: { reuniao: { idReuniao: id } as any }, relations: ['usuario'] });
      for (const p of parts) {
        if ((p as any).usuario?.email) attendees.push({ email: (p as any).usuario.email });
      }
      await this.calendar.updateEvent(tokens, existing.googleEventId, {
        summary: saved.titulo,
        description: saved.pauta,
        location: saved.local,
        start: { dateTime: saved.dataHoraInicio.toISOString(), timeZone: 'America/Sao_Paulo' },
        end: { dateTime: saved.dataHoraFim.toISOString(), timeZone: 'America/Sao_Paulo' },
        attendees,
      });
    }
    return saved;
  }

  async remove(tokens: GoogleTokens, id: number, currentUser: any) {
    const existing = await this.findById(id);
    const isOwner = existing.criador?.idUsuario === currentUser.id;
    const isSup = this.isSuperior(currentUser?.cargo?.nome);
    if (!isOwner && !isSup) {
      throw new ForbiddenException('Apenas o criador ou cargos superiores podem excluir');
    }
    await this.reuniaoRepo.remove(existing);
    if (existing.googleEventId) {
      await this.calendar.removeEvent(tokens, existing.googleEventId);
    }
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