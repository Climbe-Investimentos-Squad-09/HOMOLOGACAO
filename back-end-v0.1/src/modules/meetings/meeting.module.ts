// src/modules/meetings/reunioes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReunioesController } from './meeting.controller';
import { ReunioesService } from './meeting.service';
import { Reuniao } from './Entities/meeting.entity';
import { ReuniaoParticipante } from './Entities/meeting-member.entity';
import { ReuniaoAtividade } from './Entities/meeting-activity.entity';
import { User } from '../user/entities/user.entity';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reuniao, ReuniaoParticipante, ReuniaoAtividade, User]), CalendarModule],
  controllers: [ReunioesController],
  providers: [ReunioesService],
  exports: [ReunioesService],
})
export class ReunioesModule {}
