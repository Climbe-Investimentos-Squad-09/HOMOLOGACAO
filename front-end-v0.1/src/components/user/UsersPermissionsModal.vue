<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ user?.name || 'Usuário' }}</h2>
        <button class="close-button" @click="$emit('close')">✕</button>
      </div>
      
      <div class="modal-intro">
        <p>Selecione as permissões que você deseja associar ao usuário.</p>
      </div>

      <div class="permissions-container">
        <!-- Coluna de Permissões Disponíveis -->
        <div class="permissions-column">
          <div class="column-header">
            <h3>Permissões</h3>
            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z" fill="#9E9E9E"/>
              </svg>
              <input 
                type="text" 
                v-model="searchAvailable" 
                placeholder="Pesquisar" 
                class="search-input"
              />
            </div>
          </div>
          
          <div class="permissions-list" v-if="filteredAvailableGroups.length > 0">
            <div v-for="group in filteredAvailableGroups" :key="group.module" class="permission-group">
              <h4 class="group-title">{{ group.moduleName }}</h4>
              <div 
                v-if="group.visualizar"
                class="permission-item"
                :class="{ 'selected': isSelected(group.visualizar.idPermissao) }"
                @click="togglePermission(group.visualizar)"
              >
                <span class="permission-name">Visualizar {{ group.moduleName }}</span>
              </div>
              <div 
                v-if="group.editar && hasVisualizarPermission(group.module)"
                class="permission-item"
                :class="{ 
                  'selected': isSelected(group.editar.idPermissao),
                  'disabled': !hasVisualizarPermission(group.module)
                }"
                @click="togglePermission(group.editar)"
              >
                <span class="permission-name">Editar ou criar {{ group.moduleName }}</span>
              </div>
              <div 
                v-if="group.editar && !hasVisualizarPermission(group.module)"
                class="permission-item disabled"
                title="É necessário ter permissão de visualizar primeiro"
              >
                <span class="permission-name disabled-text">Editar ou criar {{ group.moduleName }} (requer visualizar)</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Nenhuma permissão disponível</p>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="action-buttons">
          <button 
            class="action-btn move-right" 
            @click="moveToSelected"
            :disabled="selectedAvailable.length === 0"
            title="Adicionar selecionadas"
          >
            >>
          </button>
          <button 
            class="action-btn move-left" 
            @click="moveToAvailable"
            :disabled="selectedSelected.length === 0"
            title="Remover selecionadas"
          >
            <<
          </button>
        </div>

        <!-- Coluna de Permissões Selecionadas -->
        <div class="permissions-column">
          <div class="column-header">
            <h3>Selecionadas</h3>
            <div class="search-wrapper">
              <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z" fill="#9E9E9E"/>
              </svg>
              <input 
                type="text" 
                v-model="searchSelected" 
                placeholder="Pesquisar" 
                class="search-input"
              />
            </div>
          </div>
          
          <div class="permissions-list" v-if="selectedPermissions.length > 0">
            <div v-for="group in filteredSelectedGroups" :key="group.module" class="permission-group">
              <h4 class="group-title">{{ group.moduleName }}</h4>
              <div 
                v-if="group.visualizar"
                class="permission-item selected"
                :class="{ 'highlighted': isSelectedForRemoval(group.visualizar.idPermissao) }"
                @click="toggleSelectedPermission(group.visualizar)"
              >
                <span class="permission-name">Visualizar {{ group.moduleName }}</span>
              </div>
              <div 
                v-if="group.editar && hasVisualizarPermissionInSelected(group.module)"
                class="permission-item selected"
                :class="{ 'highlighted': isSelectedForRemoval(group.editar.idPermissao) }"
                @click="toggleSelectedPermission(group.editar)"
              >
                <span class="permission-name">Editar ou criar {{ group.moduleName }}</span>
              </div>
              <div 
                v-if="group.editar && !hasVisualizarPermissionInSelected(group.module)"
                class="permission-item selected disabled"
                title="É necessário ter permissão de visualizar primeiro"
              >
                <span class="permission-name disabled-text">Editar ou criar {{ group.moduleName }} (requer visualizar)</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>Nenhuma permissão selecionada</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="$emit('close')">Fechar</button>
        <button class="save-button" @click="handleSave" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getPermissions } from '@/api/permissions'
import { addPermissions, removePermissions } from '@/api/users'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const allPermissions = ref([])
const selectedPermissions = ref([])
const availablePermissions = ref([])
const selectedAvailable = ref([])
const selectedSelected = ref([])
const searchAvailable = ref('')
const searchSelected = ref('')
const loading = ref(false)

// Mapeamento de módulos para nomes amigáveis
const moduleNames = {
  'propostas': 'Propostas',
  'contratos': 'Contratos',
  'cargos': 'Cargos',
  'documentos_juridicos': 'Documentos Jurídicos',
  'planilha': 'Planilha',
  'reunioes': 'Reuniões',
  'empresas': 'Empresas',
  'relatorios': 'Relatórios',
  'arquivos': 'Arquivos',
  'usuarios': 'Usuários',
  'permissoes': 'Permissões'
}

const loadPermissions = async () => {
  try {
    const permissions = await getPermissions()
    allPermissions.value = permissions
    
    const userPerms = props.user.rawUser?.permissoesExtras || []
    const uniqueUserPerms = Array.from(
      new Map(userPerms.map(p => [p.idPermissao, p])).values()
    )
    
    const deduplicatedPerms = []
    const moduleEditMap = new Map()
    
    uniqueUserPerms.forEach(p => {
      const [module, action] = p.nome.split(':')
      
      if (action === 'criar' || action === 'editar') {
        const existing = moduleEditMap.get(module)
        if (action === 'editar') {
          if (existing && existing.action === 'criar') {
            const index = deduplicatedPerms.findIndex(perm => perm.idPermissao === existing.perm.idPermissao)
            if (index >= 0) {
              deduplicatedPerms.splice(index, 1)
            }
          }
          deduplicatedPerms.push(p)
          moduleEditMap.set(module, { perm: p, action: 'editar' })
        } else if (action === 'criar' && !existing) {
          deduplicatedPerms.push(p)
          moduleEditMap.set(module, { perm: p, action: 'criar' })
        }
      } else {
        deduplicatedPerms.push(p)
      }
    })
    
    selectedPermissions.value = deduplicatedPerms.map(p => ({
      idPermissao: p.idPermissao,
      nome: p.nome,
      descricao: p.descricao
    }))
    
    const selectedIds = new Set(deduplicatedPerms.map(p => p.idPermissao))
    
    availablePermissions.value = permissions.filter(p => {
      if (selectedIds.has(p.idPermissao)) return false
      
      const [module, action] = p.nome.split(':')
      if (action === 'criar' || action === 'editar') {
        const hasEditOrCreate = deduplicatedPerms.some(perm => {
          const [mod, act] = perm.nome.split(':')
          return mod === module && (act === 'criar' || act === 'editar')
        })
        if (hasEditOrCreate) return false
      }
      
      return true
    })
  } catch (error) {
    // Ignorar erro silenciosamente
  }
}

const simplifyPermissions = (permissions) => {
  const simplified = {}
  const mainModules = ['propostas', 'contratos', 'empresas', 'usuarios', 'autorizacoes']
  
  permissions.forEach(perm => {
    const [module, action] = perm.nome.split(':')
    
    if (!mainModules.includes(module)) return
    
    if (!simplified[module]) {
      simplified[module] = {
        module,
        moduleName: moduleNames[module] || module,
        visualizar: null,
        editar: null
      }
    }
    
    if (action === 'visualizar' && !simplified[module].visualizar) {
      simplified[module].visualizar = perm
    } else if (action === 'editar') {
      simplified[module].editar = perm
    } else if (action === 'criar' && !simplified[module].editar) {
      simplified[module].editar = perm
    }
  })
  
  return Object.values(simplified).filter(group => group.visualizar || group.editar)
}


const filteredAvailableGroups = computed(() => {
  const filtered = availablePermissions.value.filter(p => {
    const search = searchAvailable.value.toLowerCase()
    const moduleName = moduleNames[p.nome.split(':')[0]] || p.nome.split(':')[0]
    return p.nome.toLowerCase().includes(search) || 
           (p.descricao && p.descricao.toLowerCase().includes(search)) ||
           moduleName.toLowerCase().includes(search)
  })
  const simplified = simplifyPermissions(filtered)
  return simplified.filter((group, index, self) => 
    index === self.findIndex(g => g.module === group.module)
  )
})

const filteredSelectedGroups = computed(() => {
  const filtered = selectedPermissions.value.filter(p => {
    const search = searchSelected.value.toLowerCase()
    const moduleName = moduleNames[p.nome.split(':')[0]] || p.nome.split(':')[0]
    return p.nome.toLowerCase().includes(search) || 
           (p.descricao && p.descricao.toLowerCase().includes(search)) ||
           moduleName.toLowerCase().includes(search)
  })
  const simplified = simplifyPermissions(filtered)
  return simplified.filter((group, index, self) => 
    index === self.findIndex(g => g.module === group.module)
  )
})

const isSelected = (id) => {
  return selectedAvailable.value.some(p => p.idPermissao === id)
}

const isSelectedForRemoval = (id) => {
  return selectedSelected.value.some(p => p.idPermissao === id)
}

const hasVisualizarPermission = (module) => {
  const hasInSelected = selectedPermissions.value.some(p => {
    const [mod, action] = p.nome.split(':')
    return mod === module && action === 'visualizar'
  })
  
  const hasInAvailable = selectedAvailable.value.some(p => {
    const [mod, action] = p.nome.split(':')
    return mod === module && action === 'visualizar'
  })
  
  return hasInSelected || hasInAvailable
}

const hasVisualizarPermissionInSelected = (module) => {
  return selectedPermissions.value.some(p => {
    const [mod, action] = p.nome.split(':')
    return mod === module && action === 'visualizar'
  })
}

const togglePermission = (perm) => {
  const alreadyInSelected = selectedPermissions.value.some(p => p.idPermissao === perm.idPermissao)
  if (alreadyInSelected) return
  
  const [module, action] = perm.nome.split(':')
  
  if (action === 'criar' || action === 'editar') {
    const existingInSelected = selectedPermissions.value.findIndex(p => {
      const [mod, act] = p.nome.split(':')
      return mod === module && (act === 'criar' || act === 'editar')
    })
    
    if (existingInSelected >= 0) {
      return
    }
    
    const existingInAvailable = selectedAvailable.value.findIndex(p => {
      const [mod, act] = p.nome.split(':')
      return mod === module && (act === 'criar' || act === 'editar')
    })
    
    if (existingInAvailable >= 0) {
      selectedAvailable.value.splice(existingInAvailable, 1)
    }
  }
  
  const index = selectedAvailable.value.findIndex(p => p.idPermissao === perm.idPermissao)
  if (index >= 0) {
    selectedAvailable.value.splice(index, 1)
  } else {
    selectedAvailable.value.push(perm)
  }
}

const toggleSelectedPermission = (perm) => {
  const index = selectedSelected.value.findIndex(p => p.idPermissao === perm.idPermissao)
  if (index >= 0) {
    selectedSelected.value.splice(index, 1)
  } else {
    const [module, action] = perm.nome.split(':')
    if (action === 'criar' || action === 'editar') {
      const hasOther = selectedSelected.value.some(p => {
        const [mod, act] = p.nome.split(':')
        return mod === module && (act === 'criar' || act === 'editar') && p.idPermissao !== perm.idPermissao
      })
      if (hasOther) {
        const otherIndex = selectedSelected.value.findIndex(p => {
          const [mod, act] = p.nome.split(':')
          return mod === module && (act === 'criar' || act === 'editar') && p.idPermissao !== perm.idPermissao
        })
        if (otherIndex >= 0) {
          selectedSelected.value.splice(otherIndex, 1)
        }
      }
    }
    selectedSelected.value.push(perm)
  }
}

const moveToSelected = () => {
  const selectedIds = new Set(selectedPermissions.value.map(p => p.idPermissao))
  const toAdd = selectedAvailable.value.filter(perm => !selectedIds.has(perm.idPermissao))
  
  toAdd.forEach(perm => {
    const [module, action] = perm.nome.split(':')
    
    if (action === 'criar' || action === 'editar') {
      const existingIndex = selectedPermissions.value.findIndex(p => {
        const [mod, act] = p.nome.split(':')
        return mod === module && (act === 'criar' || act === 'editar')
      })
      
      if (existingIndex >= 0) {
        selectedPermissions.value.splice(existingIndex, 1)
      }
      
      const availableIndex = availablePermissions.value.findIndex(p => {
        const [mod, act] = p.nome.split(':')
        return mod === module && (act === 'criar' || act === 'editar')
      })
      
      if (availableIndex >= 0) {
        availablePermissions.value.splice(availableIndex, 1)
      }
    }
    
    const index = availablePermissions.value.findIndex(p => p.idPermissao === perm.idPermissao)
    if (index >= 0) {
      availablePermissions.value.splice(index, 1)
    }
    
    selectedPermissions.value.push(perm)
    selectedIds.add(perm.idPermissao)
  })
  
  selectedAvailable.value = []
}

const moveToAvailable = () => {
  selectedSelected.value.forEach(perm => {
    const [module, action] = perm.nome.split(':')
    
    if (action === 'criar' || action === 'editar') {
      const otherAction = action === 'criar' ? 'editar' : 'criar'
      const otherPerm = selectedPermissions.value.find(p => {
        const [mod, act] = p.nome.split(':')
        return mod === module && act === otherAction
      })
      
      if (otherPerm) {
        const otherIndex = selectedPermissions.value.findIndex(p => p.idPermissao === otherPerm.idPermissao)
        if (otherIndex >= 0) {
          selectedPermissions.value.splice(otherIndex, 1)
          if (!availablePermissions.value.some(p => p.idPermissao === otherPerm.idPermissao)) {
            availablePermissions.value.push(otherPerm)
          }
        }
      }
    }
    
    const index = selectedPermissions.value.findIndex(p => p.idPermissao === perm.idPermissao)
    if (index >= 0) {
      selectedPermissions.value.splice(index, 1)
      if (!availablePermissions.value.some(p => p.idPermissao === perm.idPermissao)) {
        availablePermissions.value.push(perm)
      }
    }
  })
  selectedSelected.value = []
}

const handleSave = async () => {
  loading.value = true
  try {
    const modulesWithEdit = new Set()
    selectedPermissions.value.forEach(p => {
      const [module, action] = p.nome.split(':')
      if (action === 'criar' || action === 'editar') {
        modulesWithEdit.add(module)
      }
    })
    
    for (const module of modulesWithEdit) {
      const hasVisualizar = selectedPermissions.value.some(p => {
        const [mod, action] = p.nome.split(':')
        return mod === module && action === 'visualizar'
      })
      if (!hasVisualizar) {
        alert(`Erro: Para editar/criar ${moduleNames[module] || module}, é necessário ter permissão de visualizar primeiro.`)
        loading.value = false
        return
      }
    }
    
    const currentPerms = (props.user.rawUser?.permissoesExtras || [])
    const currentPermIds = new Set(currentPerms.map(p => p.idPermissao))
    
    const finalPermIds = new Set()
    const modulesProcessed = new Set()
    
    selectedPermissions.value.forEach(p => {
      const [module, action] = p.nome.split(':')
      
      if (action === 'criar' || action === 'editar') {
        if (!modulesProcessed.has(module)) {
          modulesProcessed.add(module)
          finalPermIds.add(p.idPermissao)
          
          const otherAction = action === 'criar' ? 'editar' : 'criar'
          const otherPerm = allPermissions.value.find(perm => {
            const [mod, act] = perm.nome.split(':')
            return mod === module && act === otherAction
          })
          
          if (otherPerm) {
            finalPermIds.add(otherPerm.idPermissao)
          }
        }
      } else {
        finalPermIds.add(p.idPermissao)
      }
    })
    
    const toAdd = Array.from(finalPermIds).filter(id => !currentPermIds.has(id))
    const toRemove = Array.from(currentPermIds).filter(id => !finalPermIds.has(id))
    
    if (toAdd.length > 0) {
      await addPermissions(props.user.id, { permissionIds: toAdd })
    }
    
    if (toRemove.length > 0) {
      await removePermissions(props.user.id, { permissionIds: toRemove })
    }
    
    emit('saved')
    emit('close')
  } catch (error) {
    alert('Erro ao salvar permissões. Tente novamente.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPermissions()
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
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #E9ECEF;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #858585;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #F6F6F6;
}

.modal-intro {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #E9ECEF;
}

.modal-intro p {
  margin: 0;
  color: #6C757D;
  font-size: 0.9rem;
}

.permissions-container {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  flex: 1;
  overflow: hidden;
  min-height: 400px;
}

.permissions-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  overflow: hidden;
}

.column-header {
  padding: 1rem;
  background-color: #F8F9FA;
  border-bottom: 1px solid #E9ECEF;
}

.column-header h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 32px;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: #FFFFFF;
}

.search-input:focus {
  outline: none;
  border-color: #3C6E6C;
}

.permissions-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.permission-group {
  margin-bottom: 1.5rem;
}

.permission-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.permission-item {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  background-color: #FFFFFF;
  cursor: pointer;
  transition: all 0.2s;
}

.permission-item:hover {
  background-color: #F8F9FA;
  border-color: #3C6E6C;
}

.permission-item.selected {
  background-color: #DFF6F6;
  border-color: #3C6E6C;
  border-width: 2px;
}

.permission-item.highlighted {
  background-color: #FFE4E4;
  border-color: #AE3B3B;
  border-width: 2px;
}

.permission-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #F5F5F5;
  border-color: #E0E0E0;
}

.permission-item.disabled:hover {
  background-color: #F5F5F5;
  border-color: #E0E0E0;
}

.permission-name {
  font-size: 0.875rem;
  color: #333;
  display: block;
}

.disabled-text {
  color: #9E9E9E;
  font-style: italic;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6C757D;
  font-style: italic;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #3C6E6C;
  background-color: #3C6E6C;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background-color: #4AA19D;
  border-color: #4AA19D;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #E9ECEF;
}

.cancel-button {
  background-color: #4AA19D;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #3C6E6C;
}

.save-button {
  background-color: #3C6E6C;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: #4AA19D;
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

