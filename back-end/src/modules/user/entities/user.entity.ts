// src/modules/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../permissions/entities/permission.entity';
import { SituacaoUsuario } from '../enums/situacao-usuario-enum.dto';


@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  idUsuario!: number;

  @Column() nomeCompleto!: string;

  @Column({ unique: true }) email!: string;

  @Column({ nullable: true, unique: true }) cpf?: string;

  @Column({ nullable: true }) senha?: string;

  @Column({ nullable: true }) contato?: string;

  @Column({
    type: 'enum',
    enum: SituacaoUsuario,
    default: SituacaoUsuario.PENDENTE,
  })
  situacao!: SituacaoUsuario;

  @ManyToOne(() => Role, (role) => role.usuarios, { nullable: true, onDelete: 'SET NULL', eager: true })
  cargo?: Role;

  @ManyToMany(() => Permission, (permission) => permission.usuarios, { cascade: false, eager: true })
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'idUsuario', referencedColumnName: 'idUsuario' },
    inverseJoinColumn: { name: 'idPermissao', referencedColumnName: 'idPermissao' },
  })
  permissoesExtras!: Permission[];

  @CreateDateColumn() dataCriacao!: Date;
  @UpdateDateColumn() ultimoAcesso!: Date;

  // Campos OAuth opcionais se você quiser manter:
  @Column({ nullable: true }) accessToken?: string;
  @Column({ nullable: true }) refreshToken?: string;
  @Column({ type: 'timestamptz', nullable: true }) tokenExpiresAt?: Date;
  @Column({ nullable: true }) sub?: string;
}
export { SituacaoUsuario };

