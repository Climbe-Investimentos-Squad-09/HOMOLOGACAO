import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Role } from '../roles/entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User,Role,Permission])],
    controllers: [UserController], // Lista de controladores do módulo
    providers: [UserService], // Lista de provedores (serviços, guardas, etc.)
    exports: [UserService], // Provedores que podem ser usados por outros módulos
})
export class UserModule { }