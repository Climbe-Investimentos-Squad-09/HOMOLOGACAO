import { CompleteCompanyDto } from './complete-company.dto';

export interface UpdateCompanyDto extends PartialType(CompleteCompanyDto) {}
