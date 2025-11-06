import 'dotenv/config';
import { AppDataSource } from '../config/data-source';
import { Repository } from 'typeorm';
import { Role } from '../modules/roles/entities/role.entity';
import { Permission } from '../modules/permissions/entities/permission.entity';

async function updateAdminPermissions() {
  await AppDataSource.initialize();

  const roleRepo = AppDataSource.getRepository(Role);
  const permRepo = AppDataSource.getRepository(Permission);

  const adminRoleNames = ['SysAdmin', 'Administrador', 'Admin'];
  
  for (const roleName of adminRoleNames) {
    const role = await roleRepo.findOne({
      where: { nomeCargo: roleName },
      relations: ['permissoes']
    });

    if (role) {
      console.log(`Atualizando permissões do cargo: ${roleName}`);
      
      const allPerms = await permRepo.find();
      role.permissoes = allPerms;
      
      await roleRepo.save(role);
      console.log(`✓ Cargo ${roleName} atualizado com ${allPerms.length} permissões`);
    } else {
      console.log(`Cargo ${roleName} não encontrado`);
    }
  }

  await AppDataSource.destroy();
  console.log('Concluído!');
}

updateAdminPermissions().catch(async (err) => {
  console.error('Erro:', err);
  try {
    await AppDataSource.destroy();
  } catch {}
  process.exit(1);
});

