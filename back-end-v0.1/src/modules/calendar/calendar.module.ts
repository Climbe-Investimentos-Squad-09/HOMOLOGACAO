import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { calendarService } from './calendar.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [CalendarController], // Lista de controladores do módulo
  providers: [calendarService], // Lista de provedores (serviços, guardas, etc.)
  exports: [calendarService], // Provedores que podem ser usados por outros módulos
  imports: [AuthModule]
})
export class CalendarModule {}