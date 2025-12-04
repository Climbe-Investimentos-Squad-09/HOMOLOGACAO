import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Report } from './entities/reports.entity';
import { Companies } from '../companies/entities/companies.entity';
import { Contract } from '../contracts/entities/contracts.entity';
import { User } from '../user/entities/user.entity';
import { DriveModule } from '../drive/drive.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report, Companies, Contract, User]),
    DriveModule,
    AuthModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}

