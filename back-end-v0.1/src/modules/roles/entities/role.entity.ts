import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { Permission } from '../../permissions/entities/permission.entity';
//import { User } from '../../users/entities/user.entity';

@Entity('Cargos')
export class Role {
  @PrimaryGeneratedColumn()
  idCargo!: number;

  @Column({ unique: true })
  nomeCargo!: string;

  // N:N com Permissões
  @ManyToMany(() => Permission, permission => permission.roles, { cascade: true })
  @JoinTable({
    name: 'Cargo_Permissoes',
    joinColumn: { name: 'idCargo', referencedColumnName: 'idCargo' },
    inverseJoinColumn: { name: 'idPermissao', referencedColumnName: 'idPermissao' }
  })
  permissoes!: Permission[];

  /* 1:N com Usuários
  @OneToMany(() => User, user => user.cargo)
  usuarios!: User[];*/
}
