import { Companies } from '../../companies/entities/companies.entity';

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

@Entity('Arquivos')
export class File {
    @PrimaryGeneratedColumn()
    idArquivo!: string;

    @Column()
    nomeArquivo!: string;

    @ManyToOne(() => Companies, { nullable: true })
    @Column()
    nomeEmpresa!: string;

    @Column()
    urlArquivo!: string;

    @Column()
    emailUsuario!: string;

    @CreateDateColumn({ name: 'dataEnvio' })
    dataEnvio!: Date;
}