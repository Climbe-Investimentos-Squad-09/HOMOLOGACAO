import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './services/google-oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from '../user/entities/user.entity';
import { Role } from '../roles/entities/role.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        EventEmitterModule.forRoot(),
    ],
    controllers: [AuthController],
    providers: [AuthService, GoogleOAuthService],
    exports: [AuthService, GoogleOAuthService],
})
export class AuthModule { }