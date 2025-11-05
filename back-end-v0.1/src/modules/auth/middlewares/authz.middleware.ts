// src/modules/auth/middlewares/authz.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthzMiddleware implements NestMiddleware {
  private userRepo: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.userRepo = this.dataSource.getRepository(User);
  }

  async use(req: any, res: any, next: () => void) {
    try {
      const auth = req.headers['authorization'] || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) return next(); // sem token -> req.user fica undefined (deixe os guards cuidarem)

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;

      // Carrega o usuário com cargo e permissões para os guards
      const user = await this.userRepo.findOne({
        where: { idUsuario: payload.id },
        relations: ['cargo', 'cargo.permissoes', 'permissoesExtras'],
      });

      if (!user) throw new UnauthorizedException('Usuário não encontrado');

      req.user = {
        id: user.idUsuario,
        email: user.email,
        nome: user.nomeCompleto,
        cargo: user.cargo ? { nome: (user.cargo as any).nomeCargo, permissoes: (user.cargo as any).permissoes } : null,
        permissoesExtras: user.permissoesExtras ?? [],
      };

      next();
    } catch (e) {
      // Se preferir bloquear sem token, lance UnauthorizedException aqui.
      // Para MVP, vamos só continuar e deixar guards decidirem.
      next();
    }
  }
}
