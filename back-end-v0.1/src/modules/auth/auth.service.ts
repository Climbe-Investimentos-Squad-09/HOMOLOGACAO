// src/modules/auth/auth.service.ts
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import { User as UserEntity } from "../user/entities/user.entity";
import { Role } from "../roles/entities/role.entity";
import { LoginDto, RegisterDto } from "./dtos/login.dto";
import { SituacaoUsuario } from "../user/enums/situacao-usuario-enum.dto";
import { GoogleTokens } from './interfaces/google-tokens.interface';

@Injectable()
export class AuthService {
  private oAuth2Client: OAuth2Client;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    this.oAuth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  /** Criptografa uma senha usando SHA256 */
  private hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  /** Registra um novo usuário com email e senha */
  async registerWithEmailPassword(registerDto: RegisterDto): Promise<any> {
    try {
      const { email, nome, senha, idCargo } = registerDto;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        throw new HttpException("Usuário já existe com este email", HttpStatus.CONFLICT);
      }

      const hashedPassword = this.hashPassword(senha);

      // Payload básico SEM cargo quando não houver
      const payload: Partial<UserEntity> = {
        email,
        nomeCompleto: nome,
        senha: hashedPassword,
        // situacao default deve vir da entity (ex.: PENDENTE via @Column default)
      };

      // Se idCargo vier, carrega o cargo e associa
      if (idCargo) {
        const cargo = await this.roleRepository.findOne({ where: { idCargo } as any });
        if (!cargo) throw new HttpException("Cargo não encontrado", HttpStatus.BAD_REQUEST);
        payload.cargo = cargo; // adiciona somente se existir
      }

      const newUser = this.userRepository.create(payload);
      let savedUser;
      try {
        savedUser = await this.userRepository.save(newUser);
      } catch (saveError: any) {
        if (saveError.code === '23505' || saveError.constraint?.includes('UQ_') || saveError.detail?.includes('already exists')) {
          throw new HttpException("Usuário já existe com este email", HttpStatus.CONFLICT);
        }
        throw new HttpException("Erro ao registrar usuário", HttpStatus.INTERNAL_SERVER_ERROR);
      }

      if (savedUser.situacao === SituacaoUsuario.PENDENTE) {
        return {
          success: true,
          message: "Usuário registrado com sucesso. Aguarde aprovação.",
          accessToken: null,
          refreshToken: null,
          user: {
            id: savedUser.idUsuario,
            email: savedUser.email,
            name: savedUser.nomeCompleto,
            profile: savedUser.cargo?.idCargo ?? null,
          },
        };
      }

      const accessToken = this.generateJWT(savedUser);
      const refreshToken = this.generateRefreshToken(savedUser);

      return {
        success: true,
        message: "Usuário registrado com sucesso",
        accessToken,
        refreshToken,
        user: {
          id: savedUser.idUsuario,
          email: savedUser.email,
          name: savedUser.nomeCompleto,
          profile: savedUser.cargo?.idCargo ?? null,
        },
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      if (error.code === '23505' || error.constraint?.includes('UQ_') || error.detail?.includes('already exists')) {
        throw new HttpException("Usuário já existe com este email", HttpStatus.CONFLICT);
      }
      throw new HttpException("Erro ao registrar usuário", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Autentica usuário com email e senha */
  async loginWithEmailPassword(loginDto: LoginDto): Promise<any> {
    try {
      const { email, senha } = loginDto;

      const user = await this.userRepository.findOne({ 
        where: { email },
        relations: ['cargo', 'cargo.permissoes', 'permissoesExtras']
      });
      if (!user) throw new HttpException("Credenciais inválidas", HttpStatus.UNAUTHORIZED);

      if (!user.senha) {
        throw new HttpException("Este usuário deve fazer login com Google", HttpStatus.UNAUTHORIZED);
      }

      const hashedPassword = this.hashPassword(senha);
      if (user.senha !== hashedPassword) {
        throw new HttpException("Credenciais inválidas", HttpStatus.UNAUTHORIZED);
      }

      if (user.situacao === SituacaoUsuario.Bloqueado) {
        throw new HttpException("Cadastro bloqueado para acesso", HttpStatus.FORBIDDEN);
      }

      if (user.situacao === SituacaoUsuario.PENDENTE) {
        throw new HttpException("Aguardando aprovação", HttpStatus.FORBIDDEN);
      }

      const accessToken = this.generateJWT(user);
      const refreshToken = this.generateRefreshToken(user);

      // Carregar permissões do cargo e extras
      const rolePerms = user.cargo?.permissoes?.map(p => p.nome) || [];
      const extraPerms = user.permissoesExtras?.map(p => p.nome) || [];
      const allPerms = [...new Set([...rolePerms, ...extraPerms])];

      return {
        success: true,
        message: "Autenticação bem-sucedida",
        accessToken,
        refreshToken,
        user: {
          id: user.idUsuario,
          email: user.email,
          name: user.nomeCompleto,
          profile: user.cargo?.idCargo ?? null,
          permissions: allPerms, // Incluir permissões na resposta do login
        },
      };
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException("Erro ao autenticar usuário", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Gera URL de autorização do Google OAuth2 */
  async generateGoogleAuthUrl(): Promise<string> {
    try {
      return this.oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "profile",
          "email",
          "https://www.googleapis.com/auth/calendar",
          "https://www.googleapis.com/auth/drive",
          "https://www.googleapis.com/auth/gmail.send",
        ],
        prompt: "consent", // garante refresh_token
      });
    } catch (error) {
      throw new HttpException("Erro ao gerar URL de autorização", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Autentica usuário com Google OAuth2 (somente para usuários já registrados) */
  async authenticateWithGoogle(code: string): Promise<{
    success: boolean;
    message: string;
    accessToken: string;
    refreshToken: string;
    user: any;
    googleTokens: GoogleTokens;
  }> {
    try {
      const { tokens } = await this.oAuth2Client.getToken(code);
      this.oAuth2Client.setCredentials(tokens);

      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new HttpException("Erro ao obter dados do usuário", HttpStatus.BAD_REQUEST);
      }

      const { email, name } = payload;

      const user = await this.userRepository.findOne({
        where: { email },
        relations: ['cargo']
      });
      if (!user) {
        // Decisão de negócio: exigir registro prévio via e-mail/senha
        throw new HttpException(
          "Usuário não encontrado. Faça primeiro o registro com email e senha.",
          HttpStatus.NOT_FOUND
        );
      }

      if (!user.nomeCompleto && name) {
        user.nomeCompleto = name;
        await this.userRepository.save(user);
      }

      const accessToken = this.generateJWT(user);
      const refreshToken = this.generateRefreshToken(user);

      // Preparar tokens OAuth2 para session
      const googleTokens: GoogleTokens = {
        access_token: tokens.access_token!,
        refresh_token: tokens.refresh_token!, // CRÍTICO: só vem com prompt=consent
        scope: tokens.scope || '',
        token_type: tokens.token_type || 'Bearer',
        expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000,
      };

      return {
        success: true,
        message: "Autenticação bem-sucedida",
        accessToken,
        refreshToken,
        user: {
          id: user.idUsuario,
          email: user.email,
          name: user.nomeCompleto,
          profile: user.cargo?.idCargo ?? null,
        },
        googleTokens,
      };
    } catch (error: any) {
      throw new HttpException("Erro ao processar autenticação Google", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /** Gera JWT com dados essenciais */
  private generateJWT(user: UserEntity): string {
    const payload = {
      id: user.idUsuario,
      email: user.email,
      name: user.nomeCompleto,
      cargoId: user.cargo?.idCargo ?? null, // id do cargo no token
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "default-secret", {
      algorithm: "HS256",
    });
    }

  /** Gera Refresh Token (7 dias) */
  private generateRefreshToken(user: UserEntity): string {
    const payload = {
      id: user.idUsuario,
      email: user.email,
      type: "refresh",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "refresh-secret", {
      algorithm: "HS256",
    });
  }

  /** Valida um JWT */
  async validateJWT(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "default-secret", {
        algorithms: ["HS256"],
      });
      return decoded;
    } catch {
      throw new HttpException("Token inválido ou expirado", HttpStatus.UNAUTHORIZED);
    }
  }
}
