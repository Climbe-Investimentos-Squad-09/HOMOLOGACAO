<template>
  <div class="users-table-container card">
    <h2 class="card-title">Usuários ({{ users.length }})</h2>

    <div v-if="users.length === 0" class="no-users-message">
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
            <span class="role-badge">{{ user.role }}</span>
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
            <div class="permissions-list">
              <span v-for="(permission, index) in user.permissions" :key="index" class="permission-badge">
                {{ permission }}
              </span>
            </div>
          </td>
          <td>{{ user.lastAccess }}</td>
          <td class="actions-cell">
            <button class="action-icon-button edit-button" title="Editar">
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
const props = defineProps({
  users: {
    type: Array,
    default: () => []
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'Ativo':
      return 'status-active';
    case 'Inativo':
      return 'status-inactive';
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

.no-users-message {
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
</style>

