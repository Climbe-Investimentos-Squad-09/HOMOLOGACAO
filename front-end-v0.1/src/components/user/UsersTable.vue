<template>
  <div class="users-table-container card">
    <h2 class="card-title">Usuários ({{ users.length }})</h2>

    <div v-if="loading" class="loading-message">
      <p>Carregando usuários...</p>
    </div>

    <div v-else-if="users.length === 0" class="no-users-message">
      <p>Nenhum usuário encontrado.</p>
    </div>

    <table v-else class="users-table">
      <thead>
        <tr>
          <th>Usuário</th>
          <th>Cargo</th>
          <th>Contato</th>
          <th>Status</th>
          <th>Permissões</th>
          <th>Último acesso</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td class="user-info-cell">
            <div class="user-avatar"></div>
            <div class="user-details">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-email">{{ user.email }}</span>
            </div>
          </td>
          <td>
            <select 
              v-if="canManageRole"
              :value="getRoleValue(user)"
              @change="handleRoleChange(user, $event)"
              class="role-select"
            >
              <option value="">Sem cargo</option>
              <option 
                v-for="role in roles" 
                :key="role.idCargo" 
                :value="String(role.idCargo)"
              >
                {{ role.nomeCargo }}
              </option>
            </select>
            <span v-else class="role-badge">{{ user.role }}</span>
          </td>
          <td>
            <span class="contact-email">{{ user.contactEmail }}</span>
            <span class="contact-phone">{{ user.contactPhone }}</span>
          </td>
          <td>
            <span :class="[
              'status-badge',
              getStatusClass(user.status)
            ]">
              {{ user.status }}
            </span>
          </td>
          <td>
            <button 
              v-if="canEdit"
              class="permissions-button" 
              @click="$emit('open-permissions-modal', user)"
              title="Gerenciar permissões"
            >
              <span v-if="user.permissions.length > 0" class="permissions-count">{{ user.permissions.length }}</span>
              <span class="permissions-text">Permissões</span>
            </button>
          </td>
          <td>{{ user.lastAccess }}</td>
          <td class="actions-cell">
            <button 
              v-if="canEdit" 
              class="action-icon-button edit-button" 
              title="Editar" 
              @click="$emit('edit-user', user)"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4167 6.33333L13.6667 2.58333L2.5 13.75V17.5H6.25L17.4167 6.33333Z" stroke="#6C757D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAllRoles } from '@/api/roles'
import { updateUserRole } from '@/api/users'
import { isAdmin as checkIsAdmin, canEditOrCreate, canManageRoleAndPermissions } from '@/utils/permissions'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit-user', 'refresh', 'open-permissions-modal']);

const roles = ref([])
const isAdmin = computed(() => checkIsAdmin())
const canEdit = computed(() => canEditOrCreate('usuarios'))
const { error: showError, success: showSuccess } = useToast()
const canManageRole = computed(() => canManageRoleAndPermissions())

const getRoleValue = (user) => {
  const cargo = user.rawUser?.cargo
  if (cargo && cargo.idCargo) {
    return String(cargo.idCargo)
  }
  return ''
}

const loadRoles = async () => {
  try {
    roles.value = await getAllRoles()
  } catch (error) {
  }
}

const handleRoleChange = async (user, event) => {
  try {
    const value = event.target.value
    const roleId = value === '' || value === null || value === undefined 
      ? null 
      : parseInt(value, 10)
    
    const payload = roleId === null ? { idCargo: null } : { idCargo: roleId }
    const updatedUser = await updateUserRole(user.id, payload)
    
    if (user.rawUser) {
      user.rawUser.cargo = roleId === null ? null : (updatedUser?.cargo || null)
    }
    
    emit('refresh')
    showSuccess('Cargo atualizado com sucesso!')
  } catch (err) {
    showError(`Erro ao atualizar cargo: ${err.response?.data?.message || err.message || 'Tente novamente.'}`)
    emit('refresh')
  }
}

onMounted(() => {
  loadRoles()
})

const getStatusClass = (status) => {
  switch (status) {
    case 'Ativo':
      return 'status-active';
    case 'Bloqueado':
      return 'status-inactive';
    case 'PENDENTE':
    case 'Pendente':
      return 'status-pending';
    default:
      return '';
  }
};
</script>

<style scoped>
.users-table-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #E9ECEF;
  margin-top: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.no-users-message,
.loading-message {
  text-align: center;
  padding: 2rem;
  color: #6C757D;
  font-style: italic;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #E9ECEF;
}

.users-table th {
  background-color: #F8F9FA;
  font-weight: 600;
  color: #495057;
}

.users-table tbody tr:last-child td {
  border-bottom: none;
}

.users-table tbody tr:hover {
  background-color: #F8F9FA;
}

.user-info-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #E0E0E0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  font-size: 14px;
  font-weight: 500;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #333;
}

.user-email {
  font-size: 0.85rem;
  color: #757575;
}

.role-select {
  padding: 0.4rem 0.75rem;
  border: 1px solid #E9E9E9;
  border-radius: 6px;
  background-color: #FFFFFF;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  min-width: 150px;
}

.role-select:focus {
  outline: none;
  border-color: #3C6E6C;
}

.role-badge {
  background-color: #F6F6F6;
  color: #6B6B6B;
  border: 1px solid #E9E9E9;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.90rem;
  font-weight: 400;
  display: inline-block;
}

.permissions-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background-color: #3C6E6C;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.permissions-button:hover {
  background-color: #4AA19D;
}

.permissions-count {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.permissions-text {
  font-size: 0.875rem;
}

.contact-email,
.contact-phone {
  display: block;
  font-size: 0.9rem;
  color: #535353;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-active {
  background-color: #B6F8BB;
  color: #018D0B;
  border: #B5EDB9 1px solid;
}

.status-inactive {
  background-color: #FFCFCF;
  color: #AE3B3B;
  border: #FFB9B9 1px solid;
}

.status-pending {
  background-color: #FFF4E6;
  color: #B8860B;
  border: #FFE4B5 1px solid;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.permission-badge {
  background-color: #F6F6F6;
  color: #6B6B6B;
  border: 1px solid #E9E9E9;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 400;
  display: inline-block;
}

.actions-cell {
  white-space: nowrap;
}

.action-icon-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 0.5rem;
  color: #6C757D;
  transition: opacity 0.2s;
  padding: 0;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-icon-button:hover {
  opacity: 0.7;
}

@media (max-width: 1200px) {
  .users-table {
    font-size: 0.9rem;
  }

  .users-table th,
  .users-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 968px) {
  .users-table-container {
    overflow-x: auto;
  }

  .users-table {
    min-width: 800px;
  }

  .user-info-cell {
    min-width: 200px;
  }

  .contact-email,
  .contact-phone {
    display: block;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .users-table {
    min-width: 700px;
    font-size: 0.85rem;
  }

  .users-table th,
  .users-table td {
    padding: 0.5rem 0.4rem;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .user-email {
    font-size: 0.75rem;
  }

  .role-select {
    font-size: 0.8rem;
    padding: 0.25rem;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .permissions-button {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 1.1rem;
    padding: 1rem;
  }

  .users-table {
    min-width: 600px;
    font-size: 0.8rem;
  }

  .users-table th,
  .users-table td {
    padding: 0.4rem 0.3rem;
  }
}
</style>

