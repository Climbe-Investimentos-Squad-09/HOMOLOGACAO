export enum SituacaoUsuario {
  Ativo = 'Ativo',
  Bloqueado = 'Bloqueado',
  PENDENTE = 'PENDENTE',
}

export interface UpdateUserStatusDto {
  situacao: SituacaoUsuario;
}
