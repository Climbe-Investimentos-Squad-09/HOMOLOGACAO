import { Module } from '@nestjs/common';
import { gmailController } from './gmail.controller';
import { gmailService } from './gmail.service';
import { AuthModule } from '../auth/auth.module';
import { DriveModule } from '../drive/drive.module';

@Module({
  controllers: [gmailController], // Lista de controladores do módulo
  providers: [gmailService], // Lista de provedores (serviços, guardas, etc.)
  exports: [gmailService], // Provedores que podem ser usados por outros módulos
  imports: [AuthModule, DriveModule]
})
export class GmailModule {}