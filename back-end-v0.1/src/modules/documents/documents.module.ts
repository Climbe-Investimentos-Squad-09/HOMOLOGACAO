import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/documents.entity';
import { Companies } from '../companies/entities/companies.entity';
import { Contract } from '../contracts/entities/contracts.entity';
import { User } from '../user/entities/user.entity';
import { DriveModule } from '../drive/drive.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Companies, Contract, User]),
    DriveModule,
    AuthModule
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}

