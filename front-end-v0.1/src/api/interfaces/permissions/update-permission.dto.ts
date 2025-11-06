import { CreatePermissionDto } from './create-permission.dto';

export interface UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
