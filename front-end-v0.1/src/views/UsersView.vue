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
      @open-permissions-modal="handleOpenPermissionsModal"
    />
    <UsersCreateModal 
      v-if="showCreateModal" 
      @close="showCreateModal = false"
      @user-created="handleUserCreated"
    />
    <UsersEditModal
      v-if="showEditModal && selectedUser"
      :user="selectedUser"
      @close="showEditModal = false"
      @saved="handleUserSaved"
      @deleted="handleUserDeleted"
    />
    <UsersPermissionsModal
      v-if="showPermissionsModal && selectedUser"
      :user="selectedUser"
      @close="showPermissionsModal = false"
      @saved="handlePermissionsSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UsersHeader from '../components/user/UsersHeader.vue'
import UsersTable from '../components/user/UsersTable.vue'
import UsersCreateModal from '../components/user/UsersCreateModal.vue'
import UsersEditModal from '../components/user/UsersEditModal.vue'
import UsersPermissionsModal from '../components/user/UsersPermissionsModal.vue'
import { getUsers, SituacaoUsuario } from '@/api/users'

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPermissionsModal = ref(false)
const selectedUser = ref(null)
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
    const users = await getUsers(filters)
    allUsers.value = users || []
  } catch (error) {
    if (error.response?.status === 403) {
      alert('Você não tem permissão para visualizar usuários. Entre em contato com o administrador.')
    }
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
  selectedUser.value = user
  showEditModal.value = true
}

const handleOpenPermissionsModal = (user) => {
  selectedUser.value = user
  showPermissionsModal.value = true
}

const handleUserSaved = () => {
  showEditModal.value = false
  selectedUser.value = null
  setTimeout(() => {
    loadUsers()
  }, 100)
}

const handleUserDeleted = () => {
  showEditModal.value = false
  selectedUser.value = null
  setTimeout(() => {
    loadUsers()
  }, 100)
}

const handlePermissionsSaved = async () => {
  const editedUserId = selectedUser.value?.id
  showPermissionsModal.value = false
  selectedUser.value = null
  
  // Recarregar usuários
  await loadUsers()
  
  // Se o usuário editado for o usuário logado, recarregar permissões
  const authStore = useAuthStore()
  if (authStore.user?.id === editedUserId) {
    console.log('🔄 Recarregando permissões do usuário logado após edição')
    await authStore.loadUserPermissions()
  }
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

