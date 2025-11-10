// src/audit/audit.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Audit, AuditAction } from './entities/audit.entity';

export interface AuditLogInput {
  entity: string;
  action: AuditAction | string;
  entityId?: string;        // padronizado como string
  userId?: number;          // pode estar ausente (rotas públicas ou falhas)
  before?: any;             // JSON
  after?: any;              // JSON
  ip?: string;
  method?: string;
  path?: string;
  userAgent?: string;
  extra?: any;              // JSON
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(Audit)
    private readonly auditRepo: Repository<Audit>,
  ) {}

  async log(input: AuditLogInput): Promise<Audit> {
    const audit = this.auditRepo.create({
      entity: input.entity,
      action: String(input.action),
      entityId: input.entityId ?? null,
      userId: typeof input.userId === 'number' ? input.userId : null,
      before: input.before ?? null,
      after: input.after ?? null,
      ip: input.ip ?? null,
      method: input.method ?? null,
      path: input.path ?? null,
      userAgent: input.userAgent ?? null,
      extra: input.extra ?? null,
    });
    return this.auditRepo.save(audit);
  }
}
