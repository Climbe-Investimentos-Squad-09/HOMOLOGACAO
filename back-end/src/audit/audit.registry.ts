// src/audit/audit.registry.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuditableOptions } from './auditable.decorator';

type LoaderFn = (id: string | number) => Promise<any> | any;

@Injectable()
export class AuditRegistry {
  private loaders = new Map<string, LoaderFn>();

  register(entity: string, loader: LoaderFn) {
    this.loaders.set(entity, loader);
  }

  async loadBefore(meta: AuditableOptions, req: Request): Promise<any> {
    if (!meta.loadBefore) return null;
    if (!meta.entity) return null;

    const loader = this.loaders.get(meta.entity);
    if (!loader) return null;

    // tenta descobrir o id da entidade: param → meta.entityIdParam
    let id: string | number | undefined;

    if (meta.entityIdParam && req.params?.[meta.entityIdParam]) {
      id = req.params[meta.entityIdParam];
    } else if (meta.entityId != null) {
      id = meta.entityId;
    } else {
      // sem id não tem como carregar "before"
      return null;
    }

    return loader(id);
  }
}
