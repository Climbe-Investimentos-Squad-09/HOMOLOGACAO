import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { User as UserEntity } from "../user/entities/user.entity";
import { LoginDto, RegisterDto } from "./dtos/login.dto";

@Injectable()
export class AuthService {
  private oAuth2Client: OAuth2Client;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {
    // Inicializa cliente OAuth2 do Google
    this.oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /**
   * Criptografa uma senha usando SHA256
   */
  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  /**
   * Registra um novo usuário com email e senha
   */
  async registerWithEmailPassword(registerDto: RegisterDto): Promise<any> {
    try {
      const { email, nome, senha, idCargo } = registerDto;

      // Verifica se o usuário já existe
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new HttpException(
          "Usuário já existe com este email",
          HttpStatus.CONFLICT
        );
      }

      // Criptografa a senha
      const hashedPassword = this.hashPassword(senha);

      // Cria novo usuário
      const newUser = this.userRepository.create({
        email: email,
        nomeCompleto: nome,
        senha: hashedPassword,
        idCargo: idCargo || 1, // Usa cargo padrão ID 1 se não especificado
        dataCriacao: new Date(),
      } as any);

      const savedUser = await this.userRepository.save(newUser);
      const finalUser = Array.isArray(savedUser) ? savedUser[0] : savedUser;

      // Gera tokens
      const accessToken = this.generateJWT(finalUser);
      const refreshToken = this.generateRefreshToken(finalUser);

      return {
        success: true,
        message: "Usuário registrado com sucesso",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: finalUser.idUsuario,
          email: finalUser.email,
          name: finalUser.nomeCompleto,
          profile: finalUser.idCargo,
        },
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erro no registro com email/senha:", error);
      throw new HttpException(
        "Erro ao registrar usuário",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Autentica usuário com email e senha
   */
  async loginWithEmailPassword(loginDto: LoginDto): Promise<any> {
    try {
      const { email, senha } = loginDto;

      // Busca usuário por email
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new HttpException(
          "Credenciais inválidas",
          HttpStatus.UNAUTHORIZED
        );
      }

      // Verifica se usuário tem senha (não é usuário OAuth2)
      if (!user.senha) {
        throw new HttpException(
          "Este usuário deve fazer login com Google",
          HttpStatus.UNAUTHORIZED
        );
      }

      // Verifica senha
      const hashedPassword = this.hashPassword(senha);
      if (user.senha !== hashedPassword) {
        throw new HttpException(
          "Credenciais inválidas",
          HttpStatus.UNAUTHORIZED
        );
      }

      // Gera tokens
      const accessToken = this.generateJWT(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        success: true,
        message: "Autenticação bem-sucedida",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.idUsuario,
          email: user.email,
          name: user.nomeCompleto,
          profile: user.idCargo,
        },
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Erro no login com email/senha:", error);
      throw new HttpException(
        "Erro ao autenticar usuário",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Gera URL de autorização do Google OAuth2
   */
  async generateGoogleAuthUrl(): Promise<string> {
    try {
      const authUrl = this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["profile", "email"],
        prompt: "consent",
      });

      return authUrl;
    } catch (error) {
      console.error("Erro ao gerar URL de autorização:", error);
      throw new HttpException(
        "Erro ao gerar URL de autorização",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Autentica usuário com Google OAuth2
   */
  async authenticateWithGoogle(code: string): Promise<any> {
    try {
      // Troca código por tokens
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      // Busca informações do usuário
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new HttpException(
          "Erro ao obter dados do usuário",
          HttpStatus.BAD_REQUEST
        );
      }

      const { sub, email, name } = payload;

      // Busca usuário existente
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new HttpException(
          "Usuário não encontrado. Faça primeiro o registro com email e senha.",
          HttpStatus.NOT_FOUND
        );
      }

      // Atualiza dados se necessário
      if (!user.nomeCompleto) {
        user.nomeCompleto = name || "";
        await this.userRepository.save(user);
      }

      // Gera tokens
      const accessToken = this.generateJWT(user);
      const refreshToken = this.generateRefreshToken(user);

      return {
        success: true,
        message: "Autenticação bem-sucedida",
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          id: user.idUsuario,
          email: user.email,
          name: user.nomeCompleto,
          profile: user.idCargo,
        },
      };
    } catch (error: any) {
      console.error("Erro na autenticação Google:", error);
      throw new HttpException(
        "Erro ao processar autenticação Google",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Gera JWT com dados do usuário
   */
  private generateJWT(user: UserEntity): string {
    try {
      const payload = {
        id: user.idUsuario,
        email: user.email,
        name: user.nomeCompleto,
        cargo: user.idCargo,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "default-secret",
        {
          algorithm: "HS256",
        }
      );

      return token;
    } catch (error) {
      console.error("Erro ao gerar JWT:", error);
      throw new HttpException(
        "Erro ao gerar token de autenticação",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Gera Refresh Token
   */
  private generateRefreshToken(user: UserEntity): string {
    try {
      const payload = {
        id: user.idUsuario,
        email: user.email,
        type: "refresh",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 dias
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET || "refresh-secret",
        {
          algorithm: "HS256",
        }
      );

      return token;
    } catch (error) {
      console.error("Erro ao gerar Refresh Token:", error);
      throw new HttpException(
        "Erro ao gerar refresh token",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Valida um JWT
   */
  async validateJWT(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default-secret",
        {
          algorithms: ["HS256"],
        }
      );

      return decoded;
    } catch (error) {
      throw new HttpException(
        "Token inválido ou expirado",
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
