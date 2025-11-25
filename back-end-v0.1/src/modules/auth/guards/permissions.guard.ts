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

    const request = context.switchToHttp().getRequest();
    const { user, params } = request;
    if (!user) throw new ForbiddenException('Usuário não autenticado');

    // Permitir que usuário acesse seus próprios dados (GET /users/:id) sem precisar de usuarios:visualizar
    if (requiredPerms.includes('usuarios:visualizar') && params?.id) {
      const requestedUserId = Number(params.id);
      const authenticatedUserId = user.id;
      if (requestedUserId === authenticatedUserId) {
        return true; // Permite acesso aos próprios dados
      }
    }

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
