import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    const perm = this.permRepo.create(dto);
    return this.permRepo.save(perm);
  }

  async findAll(): Promise<Permission[]> {
    return this.permRepo.find();
  }

  async findOne(id: number): Promise<Permission> {
    const perm = await this.permRepo.findOne({ where: { idPermissao: id } });
    if (!perm) throw new NotFoundException('Permissão não encontrada');
    return perm;
  }

  async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
    const perm = await this.findOne(id);
    Object.assign(perm, dto);
    return this.permRepo.save(perm);
  }

  async remove(id: number): Promise<void> {
    const perm = await this.findOne(id);
    await this.permRepo.remove(perm);
  }
}
