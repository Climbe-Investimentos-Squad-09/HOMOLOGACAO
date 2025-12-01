// src/modules/auth/decorators/google-tokens.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GoogleTokens as GoogleTokensInterface } from '../interfaces/google-tokens.interface';

/**
 * Decorator que extrai tokens OAuth2 do Google da session
 * Uso: @GoogleTokens() tokens: GoogleTokens
 */
export const GoogleTokens = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): GoogleTokensInterface | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.session?.googleTokens || null;
  },
);
