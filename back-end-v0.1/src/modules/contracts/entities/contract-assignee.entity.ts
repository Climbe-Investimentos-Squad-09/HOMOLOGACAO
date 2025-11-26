// src/modules/contracts/entities/contract-assignee.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Contract } from './contracts.entity';
import { User } from '../../user/entities/user.entity';

export type ContractAssigneeRole = 'ANALISTA' | 'CSO' | 'CMO';

@Entity('contracts_atribuicoes')
@Unique(['contrato', 'role']) // no máximo 1 usuário por papel no contrato
export class ContractAssignee {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Contract, (c) => c.atribuicoes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idContrato', referencedColumnName: 'idContrato' })
  contrato!: Contract;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idUsuario', referencedColumnName: 'idUsuario' })
  usuario!: User;

  @Column({ type: 'enum', enum: ['ANALISTA', 'CSO', 'CMO'] })
  role!: ContractAssigneeRole;

  @CreateDateColumn()
  criadoEm!: Date;
}

export default ContractAssignee;
