// src/modules/meetings/reunioes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReunioesController } from './meeting.controller';
import { ReunioesService } from './meeting.service';
import { Reuniao } from './entities/meeting.entity';
import { ReuniaoParticipante } from './entities/meeting-member.entity';
import { ReuniaoAtividade } from './entities/meeting-activity.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reuniao, ReuniaoParticipante, ReuniaoAtividade, User])],
  controllers: [ReunioesController],
  providers: [ReunioesService],
  exports: [ReunioesService],
})
export class ReunioesModule {}
