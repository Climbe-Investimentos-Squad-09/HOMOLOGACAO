import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contracts.entity';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { Proposals } from '../proposals/entities/proposals.entity';
import { Companies } from '../companies/entities/companies.entity';
import ContractAssignee from './entities/contract-assignee.entity';
import { User } from '../user/entities/user.entity';
import { DriveModule } from '../drive/drive.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contract,Proposals,Companies,ContractAssignee,User]), DriveModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule{}