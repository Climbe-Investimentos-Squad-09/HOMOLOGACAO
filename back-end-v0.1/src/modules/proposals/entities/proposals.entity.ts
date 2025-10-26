import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
// import { Usuario } from '../../usuario/entities/usuario.entity';
import { Companies } from '../../companies/entities/companies.entity';

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

  @Column()
  idEmissor!: number;

  // Aguardando definição da entidade Usuario

  // @ManyToOne(() => Usuario)
  // @JoinColumn({ name: 'idEmissor', referencedColumnName: 'idUsuario' })
  // emissor: Usuario;

  @Column('decimal')
  valorProposta!: number;

  @Column({ type: 'date' })
  prazoValidade!: string;

  @Column({ type: 'enum', enum: StatusProposta })
  statusProposta!: StatusProposta;

  @CreateDateColumn()
  dataCriacao!: Date;
}
