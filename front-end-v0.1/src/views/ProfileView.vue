<template>
  <div class="profile-container">
    <div class="tabs">
      <button class="tab active">Perfil</button>
      <button class="tab" @click="goToSettings">Configurações</button>
    </div>

    <div class="profile-content">
      <div class="profile-main">
        <div class="info-section">
          <h3>Informações pessoais:</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nome Completo:</label>
              <input 
                type="text" 
                v-model="formData.nomeCompleto"
                :disabled="loading"
              />
            </div>
            <div class="form-group">
              <label>CPF:</label>
              <input 
                type="text" 
                v-model="formData.cpf"
                :disabled="true"
                placeholder="CPF não pode ser alterado"
              />
            </div>
            <div class="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                v-model="formData.email"
                :disabled="loading"
              />
            </div>
            <div class="form-group">
              <label>Telefone:</label>
              <input 
                type="tel" 
                v-model="formData.contato"
                :disabled="loading"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
          <button 
            class="save-btn" 
            @click="handleSave"
            :disabled="loading || !hasChanges"
          >
            {{ loading ? 'Salvando...' : 'Salvar alterações' }}
          </button>
        </div>

        <div class="right-column">
          <div class="account-section">
            <h3>Informações da conta:</h3>
            <div class="account-info">
              <div class="info-item">
                <span class="label">Cargo:</span>
                <span class="value">{{ userRole || 'Sem cargo' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Membro desde:</span>
                <span class="value">{{ formattedDate }}</span>
              </div>
              <div class="info-item">
                <span class="label">Permissões:</span>
                <div class="permissions">
                  <span 
                    v-for="perm in displayedPermissions" 
                    :key="perm"
                    class="permission-tag"
                  >
                    {{ perm }}
                  </span>
                  <span v-if="displayedPermissions.length === 0" class="no-permissions">
                    Nenhuma permissão
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getUserById, updateUser } from '@/api/users'
import { getRoleById } from '@/api/roles'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { success, error } = useToast()

const loading = ref(false)
const userData = ref(null)
const formData = ref({
  nomeCompleto: '',
  email: '',
  cpf: '',
  contato: ''
})

const userRole = ref('')
const displayedPermissions = ref([])

const formattedDate = computed(() => {
  if (!userData.value?.dataCriacao) return 'N/A'
  const date = new Date(userData.value.dataCriacao)
  return date.toLocaleDateString('pt-BR', { 
    year: 'numeric', 
    month: 'long' 
  })
})

const hasChanges = computed(() => {
  if (!userData.value) return false
  return (
    formData.value.nomeCompleto !== userData.value.nomeCompleto ||
    formData.value.email !== userData.value.email ||
    formData.value.contato !== (userData.value.contato || '')
  )
})

const loadUserData = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) {
      router.push('/login')
      return
    }

    const data = await getUserById(userId)
    userData.value = data
    
    formData.value = {
      nomeCompleto: data.nomeCompleto || '',
      email: data.email || '',
      cpf: data.cpf || '',
      contato: data.contato || ''
    }

    if (data.cargo) {
      try {
        const role = await getRoleById(data.cargo.idCargo)
        userRole.value = role.nomeCargo
      } catch (error) {
        userRole.value = data.cargo.nomeCargo || 'Sem cargo'
      }
    } else {
      userRole.value = 'Sem cargo'
    }

    const rolePerms = data.cargo?.permissoes || []
    const extraPerms = data.permissoesExtras || []
    const allPerms = [...rolePerms, ...extraPerms]
    
    const moduleNames = {
      'propostas': 'Propostas',
      'contratos': 'Contratos',
      'documentos_juridicos': 'Documentos',
      'empresas': 'Empresas',
      'usuarios': 'Usuários',
      'reunioes': 'Reuniões',
      'relatorios': 'Relatórios',
      'cargos': 'Cargos',
      'permissoes': 'Permissões'
    }

    const uniqueModules = new Set()
    allPerms.forEach(perm => {
      const [module] = perm.nome.split(':')
      if (moduleNames[module]) {
        uniqueModules.add(moduleNames[module])
      }
    })

    displayedPermissions.value = Array.from(uniqueModules).sort()
  } catch (err) {
    console.error('Erro ao carregar dados do usuário:', err)
    error('Erro ao carregar dados do perfil. Tente novamente.')
  }
}

const handleSave = async () => {
  if (!hasChanges.value) return

  loading.value = true
  try {
    const userId = authStore.user?.id
    if (!userId) {
      router.push('/login')
      return
    }

    const userIdToUpdate = userData.value?.idUsuario || userId

    const updateDto = {
      nomeCompleto: formData.value.nomeCompleto,
      email: formData.value.email,
      contato: formData.value.contato || undefined
    }

    await updateUser(userIdToUpdate, updateDto)
    
    await loadUserData()
    
    if (authStore.user) {
      authStore.setUser({
        ...authStore.user,
        name: formData.value.nomeCompleto,
        email: formData.value.email
      })
    }

    success('Perfil atualizado com sucesso!')
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err)
    if (err.response?.status === 409) {
      error('Este email já está cadastrado. Por favor, use outro email.')
    } else {
      error('Erro ao atualizar perfil. Tente novamente.')
    }
  } finally {
    loading.value = false
  }
}

const goToSettings = () => {
  router.push('/configuracoes')
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile-container {
  padding: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #e9ecef;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab.active {
  background: white;
  color: #333;
  font-weight: 600;
}

.tab:hover {
  background: #dee2e6;
}

.profile-content {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.profile-main {
  display: flex;
  gap: 2rem;
}

.profile-main .info-section {
  flex: 2;
}

.profile-main .right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #2ea89d;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.save-btn {
  background: #2ea89d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #25968c;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.account-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.account-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.account-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-weight: 600;
  color: #333;
}

.value {
  color: #666;
}

.permissions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.permission-tag {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #666;
}

.no-permissions {
  color: #999;
  font-style: italic;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .profile-main {
    flex-direction: column;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
