import { Module } from '@nestjs/common';
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

@Module({
  imports:
    [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
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
      UserModule
    ],
})
export class AppModule { }