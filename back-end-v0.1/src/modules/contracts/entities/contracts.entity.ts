import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { Proposals } from '../../proposals/entities/proposals.entity';
/*import { User } from '../../users/entities/user.entity'; */

// Segue em comentário as interações ainda não modeladas no sistema


@Entity('Contratos')
export class Contract {
  @PrimaryGeneratedColumn()
  idContrato!: number;

  @OneToOne(() => Proposals, proposal => proposal.idProposta)
  @JoinColumn({ name: 'idProposta' })
  proposta!: Proposals;
  /*
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'idCompliance' })
  compliance?: User; */

  @Column({
    type: 'enum',
    enum: ['Ativo', 'Encerrado', 'Rescindido'],
    default: 'Ativo'
  })
  statusContrato!: string;

  @CreateDateColumn({ name: 'dataCriacao' })
  dataCriacao!: Date;

  @Column({ type: 'date', nullable: true })
  dataEncerramento?: Date;
}