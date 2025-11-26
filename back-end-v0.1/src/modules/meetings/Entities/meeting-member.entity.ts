// src/modules/meetings/entities/meetings-membes.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, Unique, JoinColumn } from 'typeorm';
import { Reuniao } from './meeting.entity';
import { User } from '../../user/entities/user.entity';

export enum StatusConvite {
  PENDENTE = 'Pendente',
  ACEITO = 'Aceito',
  RECUSADO = 'Recusado',
}

@Entity('participantes_reuniao')
@Unique(['reuniao', 'usuario'])
export class ReuniaoParticipante {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Reuniao, (r) => r.participantes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idReuniao', referencedColumnName: 'idReuniao' })
  reuniao!: Reuniao;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario', referencedColumnName: 'idUsuario' })
  usuario!: User;

  @Column({ type: 'enum', enum: StatusConvite, default: StatusConvite.PENDENTE })
  statusConvite!: StatusConvite;

  @CreateDateColumn()
  convidadoEm!: Date;
}
