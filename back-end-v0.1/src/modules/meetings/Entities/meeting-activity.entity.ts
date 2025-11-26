// src/modules/meetings/entities/reuniao-atividade.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { Reuniao } from './meeting.entity';
import { User } from '../../user/entities/user.entity';

export enum StatusAtividade {
  PENDENTE = 'Pendente',
  EM_PROGRESSO = 'Em_progresso',
  CONCLUIDA = 'Concluida',
}

@Entity('atividades_reuniao')
export class ReuniaoAtividade {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Reuniao, (r) => r.atividades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idReuniao', referencedColumnName: 'idReuniao' })
  reuniao!: Reuniao;

  @Column({ type: 'text' })
  descricao!: string;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'idResponsavel', referencedColumnName: 'idUsuario' })
  responsavel?: User;

  @Column({ type: 'timestamp', nullable: true })
  prazo?: Date;

  @Column({ type: 'enum', enum: StatusAtividade, default: StatusAtividade.PENDENTE })
  status!: StatusAtividade;

  @CreateDateColumn()
  criadoEm!: Date;
}
