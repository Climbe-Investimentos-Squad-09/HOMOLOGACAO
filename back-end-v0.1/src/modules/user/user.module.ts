import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userService } from './user.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController], // Lista de controladores do módulo
    providers: [userService], // Lista de provedores (serviços, guardas, etc.)
    exports: [userService], // Provedores que podem ser usados por outros módulos
})
export class UserModule { }