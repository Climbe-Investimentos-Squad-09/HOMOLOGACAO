// src/modules/companies/dtos/update-company.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CompleteCompanyDto } from './complete-company.dto';

export class UpdateCompanyDto extends PartialType(CompleteCompanyDto) {}
