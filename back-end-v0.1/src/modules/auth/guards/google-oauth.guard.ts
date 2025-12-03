// src/modules/auth/guards/google-oauth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleOAuthService } from '../services/google-oauth.service';

/**
 * Guard que valida presença e validade de tokens OAuth2 do Google
 * Renova automaticamente se expirado
 */
@Injectable()
export class GoogleOAuthGuard implements CanActivate {
  constructor(private readonly googleOAuthService: GoogleOAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    
    if (request.user) {
      return true;
    }

    // Verifica se há tokens na session
    if (!session?.googleTokens) {
      throw new UnauthorizedException(
        'Autenticação necessária. Faça login primeiro.',
      );
    }

    // Verifica/renova tokens se necessário
    try {
      const validTokens = await this.googleOAuthService.ensureValidTokens(
        session.googleTokens,
      );

      // Atualiza session com tokens renovados (se houve renovação)
      if (validTokens.access_token !== session.googleTokens.access_token) {
        session.googleTokens = validTokens;
        await new Promise<void>((resolve, reject) => {
          session.save((err: any) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException(
        'Tokens OAuth2 inválidos ou expirados. Faça login novamente.',
      );
    }
  }
}
