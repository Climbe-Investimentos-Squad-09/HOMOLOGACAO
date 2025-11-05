import { IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddPermissionsDto {
  @ApiProperty({ example: [1, 3, 8] })
  @IsArray() @ArrayNotEmpty() @Type(() => Number)
  permissionIds!: number[];
}

export class RemovePermissionsDto {
  @ApiProperty({ example: [3] })
  @IsArray() @ArrayNotEmpty() @Type(() => Number)
  permissionIds!: number[];
}
