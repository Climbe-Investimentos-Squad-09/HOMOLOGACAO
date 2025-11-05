import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Permissoes')
export class Permission {
  @PrimaryGeneratedColumn()
  idPermissao!: number;

  @Column({ unique: true })
  nome!: string;

  @Column({ nullable: true })
  descricao?: string;

  // N:N com Roles
  @ManyToMany(() => Role, role => role.permissoes)
  roles!: Role[];


  @ManyToMany(() => User, user => user.permissoesExtras)
  usuarios!: User[];
}
