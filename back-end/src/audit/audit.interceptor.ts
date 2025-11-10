// src/audit/audit.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of, from, defer } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { AUDIT_META } from './auditable.decorator';
import { AuditRegistry } from './audit.registry';
import { AuditService } from './audit.service';
import { AuditAction } from './entities/audit.entity';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly registry: AuditRegistry,
    private readonly audit: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const meta = this.reflector.get(AUDIT_META, context.getHandler());
    if (!meta) return next.handle();

    const req = context.switchToHttp().getRequest();
    const user = req.user || null;

    // 🔧 Normaliza userId (string → number) e permite ausente
    const userIdNum: number | undefined =
      typeof user?.idUsuario === 'number'
        ? user.idUsuario
        : user?.id != null
        ? Number(user.id)
        : undefined;

    // 🔧 before$: sempre Observable (mesmo que loadBefore=false)
    const before$ = meta.loadBefore
      ? defer(() => {
          const r = this.registry.loadBefore(meta, req);
          return r instanceof Promise ? from(r) : of(r);
        })
      : of(null);

    return before$.pipe(
      switchMap((before) =>
        next.handle().pipe(
          tap(async (result) => {
            try {
              // 🔧 entityId → string (padronizado)
              let entityId: string | undefined;
              if (meta.entityIdParam && req.params?.[meta.entityIdParam]) {
                entityId = String(req.params[meta.entityIdParam]);
              } else if (meta.entityIdFromResult && result) {
                const v = result[meta.entityIdFromResult];
                entityId = v != null ? String(v) : undefined;
              } else if (meta.entityId != null) {
                entityId = String(meta.entityId);
              }

              await this.audit.log({
                entity: meta.entity,
                action: meta.action as AuditAction,
                entityId,                   // string | undefined
                userId: userIdNum,          // number | undefined
                before: before ?? undefined,
                after: result ?? undefined,
                ip: req.ip,
                method: req.method,
                path: req.originalUrl ?? req.url,
                userAgent: req.get?.('user-agent'),
                extra: meta.extra ? meta.extra(req, result, before) : undefined,
              });
            } catch (e) {
              // não derruba a request por falha de auditoria
              console.warn('[audit] falha ao registrar auditoria:', e);
            }
          }),
        ),
      ),
      catchError((err) => {
        throw err;
      }),
    );
  }
}
