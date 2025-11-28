import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Proposals } from '../../proposals/entities/proposals.entity';
import { User } from '../../user/entities/user.entity'; 
import { ContractAssignee } from './contract-assignee.entity';


export enum StatusContrato {
  Ativo = 'Ativo',
  Encerrado = 'Encerrado',
  Rescindido = 'Rescindido',
}

@Entity('Contratos')
export class Contract {
  @PrimaryGeneratedColumn()
  idContrato!: number;

  @OneToOne(() => Proposals, proposal => proposal.idProposta)
  @JoinColumn({ name: 'idProposta' })
  proposta!: Proposals;
  
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'idCompliance' })
  compliance!: User; 

  @Column({
    type: 'enum',
    enum: ['Ativo', 'Encerrado', 'Rescindido', 'Em_revisao'],
    default: 'Ativo'
  })
  statusContrato!: string;

  @CreateDateColumn({ name: 'dataCriacao' })
  dataCriacao!: Date;

  @Column({ type: 'date', nullable: true })
  dataEncerramento?: Date;

  @Column({ type: 'date', nullable: true })
  dataInicio?: Date;

  @Column({ type: 'date', nullable: true })
  dataFim?: Date;

  @OneToMany(() => ContractAssignee, (a: ContractAssignee) => a.contrato, { cascade: true })
atribuicoes!: ContractAssignee[];

}