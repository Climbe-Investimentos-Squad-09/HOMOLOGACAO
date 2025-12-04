import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Companies } from '../../companies/entities/companies.entity';
import { Contract } from '../../contracts/entities/contracts.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Relatorios')
export class Report {
  @PrimaryGeneratedColumn()
  idRelatorio!: number;

  @Column({ type: 'varchar', length: 255 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @Column()
  idEmpresa!: number;

  @ManyToOne(() => Companies)
  @JoinColumn({ name: 'idEmpresa', referencedColumnName: 'idEmpresa' })
  empresa!: Companies;

  @Column({ nullable: true })
  idContrato?: number;

  @ManyToOne(() => Contract, { nullable: true })
  @JoinColumn({ name: 'idContrato', referencedColumnName: 'idContrato' })
  contrato?: Contract;

  @Column({ nullable: true })
  idResponsavel?: number;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'idResponsavel', referencedColumnName: 'idUsuario' })
  responsavel?: User;

  @Column({ type: 'varchar', length: 500, nullable: true })
  driveLink?: string;

  @CreateDateColumn()
  dataCriacao!: Date;
}

