// src/modules/user/user.service.ts
import { Injectable, BadRequestException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UpdateUserStatusDto } from './dtos/update-user-status.dto';
import { AddPermissionsDto, RemovePermissionsDto } from './dtos/permissions-bulk.dto';
import { SituacaoUsuario } from './enums/situacao-usuario-enum.dto';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(Permission) private readonly perms: Repository<Permission>,
  ) {}

  private hashPassword(password: string) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // ----------------- CREATE (admin / backoffice) -----------------
  async create(dto: CreateUserDto) {
    if (!dto.email || !dto.nomeCompleto) throw new BadRequestException('nomeCompleto e email são obrigatórios');

    const existing = await this.users.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email já cadastrado');

    if (dto.cpf) {
      const existingCpf = await this.users.findOne({ where: { cpf: dto.cpf } });
      if (existingCpf) throw new ConflictException('CPF já cadastrado');
    }

    const entity = this.users.create({
      email: dto.email,
      nomeCompleto: dto.nomeCompleto,
      cpf: dto.cpf,
      contato: dto.contato,
      senha: dto.senha ? this.hashPassword(dto.senha) : undefined,
      situacao: dto.idCargo ? SituacaoUsuario.Ativo : SituacaoUsuario.PENDENTE,
    });

    if (dto.idCargo) {
      const role = await this.roles.findOne({ where: { idCargo: dto.idCargo as any } as any });
      if (!role) throw new NotFoundException('Cargo não encontrado');
      entity.cargo = role;
    }

    entity.permissoesExtras = [];
    const saved = await this.users.save(entity);
    return saved;
  }

  // ----------------- LIST / DETAIL -----------------
  async findByFilters(q: any) {
    const { nome, email, situacao, idCargo } = q || {};
    const where: any = {};
    if (nome) where.nomeCompleto = ILike(`%${nome}%`);
    if (email) where.email = ILike(`%${email}%`);
    if (situacao) where.situacao = situacao;
    if (idCargo) where.cargo = { idCargo: Number(idCargo) };
    return this.users.find({ 
      where, 
      relations: ['cargo', 'cargo.permissoes', 'permissoesExtras'],
      order: { idUsuario: 'DESC' } 
    });
  }

  async findById(id: number) {
    const u = await this.users.findOne({ 
      where: { idUsuario: id },
      relations: ['cargo', 'cargo.permissoes', 'permissoesExtras']
    });
    if (!u) throw new NotFoundException('Usuário não encontrado');
    return u;
  }

  // ----------------- UPDATE PROFILE / ADMIN UPDATE -----------------
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const dup = await this.users.findOne({ where: { email: dto.email } });
      if (dup) throw new ConflictException('Email já cadastrado');
    }
    if (dto.senha) dto.senha = this.hashPassword(dto.senha);

    const toSave = this.users.merge(user, dto);
    return this.users.save(toSave);
  }

  // ----------------- ROLE & EXTRA PERMISSIONS -----------------
  async updateRole(id: number, dto: UpdateUserRoleDto) {
    const user = await this.findById(id);
    
    if (dto.idCargo === null || dto.idCargo === undefined) {
      await this.users
        .createQueryBuilder()
        .relation(User, 'cargo')
        .of(id)
        .set(null);
      
      user.cargo = undefined;
      // Quando remove o cargo, mantém as permissões extras que já tinha
      // (não remove permissões extras ao remover cargo)
    } else {
      const role = await this.roles.findOne({ 
        where: { idCargo: dto.idCargo as any } as any,
        relations: ['permissoes']
      });
      if (!role) throw new NotFoundException('Cargo não encontrado');
      user.cargo = role;
      
      // Quando atribui um cargo, as permissões do cargo são automaticamente
      // disponibilizadas através da relação cargo.permissoes
      // As permissões extras continuam existindo e podem ser adicionadas depois
    }

    if (user.situacao === SituacaoUsuario.PENDENTE && user.cargo) {
      user.situacao = SituacaoUsuario.Ativo;
    }

    if (dto.permissoesExtras?.length) {
      const extras = await this.perms.find({ where: { idPermissao: In(dto.permissoesExtras as any) } as any });
      user.permissoesExtras = extras;
    }

    return this.users.save(user);
  }

  async addPermissions(id: number, dto: AddPermissionsDto) {
    const user = await this.findById(id);
    const extras = await this.perms.find({ where: { idPermissao: In(dto.permissionIds as any) } as any });

    const byId = new Map((user.permissoesExtras || []).map((p) => [p.idPermissao, p]));
    for (const p of extras) byId.set(p.idPermissao, p);

    user.permissoesExtras = Array.from(byId.values());
    return this.users.save(user);
  }

  async removePermissions(id: number, dto: RemovePermissionsDto) {
    const user = await this.findById(id);
    const removeIds = new Set(dto.permissionIds);
    user.permissoesExtras = (user.permissoesExtras || []).filter((p) => !removeIds.has(p.idPermissao));
    return this.users.save(user);
  }

  // ----------------- STATUS (bloquear/desbloquear) -----------------
  async updateStatus(id: number, dto: UpdateUserStatusDto) {
    const user = await this.findById(id);

    // Quando aprovar (Ativo), garantir que não tenha cargo (sem cargo por padrão)
    if (dto.situacao === SituacaoUsuario.Ativo && user.situacao === SituacaoUsuario.PENDENTE) {
      // Se estiver aprovando um usuário pendente, garantir que fique sem cargo
      user.cargo = undefined;
    }

    user.situacao = dto.situacao as any;
    return this.users.save(user);
  }

  // ----------------- DELETE -----------------
  async delete(id: number) {
    const user = await this.findById(id);
    await this.users.remove(user);
    return { message: 'Usuário removido com sucesso' };
  }
}
