<template>
  <div class="audits-container">
    <div class="content-header">
      <h2 class="page-title">Auditoria</h2>
    </div>

    <div class="search-filters">
      <div class="search-container">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          placeholder="Buscar por entidade, endpoint..." 
          class="search-input"
          v-model="searchQuery"
          @input="handleSearch"
        >
      </div>
      <button class="filters-btn" @click="toggleFilters">
        <i class="bi bi-funnel"></i>
        <span>Filtros</span>
        <i :class="['bi', showFilters ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
      </button>
    </div>

    <div v-if="showFilters" class="filters-panel">
      <div class="filters-grid">
        <div class="filter-field">
          <label>Entidade</label>
          <select v-model="filters.entity">
            <option value="">Todas</option>
            <option value="usuarios">Usuários</option>
            <option value="companies">Empresas</option>
            <option value="proposals">Propostas</option>
            <option value="contracts">Contratos</option>
            <option value="roles">Cargos</option>
            <option value="permissions">Permissões</option>
          </select>
        </div>

        <div class="filter-field">
          <label>Ação</label>
          <select v-model="filters.action">
            <option value="">Todas</option>
            <option value="CREATE">Criar</option>
            <option value="UPDATE">Atualizar</option>
            <option value="DELETE">Excluir</option>
            <option value="ASSIGN">Atribuir</option>
            <option value="STATUS_CHANGE">Mudança de Status</option>
          </select>
        </div>

        <div class="filter-field">
          <label>ID da Entidade</label>
          <input v-model="filters.entityId" type="text" placeholder="Ex: 123" />
        </div>

        <div class="filter-field">
          <label>ID do Usuário</label>
          <input v-model="filters.userId" type="number" placeholder="Ex: 5" />
        </div>

        <div class="filter-field">
          <label>Data Inicial</label>
          <input v-model="filters.from" type="date" />
        </div>

        <div class="filter-field">
          <label>Data Final</label>
          <input v-model="filters.to" type="date" />
        </div>
      </div>

      <div class="filters-actions">
        <button class="clear-filters-btn" @click="clearFilters">Limpar filtros</button>
        <button class="apply-filters-btn" @click="applyFilters">Aplicar filtros</button>
      </div>
    </div>

    <AuditsTable :filters="activeFilters" ref="auditsTable" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { canEditOrCreate } from '@/utils/permissions'
import AuditsTable from '@/components/AuditsTable/AuditsTable.vue'

export default {
  name: 'AuditsView',
  components: {
    AuditsTable
  },
  setup() {
    // Apenas CEO, SysAdmin e Compliance podem acessar
    const canAccess = computed(() => {
      // Verificar se o usuário tem permissão de auditoria
      return canEditOrCreate('auditoria') // Ajustar conforme suas permissões
    })
    return { canAccess }
  },
  data() {
    return {
      showFilters: false,
      searchQuery: '',
      filters: {
        entity: '',
        action: '',
        entityId: '',
        userId: '',
        from: '',
        to: ''
      },
      activeFilters: {},
      searchTimeout: null
    }
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        const query = this.searchQuery.trim()
        if (query) {
          this.activeFilters = { q: query }
        } else {
          this.activeFilters = {}
        }
      }, 300)
    },

    applyFilters() {
      const applied = {}
      Object.keys(this.filters).forEach(key => {
        const value = this.filters[key]
        if (value !== null && value !== undefined && value !== '') {
          applied[key] = key === 'userId' ? Number(value) : String(value)
        }
      })
      this.activeFilters = applied
      this.searchQuery = ''
    },

    clearFilters() {
      this.filters = {
        entity: '',
        action: '',
        entityId: '',
        userId: '',
        from: '',
        to: ''
      }
      this.activeFilters = {}
      this.searchQuery = ''
    }
  }
}
</script>

<style scoped>
.audits-container {
  padding: 1rem;
}

.content-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #000;
  margin: 0;
}

.search-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-container i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00695c;
  box-shadow: 0 0 0 3px rgba(0, 105, 92, 0.1);
}

.filters-btn {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #495057;
}

.filters-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.filters-btn i:first-child {
  font-size: 1rem;
}

.filters-btn i:last-child {
  font-size: 0.8rem;
}

.filters-panel {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-field label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #495057;
}

.filter-field input,
.filter-field select {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-field input:focus,
.filter-field select:focus {
  outline: none;
  border-color: #00695c;
  box-shadow: 0 0 0 3px rgba(0, 105, 92, 0.1);
}

.filters-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.clear-filters-btn,
.apply-filters-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters-btn {
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #dee2e6;
}

.clear-filters-btn:hover {
  background: #e9ecef;
}

.apply-filters-btn {
  background: #00695c;
  color: white;
}

.apply-filters-btn:hover {
  background: #005246;
}
</style>
