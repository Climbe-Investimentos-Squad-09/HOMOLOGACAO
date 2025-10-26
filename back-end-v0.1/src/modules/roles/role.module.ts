import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './role.controller';
import { RolesService } from './role.service';
import { Role } from './entities/role.entity';
import { Permission } from '../../modules/permissions/entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService] // exporta para ser usado em AuthGuard e Users
})
export class RolesModule {}