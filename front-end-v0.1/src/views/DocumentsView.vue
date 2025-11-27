<template>
  <div class="documents-view">
    <DocumentsHeader 
      @search-changed="handleSearchChange"
      @filters-changed="handleFiltersChange"
      @open-create-modal="openCreateModal"
    />
    <DocumentsCreateModal v-if="showCreateModal" @close="closeCreateModal" @created="loadDocuments" />
    <DocumentsTable :documents="filteredDocuments" :loading="loading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DocumentsHeader from '../components/documents/DocumentsHeader.vue';
import DocumentsTable from '../components/documents/DocumentsTable.vue';
import DocumentsCreateModal from '../components/documents/DocumentsCreateModal.vue';
import { getDocuments } from '@/api/documents';

const showCreateModal = ref(false);
const searchQuery = ref('');
const selectedFilters = ref([]);
const allDocuments = ref([]);
const loading = ref(false);

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const loadDocuments = async () => {
  loading.value = true;
  try {
    const documents = await getDocuments();
    allDocuments.value = documents.map(doc => ({
      id: doc.idDocumento || `DOC-${doc.idEmpresa || 0}`,
      name: doc.name,
      type: doc.tipo_documento,
      company: doc.empresa?.nomeFantasia || 'N/A',
      contract: doc.idContrato ? `CTR-${doc.idContrato}` : 'N/A',
      status: doc.status || 'Revisão',
      date: doc.dataCriacao ? new Date(doc.dataCriacao).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
      responsible: doc.responsavel?.nomeCompleto || 'N/A'
    }));
  } catch (error) {
    console.error('Erro ao carregar documentos:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearchChange = (query) => {
  searchQuery.value = query;
};

const handleFiltersChange = (filters) => {
  selectedFilters.value = filters;
};

const filteredDocuments = computed(() => {
  let filtered = allDocuments.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(doc => 
      doc.name.toLowerCase().includes(query) ||
      doc.type.toLowerCase().includes(query) ||
      doc.company.toLowerCase().includes(query) ||
      doc.contract.toLowerCase().includes(query)
    );
  }

  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(doc => 
      selectedFilters.value.includes(doc.status)
    );
  }

  return filtered;
});

onMounted(() => {
  loadDocuments();
});
</script>

<style scoped>
.documents-view {
  padding: 1rem;
}
</style>

