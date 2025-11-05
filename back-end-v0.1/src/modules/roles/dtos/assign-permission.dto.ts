import { IsInt, IsArray } from 'class-validator';

export class AssignPermissionDto {
  @IsInt()
  idCargo!: number;

  @IsArray()
  permissionIds!: number[];
}
