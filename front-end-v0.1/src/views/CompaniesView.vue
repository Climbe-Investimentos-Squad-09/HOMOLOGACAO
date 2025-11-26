<template>
  <div class="companies-container">
    <div class="content-header">
      <button 
        v-if="canCreate" 
        class="add-company-btn" 
        @click="openModal"
      >
        <i class="bi bi-plus"></i>
        <span>Adicionar empresa</span>
      </button>
    </div>

    <div class="search-filters">
      <div class="search-container">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          placeholder="Procure empresas..." 
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
          <label>Nome Fantasia</label>
          <input v-model="filters.nomeFantasia" type="text" placeholder="Nome fantasia" />
        </div>
        <div class="filter-field">
          <label>Razão Social</label>
          <input v-model="filters.razaoSocial" type="text" placeholder="Razão social" />
        </div>
        <div class="filter-field">
          <label>CNPJ</label>
          <input 
            v-model="filters.cnpj" 
            type="text" 
            placeholder="00.000.000/0000-00"
            v-maska="'##.###.###/####-##'"
          />
        </div>
        <div class="filter-field">
          <label>Email</label>
          <input v-model="filters.email" type="email" placeholder="email@empresa.com" />
        </div>
        <div class="filter-field">
          <label>Representante Legal</label>
          <input v-model="filters.representanteLegal" type="text" placeholder="Nome do representante" />
        </div>
      </div>
      <div class="filters-actions">
        <button class="clear-filters-btn" @click="clearFilters">Limpar filtros</button>
        <button class="apply-filters-btn" @click="applyFilters">Aplicar filtros</button>
      </div>
    </div>

    <CompaniesTable :filters="activeFilters" ref="companiesTable" />

    <AddCompanyModal 
      :isOpen="isModalOpen" 
      @close="closeModal"
      @add-company="handleAddCompany"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { vMaska } from 'maska/vue'
import { canEditOrCreate } from '@/utils/permissions'
import CompaniesTable from '@/components/CompaniesTable/CompaniesTable.vue'
import AddCompanyModal from '@/components/AddCompanyModal.vue'

export default {
  name: 'CompaniesView',
  directives: { maska: vMaska },
  components: {
    CompaniesTable,
    AddCompanyModal
  },
  setup() {
    const canCreate = computed(() => canEditOrCreate('empresas'))
    return { canCreate }
  },
  data() {
    return {
      isModalOpen: false,
      showFilters: false,
      searchQuery: '',
      filters: {
        nomeFantasia: '',
        razaoSocial: '',
        cnpj: '',
        email: '',
        representanteLegal: ''
      },
      activeFilters: {},
      searchTimeout: null
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true
    },
    
    closeModal() {
      this.isModalOpen = false
    },
    
    handleAddCompany(companyData) {
      alert('Empresa adicionada com sucesso!')
      this.$refs.companiesTable?.fetchCompanies()
    },

    toggleFilters() {
      this.showFilters = !this.showFilters
    },

    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        const query = this.searchQuery.trim()
        if (query) {
          // Enviar para múltiplos campos - o backend fará OR implicitamente
          // se não encontrar em um campo, tenta nos outros
          this.activeFilters = { nomeFantasia: query }
        } else {
          this.activeFilters = {}
        }
      }, 300)
    },

    applyFilters() {
      const applied = {}
      Object.keys(this.filters).forEach(key => {
        if (this.filters[key]?.trim()) {
          applied[key] = this.filters[key].trim()
        }
      })
      this.activeFilters = applied
      this.searchQuery = ''
    },

    clearFilters() {
      this.filters = {
        nomeFantasia: '',
        razaoSocial: '',
        cnpj: '',
        email: '',
        representanteLegal: ''
      }
      this.activeFilters = {}
      this.searchQuery = ''
    }
  }
}
</script>

<style scoped>
.companies-container {
  padding: 1rem;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.add-company-btn {
  background: #00a86b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.add-company-btn:hover {
  background: #008f5a;
  transform: translateY(-1px);
}

.add-company-btn i {
  font-size: 1rem;
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.filter-field input {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.filter-field input:focus {
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
