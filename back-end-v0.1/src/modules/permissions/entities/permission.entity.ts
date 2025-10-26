import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
//import { User } from '../../users/entities/user.entity';

@Entity('Permissoes')
export class Permission {
  @PrimaryGeneratedColumn()
  idPermissao!: number;

  @Column({ unique: true })
  descricao!: string;

  // N:N com Roles
  @ManyToMany(() => Role, role => role.permissoes)
  roles!: Role[];

  /* N:N com Usuários (permissões extras)
  @ManyToMany(() => User, user => user.permissoesExtras)
  usuarios!: User[];*/
}
