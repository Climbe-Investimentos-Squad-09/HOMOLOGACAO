import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Companies } from './entities/companies.entity';
import { DriveModule } from '../drive/drive.module';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Companies]), DriveModule, AuthModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})

export class CompaniesModule {}