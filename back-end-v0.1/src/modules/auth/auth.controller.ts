import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  UseGuards,
  Param,
  HttpException,
  HttpStatus,
  Headers,
  Session,
} from "@nestjs/common";
import { Session as ExpressSession } from 'express-session';

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Carrega credenciais (de variável de ambiente ou arquivo)
let credentials;
if (process.env.CREDENTIALS_JSON) {
  credentials = JSON.parse(process.env.CREDENTIALS_JSON);
} else {
  const credsPath = path.join(__dirname, '../../../credentials.json');
  credentials = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
}

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // http://localhost:3000/oauth2callback
);

import { AuthService } from "./auth.service";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { LoginDto, RegisterDto } from "./dtos/login.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Registrar usuário com email e senha",
    description:
      "Registra um novo usuário usando email e senha (criptografada com SHA256)",
  })
  @ApiResponse({
    status: 201,
    description: "Usuário registrado com sucesso",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            name: { type: "string" },
            profile: { type: "number" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: "Usuário já existe com este email",
  })
  @ApiResponse({
    status: 500,
    description: "Erro interno do servidor",
  })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.registerWithEmailPassword(
        registerDto
      );
      return {
        statusCode: 201,
        ...result,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === '23505' || error.constraint?.includes('UQ_')) {
        throw new HttpException("Usuário já existe com este email", HttpStatus.CONFLICT);
      }
      throw new HttpException(
        error.message || "Erro ao registrar usuário",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post("login")
  @ApiOperation({
    summary: "Autenticar usuário com email e senha",
    description:
      "Autentica um usuário usando email e senha (criptografada com SHA256)",
  })
  @ApiResponse({
    status: 200,
    description: "Autenticação bem-sucedida",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            name: { type: "string" },
            profile: { type: "number" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Credenciais inválidas",
  })
  @ApiResponse({
    status: 500,
    description: "Erro interno do servidor",
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.loginWithEmailPassword(loginDto);

      return {
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        message: result.message,
        user: result.user,
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || "Erro ao autenticar usuário",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("google/url")
  @ApiOperation({
    summary: "Obter URL de autorização do Google",
    description:
      "Retorna a URL de autorização do Google OAuth2 para o frontend redirecionar o usuário",
  })
  @ApiResponse({
    status: 200,
    description: "URL de autorização retornada com sucesso",
    schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          example: "https://accounts.google.com/o/oauth2/v2/auth?...",
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: "Erro interno do servidor",
  })
  async getGoogleAuthUrl(): Promise<{ url: string }> {
    try {
      const url = await this.authService.generateGoogleAuthUrl();
      return { url };
    } catch (error) {
      throw new HttpException(
        "Erro ao gerar URL de autorização",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("google/callback")
  @ApiOperation({
    summary: "Callback do Google OAuth2",
    description:
      "Processa o código de autorização do Google e autentica usuário existente",
  })
  @ApiQuery({
    name: "code",
    required: true,
    description: "Código de autorização fornecido pelo Google",
  })
  @ApiResponse({
    status: 200,
    description: "Autenticação bem-sucedida",
    schema: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        accessToken: { type: "string" },
        refreshToken: { type: "string" },
        message: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            name: { type: "string" },
            profile: { type: "number" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Usuário não encontrado - deve fazer registro primeiro",
  })
  @ApiResponse({
    status: 400,
    description: "Código de autorização inválido ou ausente",
  })
  @ApiResponse({
    status: 500,
    description: "Erro interno do servidor",
  })
  async googleCallback(
    @Query("code") code: string,
    //@Session() session: ExpressSession,
  ) {
    
    if (!code) {
      throw new HttpException(
        "Código de autorização não fornecido",
        HttpStatus.BAD_REQUEST
      );
    }

    /*
    try {
      const result = await this.authService.authenticateWithGoogle(code);

      // Armazenar tokens OAuth2 na session
      session.googleTokens = result.googleTokens;
      session.userId = result.user.id;

      // Salvar session explicitamente
      await new Promise<void>((resolve, reject) => {
        session.save((err) => {
          if (err) {
            console.error('Erro ao salvar session:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      // NÃO retornar googleTokens ao cliente (segurança)
      return {
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        message: result.message,
        user: result.user,
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || "Erro ao processar autenticação",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    */
    try {
      const { tokens } = await oAuth2Client.getToken(String(code));
      oAuth2Client.setCredentials(tokens);

      fs.writeFileSync('../../../token.json', JSON.stringify(tokens));
    } catch (err) {
      console.error('Erro ao obter o token:', err);
    }
  }

  @Get("validate")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Validar token JWT do header",
    description: "Valida se o token JWT no header Authorization é válido",
  })
  @ApiResponse({
    status: 200,
    description: "Token válido",
    schema: {
      type: "object",
      properties: {
        valid: { type: "boolean" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido ou expirado",
  })
  async validateTokenFromHeader(@Headers('authorization') auth: string) {
    try {
      const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
      if (!token) {
        throw new HttpException("Token não fornecido", HttpStatus.UNAUTHORIZED);
      }
      
      const payload = await this.authService.validateJWT(token);
      return {
        valid: true,
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.name,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Token inválido ou expirado",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post("validate")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Validar token JWT",
    description: "Valida se o token JWT fornecido é válido",
  })
  @ApiResponse({
    status: 200,
    description: "Token válido",
    schema: {
      type: "object",
      properties: {
        valid: { type: "boolean" },
        user: {
          type: "object",
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            name: { type: "string" },
            cargo: { type: "number" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido ou expirado",
  })
  async validateToken(@Body() body: { token: string }) {
    try {
      const payload = await this.authService.validateJWT(body.token);
      return {
        valid: true,
        user: {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          cargo: payload.cargo,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Token inválido ou expirado",
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Get("generalAcess")
  @ApiResponse({
    status: 200,
    description: "Token inválido ou expirado",
  })
  @ApiResponse({
    status: 500,
    description: "Não foi possível obter o token",
  })
  async enviarToken(){
    try {
      // Lê o token salvo pelo auth
      const token = JSON.parse(fs.readFileSync('token.json', 'utf-8'));

      // Atualiza as credenciais do OAuth2Client
      oAuth2Client.setCredentials(token);
    } catch (error) {
      console.error("[/generalAcess] Erro ao ler token.json:", error);
   }
  }
}
