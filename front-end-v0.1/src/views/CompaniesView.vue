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
        <input type="text" placeholder="Procure empresas..." class="search-input">
      </div>
      <button class="filters-btn">
        <i class="bi bi-funnel"></i>
        <span>Filtros</span>
        <i class="bi bi-chevron-down"></i>
      </button>
    </div>

    <CompaniesTable />

    <AddCompanyModal 
      :isOpen="isModalOpen" 
      @close="closeModal"
      @add-company="handleAddCompany"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { canEditOrCreate } from '@/utils/permissions'
import CompaniesTable from '@/components/CompaniesTable/CompaniesTable.vue'
import AddCompanyModal from '@/components/AddCompanyModal.vue'

export default {
  name: 'CompaniesView',
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
      isModalOpen: false
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
</style>
