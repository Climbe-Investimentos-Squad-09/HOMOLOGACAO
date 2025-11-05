// src/audit/auditable.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const AUDIT_META = 'AUDIT_META';

export interface AuditableOptions {
  entity: string;
  action: string;
  entityIdParam?: string;       // nome do param na rota (ex.: 'id')
  entityIdFromResult?: string;  // campo do objeto retornado (ex.: 'idProposta')
  entityId?: string | number;   // fallback fixo
  loadBefore?: boolean;         // se true, carrega "before" no registry
  extra?: (req: any, result: any, before: any) => any; // dados extras
}

export const Auditable = (opts: AuditableOptions) => SetMetadata(AUDIT_META, opts);
