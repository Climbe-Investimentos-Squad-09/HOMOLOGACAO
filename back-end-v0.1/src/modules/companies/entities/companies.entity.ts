import { IsEmail } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Empresas')
export class Companies {
  @PrimaryGeneratedColumn()
  idEmpresa!: number;

  @Column({ type: 'varchar' })
  razaoSocial!: string;

  @Column({ type: 'varchar' })
  nomeFantasia!: string;

  @Column({ type: 'varchar' })
  cnpj!: string;

  @Column({ type: 'varchar' })
  endereco!: string;

  @Column({ type: 'varchar' })
  telefone!: string;

  @IsEmail()
  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  representanteLegal!: string;
}
