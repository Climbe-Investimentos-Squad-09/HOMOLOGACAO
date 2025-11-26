// src/modules/proposals/entities/proposal-assignee.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Unique,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Proposals } from './proposals.entity';
import { User } from '../../user/entities/user.entity';

// Tipagem TS (não é o enum do Postgres, é só para o TypeScript)
export type ProposalAssigneeRole = 'ANALISTA' | 'CSO' | 'CMO';

@Entity('propostas_atribuicoes')
@Unique('UQ_proposta_role', ['proposta', 'role']) // garante no máx. 1 por função na proposta
export class ProposalAssignee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index('IDX_prop_attr_proposta')
  @ManyToOne(() => Proposals, (p) => p.atribuicoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idProposta', referencedColumnName: 'idProposta' })
  proposta!: Proposals;

  @Index('IDX_prop_attr_usuario')
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario', referencedColumnName: 'idUsuario' })
  usuario!: User;

  @Column({
    type: 'enum',
    enum: ['ANALISTA', 'CSO', 'CMO'],
    enumName: 'proposal_assignee_role_enum', // <- importante no Postgres
  })
  role!: ProposalAssigneeRole;

  @CreateDateColumn()
  criadoEm!: Date;
}
