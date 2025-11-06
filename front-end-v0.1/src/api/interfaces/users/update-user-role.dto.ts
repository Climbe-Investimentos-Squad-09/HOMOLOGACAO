export interface UpdateUserRoleDto {
  idCargo: number;

  permissoesExtras?: number[]; // IDs das permissões extras
}
