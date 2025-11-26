<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Adicionar usuário:</h2>
                <button class="close-button" @click="$emit('close')">✕</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="full-name">Nome completo:</label>
                    <input 
                        type="text" 
                        id="full-name" 
                        placeholder="Insira o nome completo"
                        v-model="formData.nomeCompleto"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="corporate-email">Email:</label>
                    <input 
                        type="email" 
                        id="corporate-email" 
                        placeholder="nome@company.com"
                        v-model="formData.email"
                        required
                    />
                </div>

                <div class="form-group">
                    <label for="cpf">CPF:</label>
                    <input 
                        type="text" 
                        id="cpf" 
                        placeholder="000.000.000-00"
                        v-model="formData.cpf"
                    />
                </div>

                <div class="form-group">
                    <label for="phone">Telefone:</label>
                    <input 
                        type="text" 
                        id="phone" 
                        placeholder="(11) 99999-9999"
                        v-model="formData.contato"
                    />
                </div>

                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Mínimo 6 caracteres"
                        v-model="formData.senha"
                    />
                </div>

                <div v-if="canManageRole" class="form-group">
                    <label for="role">Cargo: <span style="color: #AE3B3B;">*</span></label>
                    <select id="role" v-model="formData.idCargo" required>
                        <option :value="undefined" selected disabled>Selecione um cargo</option>
                        <option v-for="role in roles" :key="role.idCargo" :value="role.idCargo">
                            {{ role.nomeCargo }}
                        </option>
                    </select>
                    <small style="color: #6C757D; font-size: 0.75rem; margin-top: 0.25rem; display: block;">
                      Usuários criados por esta tela são aprovados automaticamente
                    </small>
                </div>
                <div v-else class="form-group">
                    <label>Cargo:</label>
                    <input type="text" value="Sem cargo" disabled style="background-color: #f0f0f0; cursor: not-allowed;" />
                    <small style="color: #6C757D; font-size: 0.75rem; margin-top: 0.25rem; display: block;">
                      Você não tem permissão para atribuir cargo. O usuário será criado sem cargo.
                    </small>
                </div>

                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>
                <div v-if="successMessage" class="success-message">
                    {{ successMessage }}
                </div>
            </div>

            <div class="modal-footer">
                <button class="cancel-button" @click="handleClose" :disabled="loading">Cancelar</button>
                <button class="add-user-button" @click="handleSubmit" :disabled="loading">
                    {{ loading ? 'Salvando...' : 'Adicionar usuário' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { createUser } from '@/api/users'
import { getAllRoles } from '@/api/roles'
import { canManageRoleAndPermissions } from '@/utils/permissions'

const emit = defineEmits(['close', 'user-created'])

const formData = ref({
  nomeCompleto: '',
  email: '',
  cpf: '',
  contato: '',
  senha: '',
  idCargo: undefined
})

const roles = ref([])
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const canManageRole = computed(() => canManageRoleAndPermissions())

const loadRoles = async () => {
  try {
    roles.value = await getAllRoles()
  } catch (error) {
  }
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const resetForm = () => {
  formData.value = {
    nomeCompleto: '',
    email: '',
    cpf: '',
    contato: '',
    senha: '',
    idCargo: undefined
  }
  errorMessage.value = ''
  successMessage.value = ''
}

const handleSubmit = async () => {
  if (!formData.value.nomeCompleto || !formData.value.email) {
    errorMessage.value = 'Nome completo e email são obrigatórios'
    successMessage.value = ''
    return
  }

  if (canManageRole.value && !formData.value.idCargo) {
    errorMessage.value = 'É necessário selecionar um cargo para criar o usuário'
    successMessage.value = ''
    return
  }

  if (formData.value.senha && formData.value.senha.length < 6) {
    errorMessage.value = 'A senha deve ter pelo menos 6 caracteres'
    successMessage.value = ''
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const payload = {
      nomeCompleto: formData.value.nomeCompleto,
      email: formData.value.email,
      cpf: formData.value.cpf || undefined,
      contato: formData.value.contato || undefined,
      senha: formData.value.senha || undefined,
      idCargo: formData.value.idCargo || undefined
    }
    
    const createdUser = await createUser(payload)
    
    successMessage.value = 'Usuário criado com sucesso!'
    
    setTimeout(() => {
      resetForm()
      emit('user-created')
    }, 1500)
  } catch (error) {
    successMessage.value = ''
    if (error.response?.status === 409) {
      errorMessage.value = 'Email ou CPF já cadastrado'
    } else if (error.response?.status === 403) {
      errorMessage.value = 'Você não tem permissão para criar usuários. Entre em contato com o administrador.'
    } else if (error.response?.status === 401) {
      errorMessage.value = 'Sessão expirada. Faça login novamente.'
    } else {
      errorMessage.value = error.response?.data?.message || error.message || 'Erro ao criar usuário. Tente novamente.'
    }
    loading.value = false
  }
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    backdrop-filter: blur(2px);
}

.modal-content {
    background-color: #fff;
    padding: 24px;
    border-radius: 8px;
    width: 520px;
    max-width: 95%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.modal-header h2 {
    font-size: 16px;
    font-weight: 600;
}

.close-button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #858585;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 500;
    color: #333;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #f6f6f6;
    background-color: #f6f6f6;
    font-size: 14px;
    color: #535353;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #3C6E6C;
}

.error-message {
    color: #AE3B3B;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #FFCFCF;
    border-radius: 4px;
}

.success-message {
    color: #018D0B;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: #B6F8BB;
    border-radius: 4px;
    border: 1px solid #B5EDB9;
}

.modal-footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 24px;
}

.cancel-button {
    background-color: #4AA19D;
    color: white;
    padding: 10px 48px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    width: 225px;
}

.add-user-button {
    background-color: #3C6E6C;
    color: white;
    padding: 10px 48px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    width: 225px;
}

.add-user-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-footer {
    flex-direction: column;
    gap: 0.75rem;
  }

  .cancel-button,
  .add-user-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1rem;
    margin: 0.5rem;
  }

  .modal-header h2 {
    font-size: 1.1rem;
  }

  .form-group input,
  .form-group select {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
