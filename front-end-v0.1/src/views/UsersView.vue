<template>
  <div class="users-view">
    <UsersHeader
      @search-changed="handleSearchChange"
      @filters-changed="handleFiltersChange"
      @open-create-modal="showCreateModal = true"
    />
    <UsersTable 
      :users="formattedUsers" 
      :loading="loading"
      @edit-user="handleEditUser"
      @refresh="loadUsers"
    />
    <UsersCreateModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false"
      @user-created="handleUserCreated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import UsersHeader from '../components/user/UsersHeader.vue'
import UsersTable from '../components/user/UsersTable.vue'
import UsersCreateModal from '../components/user/UsersCreateModal.vue'
import { getUsers, SituacaoUsuario } from '@/api/users'

const showCreateModal = ref(false)
const searchQuery = ref('')
const selectedFilters = ref([])
const allUsers = ref([])
const loading = ref(false)

const loadUsers = async () => {
  loading.value = true
  try {
    const filters = {}
    if (searchQuery.value.trim()) {
      filters.nome = searchQuery.value.trim()
    }
    if (selectedFilters.value && selectedFilters.value.length > 0) {
      const situacaoMap = {
        'Ativo': SituacaoUsuario.Ativo,
        'Bloqueado': SituacaoUsuario.Bloqueado,
        'Pendente': SituacaoUsuario.PENDENTE
      }
      const situacoes = selectedFilters.value.map(f => situacaoMap[f] || f)
      if (situacoes.length === 1) {
        filters.situacao = situacoes[0]
      }
    }
    console.log('Carregando usuários com filtros:', filters)
    const users = await getUsers(filters)
    console.log('Usuários carregados:', users)
    allUsers.value = users || []
    console.log('Total de usuários exibidos:', allUsers.value.length)
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    allUsers.value = []
  } finally {
    loading.value = false
  }
}

const handleSearchChange = (query) => {
  searchQuery.value = query
  loadUsers()
}

const handleFiltersChange = (filters) => {
  selectedFilters.value = filters
  loadUsers()
}

const handleUserCreated = () => {
  showCreateModal.value = false
  setTimeout(() => {
    loadUsers()
  }, 100)
}

const handleEditUser = (user) => {
  console.log('Editar usuário:', user)
}

const formattedUsers = computed(() => {
  return allUsers.value.map(user => ({
    id: user.idUsuario,
    name: user.nomeCompleto,
    email: user.email,
    role: user.cargo?.nomeCargo || 'Sem cargo',
    contactEmail: user.email,
    contactPhone: user.contato || '-',
    status: user.situacao,
    permissions: [
      ...(user.permissoesExtras?.map(p => p.nome) || [])
    ],
    lastAccess: user.ultimoAcesso ? new Date(user.ultimoAcesso).toLocaleDateString('pt-BR') : '-',
    rawUser: user
  }))
})

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users-view {
  padding: 1rem;
}
</style>

