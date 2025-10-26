<template>
  <div class="users-view">
    <UsersHeader
      @search-changed="handleSearchChange"
      @filters-changed="handleFiltersChange"
      @open-create-modal="showCreateModal = true"
    />
    <UsersTable :users="filteredUsers" />
    <UsersCreateModal v-if="showCreateModal" @close="showCreateModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UsersHeader from '../components/user/UsersHeader.vue';
import UsersTable from '../components/user/UsersTable.vue';
import UsersCreateModal from '../components/user/UsersCreateModal.vue';

const showCreateModal = ref(false);
const searchQuery = ref('');
const selectedFilters = ref([]);

const allUsers = ref([
  {
    id: 'USR-001',
    name: 'João Silva',
    email: 'joaosilva@climbe.com',
    role: 'Analista',
    contactEmail: 'john.smith@company.com',
    contactPhone: '+1 (555) 123-4567',
    status: 'Ativo',
    permissions: ['Documentos', 'Contratos', '+1'],
    lastAccess: '04/02/2024',
  },
  {
    id: 'USR-002',
    name: 'João Silva',
    email: 'joaosilva@climbe.com',
    role: 'Analista',
    contactEmail: 'john.smith@company.com',
    contactPhone: '+1 (555) 123-4567',
    status: 'Inativo',
    permissions: ['Todas as permissões'],
    lastAccess: '04/02/2024',
  },
  {
    id: 'USR-003',
    name: 'João Silva',
    email: 'joaosilva@climbe.com',
    role: 'Analista',
    contactEmail: 'john.smith@company.com',
    contactPhone: '+1 (555) 123-4567',
    status: 'Ativo',
    permissions: ['Documentos', 'Contratos'],
    lastAccess: '04/02/2024',
  },
]);

const handleSearchChange = (query) => {
  searchQuery.value = query;
};

const handleFiltersChange = (filters) => {
  selectedFilters.value = filters;
};

const filteredUsers = computed(() => {
  let filtered = allUsers.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.contactEmail.toLowerCase().includes(query) ||
      user.contactPhone.toLowerCase().includes(query)
    );
  }

  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(user =>
      selectedFilters.value.includes(user.status)
    );
  }

  return filtered;
});
</script>

<style scoped>
.users-view {
  padding: 1rem;
}
</style>

