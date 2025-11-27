import { Module , NestModule, MiddlewareConsumer} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { CalendarModule } from './modules/calendar/calendar.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/role.module';
import { PermissionsModule } from './modules/permissions/permission.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ProposalsModule } from './modules/proposals/proposals.module';
import { GmailModule } from './modules/gmail/gmail.module';
import { DriveModule } from './modules/drive/drive.module';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsGuard } from './modules/auth/guards/permissions.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { User } from './modules/user/entities/user.entity';
import { AuthzMiddleware } from './modules/auth/middlewares/authz.middleware';
import { AuditModule } from './audit/audit.module';
import { ReunioesModule } from './modules/meetings/meeting.module';
import { DocumentsModule } from './modules/documents/documents.module';

@Module({
  imports:
    [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
      
    }),
      TypeOrmModule.forFeature([]),
      
      AuthModule,
      CalendarModule,
      DriveModule,
      GmailModule,
      UserModule,
      RolesModule,
      PermissionsModule,
      CompaniesModule,
      ProposalsModule,
      ContractsModule,      
      UserModule,
      AuditModule,
      ReunioesModule,
      DocumentsModule,
    ],

    providers: [{ provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(AuthzMiddleware).forRoutes('*');
    }
 }