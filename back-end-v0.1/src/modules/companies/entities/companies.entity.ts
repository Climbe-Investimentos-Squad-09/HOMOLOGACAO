import { IsEmail } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proposals } from '../../proposals/entities/proposals.entity';
import { Contract } from '../../contracts/entities/contracts.entity';

@Entity('Empresas')
export class Companies {
  @PrimaryGeneratedColumn()
  idEmpresa!: number;

  @Column({ type: 'varchar', nullable: true })
  razaoSocial?: string;

  @Column({ type: 'varchar' })
  nomeFantasia!: string;

  @Column({ type: 'varchar' , nullable: true, unique: true})
  cnpj!: string;

  @Column({ type: 'varchar', nullable: true })
  endereco!: string;

  @Column({ type: 'varchar' , nullable: true})
  telefone!: string;

  @IsEmail()
  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' , nullable: true})
  representanteLegal!: string;

  @OneToMany(() => Proposals, (proposal) => proposal.empresa)
  propostas!: Proposals[];

  @OneToMany(() => Contract, (contract) => contract.proposta)
  contratos!: Contract[];
}
