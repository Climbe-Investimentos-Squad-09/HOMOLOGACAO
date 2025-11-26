import { Module } from '@nestjs/common';
import { gmailController } from './gmail.controller';
import { gmailService } from './gmail.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [gmailController], // Lista de controladores do módulo
  providers: [gmailService], // Lista de provedores (serviços, guardas, etc.)
  exports: [gmailService], // Provedores que podem ser usados por outros módulos
  imports: [AuthModule]
})
export class GmailModule {}