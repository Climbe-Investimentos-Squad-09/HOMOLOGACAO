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
const path = require('path');
const express = require('express');
const { google } = require('googleapis');
const open = require('open'); // abre URL no navegador automaticamente

// Carrega credenciais (de variável de ambiente ou arquivo)
let credentials;
if (process.env.CREDENTIALS_JSON) {
  credentials = JSON.parse(process.env.CREDENTIALS_JSON);
} else {
  const credsPath = path.join(__dirname, '../../../../credentials.json');
  credentials = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
}

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
