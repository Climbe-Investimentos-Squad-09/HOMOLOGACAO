import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { AssignPermissionDto } from './dtos/assign-permission.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permRepo: Repository<Permission>
  ) {}

  async createRole(dto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  async updateRole(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { idCargo: id } });
    if (!role) throw new NotFoundException('Cargo não encontrado');
    Object.assign(role, dto);
    return this.roleRepo.save(role);
  }

  async assignPermissions(dto: AssignPermissionDto): Promise<Role> {
    const role = await this.roleRepo.findOne({
      where: { idCargo: dto.idCargo },
      relations: ['permissoes']
    });
    if (!role) throw new NotFoundException('Cargo não encontrado');

    const perms = await this.permRepo.findByIds(dto.permissionIds);
    role.permissoes = [...role.permissoes, ...perms];
    return this.roleRepo.save(role);
  }

  async listRoles(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ['permissoes'] });
  }
}
