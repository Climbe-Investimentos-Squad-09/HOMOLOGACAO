import { IsInt, IsArray } from 'class-validator';

export class AssignPermissionDto {
  @IsInt()
  roleId!: number;

  @IsArray()
  permissionIds!: number[];
}
