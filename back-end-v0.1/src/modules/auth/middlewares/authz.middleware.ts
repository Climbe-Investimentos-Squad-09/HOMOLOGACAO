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
      
      
      if (!token) {
        return next();
      }

      // Tenta verificar o token
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
        const userId = payload.id;

        const user = await this.userRepo.findOne({
          where: { idUsuario: userId },
          relations: ['cargo', 'cargo.permissoes', 'permissoesExtras'],
        });

        // Se encontrou o usuário, anexa ao request
        if (user) {
          req.user = user;
        }
      } catch (e) {
        // Token inválido ou expirado
      }
      
      next();
    } catch (e) {
      next();
    }
  }
}
