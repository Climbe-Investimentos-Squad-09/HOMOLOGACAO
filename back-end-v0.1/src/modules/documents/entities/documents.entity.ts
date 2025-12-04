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

export enum StatusDocumento {
  REVISAO = 'Revisão',
  ACEITO = 'Aceito',
  REJEITADO = 'Rejeitado',
  VALIDADO = 'Validado'
}

@Entity('Documentos')
export class Document {
  @PrimaryGeneratedColumn()
  idDocumento!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  tipo_documento!: string;

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

  @Column({ type: 'enum', enum: StatusDocumento, default: StatusDocumento.REVISAO })
  status!: StatusDocumento;

  @Column({ type: 'varchar', length: 500, nullable: true })
  driveLink?: string;

  @CreateDateColumn()
  dataCriacao!: Date;
}

