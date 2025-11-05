// src/modules/meetings/entities/meetings.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany,
  CreateDateColumn, JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { ReuniaoParticipante } from './meeting-member.entity';
import { ReuniaoAtividade } from './meeting-activity.entity';

export enum StatusReuniao {
  AGENDADA = 'Agendada',
  EM_ANDAMENTO = 'Em_andamento',
  CONCLUIDA = 'Concluida',
  CANCELADA = 'Cancelada',
  REMARCADA = 'Remarcada',
}

export enum ModalidadeReuniao {
  PRESENCIAL = 'PRESENCIAL',
  REMOTO = 'REMOTO',
  OUTRO = 'OUTRO',
}

@Entity('reunioes')
export class Reuniao {
  @PrimaryGeneratedColumn()
  idReuniao!: number;

  @Column({ length: 255 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  pauta?: string;

  @Column({ type: 'timestamp' })
  dataHoraInicio!: Date;

  @Column({ type: 'timestamp' })
  dataHoraFim!: Date;

  @Column({ type: 'enum', enum: ModalidadeReuniao, default: ModalidadeReuniao.PRESENCIAL })
  modalidade!: ModalidadeReuniao;

  @Column({ length: 255, nullable: true })
  local?: string;        // recomendado quando PRESENCIAL

  @Column({ type: 'text', nullable: true })
  linkRemoto?: string;   // recomendado quando REMOTO

  @Column({ type: 'enum', enum: StatusReuniao, default: StatusReuniao.AGENDADA })
  status!: StatusReuniao;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'idCriador', referencedColumnName: 'idUsuario' })
  criador!: User;

  @CreateDateColumn()
  criadoEm!: Date;

  @OneToMany(() => ReuniaoParticipante, (p: any) => p.reuniao, { cascade: true })
  participantes!: ReuniaoParticipante[];

  @OneToMany(() => ReuniaoAtividade, (a: any) => a.reuniao, { cascade: true })
  atividades!: ReuniaoAtividade[];
}
