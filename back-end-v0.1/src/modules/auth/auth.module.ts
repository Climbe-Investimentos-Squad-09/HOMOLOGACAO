import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';

import fs from "fs";
import path from "path";
import { google } from "googleapis";

export const GOOGLE_AUTH = 'GOOGLE_AUTH';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        EventEmitterModule.forRoot(),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleOAuthService,
        {
      provide: 'GOOGLE_AUTH', // Token para injeção de dependência
      useFactory: async () => {
        try {
          const credsPath = path.join(__dirname, '../../../credentials.json');
          const tokenPath = path.join(__dirname, '../../../token.json');

          console.log('[AppModule] Configurando Google OAuth...');

          // Cria os arquivos JSON a partir das variáveis de ambiente (se existirem)
          if (process.env.CREDENTIALS_JSON) {
            console.log('[AppModule] Criando credentials.json a partir de CREDENTIALS_JSON');
            fs.writeFileSync(credsPath, process.env.CREDENTIALS_JSON);
          }

          if (process.env.TOKEN_JSON) {
            console.log('[AppModule] Criando token.json a partir de TOKEN_JSON');
            fs.writeFileSync(tokenPath, process.env.TOKEN_JSON);
          }

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

          // Configura auto-refresh do token
          oAuth2Client.on('tokens', (newTokens) => {
            console.log('[AppModule] Token renovado automaticamente');
            if (newTokens.refresh_token) {
              token.refresh_token = newTokens.refresh_token;
            }
            token.access_token = newTokens.access_token;
            token.expiry_date = newTokens.expiry_date;
            
            try {
              fs.writeFileSync(tokenPath, JSON.stringify(token, null, 4));
              console.log('[AppModule] Novo token salvo ✅');
            } catch (err) {
              console.warn('[AppModule] Não foi possível salvar token');
            }
          });

          console.log('[AppModule] Google OAuth configurado ✅');
          return oAuth2Client;
        } catch (error: any) {
          console.error('[AppModule] Erro ao configurar Google OAuth:', error.message);
          throw error;
        }
      },
    },
    ],
    exports: [AuthService, GoogleOAuthService, GOOGLE_AUTH],
})
export class AuthModule { }