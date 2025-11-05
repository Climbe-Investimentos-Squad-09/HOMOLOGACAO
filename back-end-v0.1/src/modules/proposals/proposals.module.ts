import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { Proposals } from './entities/proposals.entity';
import { ProposalAssignee } from './entities/proposal-assignee.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposals, ProposalAssignee,User])],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})

export class ProposalsModule {}