import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleOAuthService],
    exports: [AuthService, GoogleOAuthService],
})
export class AuthModule { }