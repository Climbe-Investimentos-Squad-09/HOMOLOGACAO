import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Companies } from './entities/companies.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Companies])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})

export class CompaniesModule {}