import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

import fs from "fs";
import path from "path";
import { google } from "googleapis";

export const GOOGLE_AUTH = 'GOOGLE_AUTH';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleOAuthService,
        {
      provide: 'GOOGLE_AUTH', // Token para injeção de dependência
      useFactory: async () => {
        try {
          const credsPath = path.join(__dirname, '../../../credentials.json');
          const tokenPath = path.join(__dirname, '../../../token.json');

          console.log('[AppModule] Carregando credentials do Google em:', credsPath);
          console.log('[AppModule] Carregando token salvo em:', tokenPath);

          // Lê os arquivos
          const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
          const token = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));

          // Cria o cliente OAuth2
          const oAuth2Client = new google.auth.OAuth2(
            creds.web.client_id,
            creds.web.client_secret,
            'http://localhost:3000/auth/generalAcess',
            
          );

          // Aplica o token salvo
          oAuth2Client.setCredentials(token);

          console.log('[AppModule] Token e credentials carregados ✅');
          return oAuth2Client; // Retorna o cliente para injeção
        } catch (error) {
          console.error('[AppModule] Erro ao carregar credentials ou token:', error);
          throw error;
        }
      },
    },
    ],
    exports: [AuthService, GoogleOAuthService, GOOGLE_AUTH],
})
export class AuthModule { }