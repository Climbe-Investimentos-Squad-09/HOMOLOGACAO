import { Module } from '@nestjs/common';
import { DriveController } from './drive.controller';
import { driveService } from './drive.service';
import { AuthModule } from '../auth/auth.module';
import { GmailModule } from '../gmail/gmail.module';

@Module({
  controllers: [DriveController], // Lista de controladores do módulo
  providers: [driveService], // Lista de provedores (serviços, guardas, etc.)
  exports: [driveService], // Provedores que podem ser usados por outros módulos
  imports: [AuthModule, GmailModule]
})

export class DriveModule {}