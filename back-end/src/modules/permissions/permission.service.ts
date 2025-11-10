// src/modules/permissions/permission.service.ts
import {
  Injectable, BadRequestException, ConflictException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { BulkCreatePermissionDto } from './dtos/bulk-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly perms: Repository<Permission>,
  ) {}

  private normalize(nome: string) {
    const n = (nome || '').trim();
    if (!n) throw new BadRequestException('Nome da permissão é obrigatório');
    return n.toLowerCase();
  }

  // CREATE
  async create(dto: CreatePermissionDto): Promise<Permission> {
    const nome = this.normalize(dto.nome);
    const exists = await this.perms.findOne({ where: { nome } as any });
    if (exists) throw new ConflictException('Permissão já existe');

    const entity = this.perms.create({ nome, descricao: dto.descricao });
    return this.perms.save(entity);
  }

  // BULK CREATE (ignora as que já existem, opcionalmente pode lançar conflito)
  async bulkCreate(dto: BulkCreatePermissionDto): Promise<{ created: Permission[]; skipped: string[] }> {
    const names = dto.items.map(i => this.normalize(i.nome));
    const existing = await this.perms.find({ where: { nome: In(names) } as any });
    const existingSet = new Set(existing.map(e => e.nome));

    const toInsert = dto.items
      .map(i => ({ nome: this.normalize(i.nome), descricao: i.descricao ?? '' }))
      .filter(i => !existingSet.has(i.nome));

    const created = await this.perms.save(this.perms.create(toInsert));
    const skipped = names.filter(n => existingSet.has(n));
    return { created, skipped };
  }

  // READ
  async findById(id: number): Promise<Permission> {
    const p = await this.perms.findOne({ where: { idPermissao: id as any } as any });
    if (!p) throw new NotFoundException('Permissão não encontrada');
    return p;
  }

  async findByFilters(q: any): Promise<Permission[]> {
    const { q: text, nome, limit } = q || {};
    const where: any = {};
    if (nome) where.nome = ILike(`%${nome}%`);
    // Busca textual em nome ou descricao
    const qb = this.perms.createQueryBuilder('p');
    if (text) {
      qb.where('p.nome ILIKE :t OR p.descricao ILIKE :t', { t: `%${text}%` });
    } else if (where.nome) {
      qb.where('p.nome ILIKE :n', { n: `%${nome}%` });
    }
    if (!text && !nome) {
      qb.where('1=1');
    }
    qb.orderBy('p.nome', 'ASC');
    if (limit) qb.limit(Number(limit));
    return qb.getMany();
  }

  // UPDATE
  async update(id: number, dto: UpdatePermissionDto): Promise<Permission> {
    const perm = await this.findById(id);

    if (dto.nome) {
      const nome = this.normalize(dto.nome);
      if (nome !== perm.nome) {
        const dup = await this.perms.findOne({ where: { nome } as any });
        if (dup) throw new ConflictException('Já existe permissão com este nome');
        perm.nome = nome;
      }
    }

    if (dto.descricao !== undefined) {
      perm.descricao = dto.descricao;
    }

    return this.perms.save(perm);
  }

  // DELETE
  async delete(id: number): Promise<{ message: string }> {
    const perm = await this.findById(id);
    await this.perms.remove(perm);
    return { message: 'Permissão removida com sucesso' };
  }
}
