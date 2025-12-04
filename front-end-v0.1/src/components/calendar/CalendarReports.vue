<template>
  <div class="calendar-reports">
    <div class="reports-header">
      <div class="search-filter-section">
        <div class="search-input-wrapper">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z"
              fill="#9E9E9E" />
          </svg>
          <input 
            type="text" 
            placeholder="Procure relatórios..." 
            class="search-input" 
            v-model="searchQuery"
            @input="handleSearch"
          />
        </div>

        <div class="filter-select-wrapper">
          <v-select 
            v-model="selectedFilters" 
            clearable 
            chips 
            label="Filtros" 
            :items="filterOptions" 
            multiple
            variant="outlined" 
            density="comfortable" 
            class="filter-select" 
            hide-details
            @update:model-value="handleFiltersChange"
          ></v-select>
        </div>
      </div>
    </div>

    <div class="reports-list">
      <div v-if="loading" class="loading-message">
        Carregando relatórios...
      </div>
      <div v-else-if="filteredReports.length === 0" class="empty-message">
        Nenhum relatório encontrado
      </div>
      <div 
        v-else
        v-for="report in filteredReports" 
        :key="report.idRelatorio"
        class="report-card"
      >
        <div class="report-content">
          <h3 class="report-title">{{ report.titulo }}</h3>
          <div class="report-meta">
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#6C757D"/>
              </svg>
              <span>{{ formatDate(report.dataCriacao) }}</span>
            </div>
            <div class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#6C757D"/>
              </svg>
              <span>{{ report.empresa?.nomeFantasia || '—' }}</span>
            </div>
            <div class="meta-item" v-if="report.responsavel">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM12 13C15.3137 13 18 14.6863 18 18V19H6V18C6 14.6863 8.68629 13 12 13Z" fill="#6C757D"/>
              </svg>
              <span>{{ report.responsavel?.nomeCompleto || '—' }}</span>
            </div>
          </div>
          <p class="report-description" v-if="report.descricao">
            {{ report.descricao }}
          </p>
        </div>
        <div class="report-actions">
          <button class="action-button" @click="viewReport(report)" title="Visualizar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="#495057"/>
            </svg>
          </button>
          <button class="action-button" @click="downloadReport(report)" title="Download">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12V19H5V12H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V12H19ZM13 12.67L15.59 10.09L17 11.5L12 16.5L7 11.5L8.41 10.09L11 12.67V3H13V12.67Z" fill="#495057"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ReportDetailsModal 
      :isOpen="showDetailsModal"
      :report="selectedReport"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import { getReports } from '@/api/reports'
import ReportDetailsModal from './ReportDetailsModal.vue'

const props = defineProps({
  refreshTrigger: {
    type: Number,
    default: 0
  }
})

const alertModal = inject('alertModal', null)
const toast = useToast()
const loading = ref(false)
const searchQuery = ref('')
const selectedFilters = ref([])
const reports = ref([])
const showDetailsModal = ref(false)
const selectedReport = ref(null)

const filterOptions = []

const filteredReports = computed(() => {
  let filtered = reports.value

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(report =>
      report.titulo?.toLowerCase().includes(query) ||
      report.descricao?.toLowerCase().includes(query) ||
      report.empresa?.nomeFantasia?.toLowerCase().includes(query)
    )
  }

  if (selectedFilters.value.length > 0) {
    // Implementar filtros quando necessário
  }

  return filtered
})

const loadReports = async () => {
  loading.value = true
  try {
    reports.value = await getReports()
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error)
    toast.showToast('Erro ao carregar relatórios', 'error')
    reports.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return '—'
  }
}

const handleSearch = () => {
  // Busca já é reativa através do computed
}

const handleFiltersChange = () => {
  // Filtros já são reativos através do computed
}

const viewReport = (report) => {
  selectedReport.value = report
  showDetailsModal.value = true
}

const downloadReport = (report) => {
  if (!report.driveLink) {
    toast.warning('Relatório não possui arquivo anexado')
    return
  }

  let downloadUrl = report.driveLink

  if (downloadUrl.includes('/view')) {
    downloadUrl = downloadUrl.replace('/view', '/view?usp=sharing')
  }

  if (downloadUrl.includes('/file/d/')) {
    const match = downloadUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (match) {
      downloadUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`
    }
  }

  window.open(downloadUrl, '_blank')
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedReport.value = null
}

onMounted(() => {
  loadReports()
})

watch(() => props.refreshTrigger, () => {
  loadReports()
})
</script>

<style scoped>
.calendar-reports {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reports-header {
  background-color: #FFFFFF;
  padding: 13px 20px;
  border-radius: 8px;
  border: 1px solid #DBDBDB;
}

.search-filter-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 40px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #F6F6F6;
}

.search-input:focus {
  outline: none;
  border-color: #3C6E6C;
  background-color: #fff;
}

.filter-select-wrapper {
  min-width: 200px;
  max-width: 250px;
}

.filter-select {
  background-color: #f6f6f6;
}

:deep(.v-field) {
  background-color: #f6f6f6 !important;
  border-radius: 8px !important;
}

:deep(.v-field--focused .v-field__outline) {
  --v-field-border-color: #3C6E6C;
  --v-field-border-width: 2px;
}

:deep(.v-chip) {
  background-color: #3C6E6C !important;
  color: white !important;
}

:deep(.v-chip .v-chip__close) {
  color: white !important;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  transition: box-shadow 0.2s;
}

.report-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.report-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-title {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.report-meta {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6C757D;
}

.meta-item svg {
  flex-shrink: 0;
}

.report-description {
  font-size: 0.875rem;
  color: #495057;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s;
  color: #495057;
}

.action-button:hover {
  background-color: #F8F9FA;
}

.loading-message,
.empty-message {
  text-align: center;
  padding: 3rem 1rem;
  color: #6C757D;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .search-filter-section {
    flex-direction: column;
  }

  .filter-select-wrapper {
    width: 100%;
    max-width: none;
  }

  .report-card {
    flex-direction: column;
  }

  .report-actions {
    justify-content: flex-end;
  }
}
</style>

