<template>
  <div class="authorizations-view">
    <AuthorizationsTable 
      :authorizations="formattedAuthorizations" 
      :loading="loading"
      @approve="handleApprove"
      @reject="handleReject"
      @refresh="loadAuthorizations"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AuthorizationsTable from '../components/authorizations/AuthorizationsTable.vue'
import { getUsers, updateUserStatus, SituacaoUsuario } from '@/api/users'
import { useToast } from '@/composables/useToast'
import { usePendingAuthorizations } from '@/composables/usePendingAuthorizations'

const { success, error } = useToast()
const { fetchPendingCount } = usePendingAuthorizations()
const allAuthorizations = ref([])
const loading = ref(false)

const loadAuthorizations = async () => {
  loading.value = true
  try {
    allAuthorizations.value = await getUsers({ situacao: SituacaoUsuario.PENDENTE })
  } catch (err) {
    if (err.response?.status === 403) {
      error('Você não tem permissão para visualizar autorizações. Entre em contato com o administrador.')
    }
    allAuthorizations.value = []
  } finally {
    loading.value = false
  }
}

const handleApprove = async (user) => {
  try {
    await updateUserStatus(user.idUsuario, SituacaoUsuario.Ativo)
    await loadAuthorizations()
    await fetchPendingCount()
    success('Usuário autorizado com sucesso!')
  } catch (err) {
    error('Erro ao aprovar usuário. Tente novamente.')
  }
}

const handleReject = async (user) => {
  try {
    await updateUserStatus(user.idUsuario, SituacaoUsuario.Bloqueado)
    await loadAuthorizations()
    await fetchPendingCount()
    success('Usuário rejeitado com sucesso!')
  } catch (err) {
    error('Erro ao rejeitar usuário. Tente novamente.')
  }
}

const formattedAuthorizations = computed(() => {
  return allAuthorizations.value.map(user => ({
    id: user.idUsuario,
    fullName: user.nomeCompleto,
    email: user.email,
    category: user.cargo ? 'Permissões' : 'Login',
    rawUser: user
  }))
})

onMounted(() => {
  loadAuthorizations()
})
</script>

<style scoped>
.authorizations-view {
  padding: 1rem;
}

@media (max-width: 768px) {
  .authorizations-view {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .authorizations-view {
    padding: 0.5rem;
  }
}
</style>
