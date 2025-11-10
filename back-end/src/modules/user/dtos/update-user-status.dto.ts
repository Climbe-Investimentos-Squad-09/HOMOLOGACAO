import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SituacaoUsuario } from '../enums/situacao-usuario-enum.dto';


export class UpdateUserStatusDto {
  @ApiProperty({ enum: SituacaoUsuario })
  @IsEnum(SituacaoUsuario)
  situacao!: SituacaoUsuario;
  static Ativo: SituacaoUsuario;
}
