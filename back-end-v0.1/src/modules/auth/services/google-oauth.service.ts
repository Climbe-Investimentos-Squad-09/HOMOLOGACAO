// src/modules/auth/services/google-oauth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { GoogleTokens } from '../interfaces/google-tokens.interface';

@Injectable()
export class GoogleOAuthService {
  private oAuth2Client: OAuth2Client;

  constructor() {
    this.oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
  }

  /**
   * Verifica se o access_token está expirado
   * @param expiryDate timestamp em milissegundos
   * @returns true se expirado
   */
  isTokenExpired(expiryDate: number): boolean {
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutos de buffer
    return now >= expiryDate - bufferTime;
  }

  /**
   * Atualiza o access_token usando refresh_token
   * @param refreshToken refresh_token do Google
   * @returns novos tokens
   */
  async refreshAccessToken(refreshToken: string): Promise<GoogleTokens> {
    try {
      this.oAuth2Client.setCredentials({
        refresh_token: refreshToken,
      });

      const { credentials } = await this.oAuth2Client.refreshAccessToken();

      if (!credentials.access_token) {
        throw new UnauthorizedException('Falha ao renovar access token');
      }

      return {
        access_token: credentials.access_token,
        refresh_token: refreshToken, // mantém o mesmo refresh_token
        scope: credentials.scope || '',
        token_type: credentials.token_type || 'Bearer',
        expiry_date: credentials.expiry_date || Date.now() + 3600 * 1000,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Refresh token inválido ou expirado. Faça login novamente com Google.',
      );
    }
  }

  /**
   * Obtém tokens válidos, renovando se necessário
   * @param currentTokens tokens atuais da session
   * @returns tokens válidos (pode ser os mesmos ou renovados)
   */
  async ensureValidTokens(currentTokens: GoogleTokens): Promise<GoogleTokens> {
    if (this.isTokenExpired(currentTokens.expiry_date)) {
      console.log('Access token expirado, renovando...');
      return await this.refreshAccessToken(currentTokens.refresh_token);
    }
    return currentTokens;
  }

  /**
   * Cria OAuth2Client configurado com tokens do usuário
   * @param tokens tokens do usuário
   * @returns OAuth2Client configurado
   */
  createAuthClient(tokens: GoogleTokens): OAuth2Client {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    client.setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
    });

    return client;
  }
}
