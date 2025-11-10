import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerms = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPerms) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    const rolePerms = user.cargo?.permissoes?.map((p: { nome: any; }) => p.nome) || [];
    const extraPerms = user.permissoesExtras?.map((p: { nome: any; }) => p.nome) || [];
    const allPerms = [...new Set([...rolePerms, ...extraPerms])];

    const hasPermission = requiredPerms.every((perm) =>
      allPerms.includes(perm),
    );

    if (!hasPermission) {
      throw new ForbiddenException('Permissão negada');
    }
    return true;
  }
}
