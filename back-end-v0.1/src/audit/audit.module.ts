import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Audit } from './entities/audit.entity';
import { AuditService } from './audit.service';
import { AuditRegistry } from './audit.registry';
import { AuditInterceptor } from './audit.interceptor';
import { AuditLoadersProvider } from './audit.loaders.provider';
import { AuditController } from './audit.controller';
import { Contract } from '../modules/contracts/entities/contracts.entity';
import { Proposals } from '../modules/proposals/entities/proposals.entity';
import { User } from '../modules/user/entities/user.entity';
import { Companies } from '../modules/companies/entities/companies.entity';
//import { Document } from '../modules/documents/entities/document.entity'; ADCIONAR QUANDO IMPLEMENTAR DOCUMENTS

@Module({
  imports: [TypeOrmModule.forFeature([Audit, Contract, Proposals,User,Companies])],
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditRegistry,
    { provide: APP_INTERCEPTOR, useClass: AuditInterceptor },
    AuditLoadersProvider,
  ],
  exports: [AuditService],
})
export class AuditModule {}
