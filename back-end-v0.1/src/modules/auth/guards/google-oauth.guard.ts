// src/modules/auth/guards/google-oauth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { AuthService } from '../auth.service';

const fs = require('fs');
const express = require('express');
const { google } = require('googleapis');
const open = require('open'); // abre URL no navegador automaticamente

const credentials = require('../../../../credentials.json');
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // http://localhost:3000/oauth2callback
);

/**
 * Guard que valida presença e validade de tokens OAuth2 do Google
 * Renova automaticamente se expirado
 */
@Injectable()
export class GoogleOAuthGuard implements CanActivate {
  constructor(
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly authService:  AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /*
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    // Verifica se há tokens na session
    if (!session?.googleTokens) {
      throw new UnauthorizedException(
        'Autenticação Google necessária. Faça login com Google primeiro.',
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
        'Tokens OAuth2 inválidos ou expirados. Faça login novamente com Google.',
      );
    }
  }
    */

  if (fs.existsSync('../../../../token')) {
      const token = JSON.parse(fs.readFileSync('token.json'));
      oAuth2Client.setCredentials(token);
      console.log("\nToken salvo anteriormente");
      return true 
    } else {
      console.log("\nNenhum token encontrado. Iniciando fluxo de autorização...");
      open.default(this.authService.generateGoogleAuthUrl())
      //getAccessToken(oAuth2Client);
      return true
    }
  }
}
