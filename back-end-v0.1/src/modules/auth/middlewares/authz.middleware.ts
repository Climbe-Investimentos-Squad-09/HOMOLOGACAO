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
      if (!token) return next();

      const payload = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any;
      const userId = payload.id;

      const user = await this.userRepo.findOne({
        where: { idUsuario: userId },
        relations: ['cargo', 'cargo.permissoes', 'permissoesExtras'],
      });

      if (!user) throw new UnauthorizedException('Usuário não encontrado');

      req.user = user;
      next();
    } catch (e) {
      next();
    }
  }
}
