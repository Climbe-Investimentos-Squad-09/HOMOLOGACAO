import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { Proposals } from './entities/proposals.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Proposals])],
  controllers: [ProposalsController],
  providers: [ProposalsService],
})

export class ProposalsModule {}