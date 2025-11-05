import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Companies } from '../../companies/entities/companies.entity';
import { Contract } from '../../contracts/entities/contracts.entity';
import { ProposalAssignee } from './proposal-assignee.entity';

export enum StatusProposta {
  EM_ANALISE = 'Em_analise',
  APROVADA = 'Aprovada',
  RECUSADA = 'Recusada'
}

@Entity('Propostas')
export class Proposals {
  @PrimaryGeneratedColumn()
  idProposta!: number;

  @Column()
  idEmpresa!: number;

  @ManyToOne(() => Companies)
  @JoinColumn({ name: 'idEmpresa', referencedColumnName: 'idEmpresa' })
  empresa!: Companies;

  @ManyToOne(()=> User, {eager: true})
  @JoinColumn({ name: 'idEmissor', referencedColumnName: 'idUsuario' })
  idEmissor!: number;


  @Column('decimal', { precision: 15, scale: 2 })
  valorProposta!: number;

  @Column({ type: 'date' })
  prazoValidade!: string;

  @Column({ type: 'enum', enum: StatusProposta, default: StatusProposta.EM_ANALISE })
  statusProposta!: StatusProposta;

@OneToMany(() => ProposalAssignee, (a: ProposalAssignee) => a.proposta, { cascade: true })
atribuicoes!: ProposalAssignee[];

@ManyToOne(() => Proposals, { nullable: true })
contrapropostaDe?: Proposals; // encadeamento de contrapropostas

  @CreateDateColumn()
  dataCriacao!: Date;

  @OneToOne(() => Contract, (contract) => contract.proposta)
  contrato?: Contract;
}
