<template>
  <div class="documents-view">
    <DocumentsHeader 
      @search-changed="handleSearchChange"
      @filters-changed="handleFiltersChange"
      @open-create-modal="openCreateModal"
    />
    <DocumentsCreateModal v-if="showCreateModal" @close="closeCreateModal" />
    <DocumentsTable :documents="filteredDocuments" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DocumentsHeader from '../components/documents/DocumentsHeader.vue';
import DocumentsTable from '../components/documents/DocumentsTable.vue';
import DocumentsCreateModal from '../components/documents/DocumentsCreateModal.vue';

const showCreateModal = ref(false);

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const searchQuery = ref('');
const selectedFilters = ref([]);

const allDocuments = ref([
  {
    id: 'DOC-001',
    name: 'TechCorp_Balance_Sheet_2023.pdf',
    type: 'Balance Sheet',
    company: 'TechCorp Inc.',
    contract: 'CTR-001',
    status: 'Aceito',
    date: '10/01/2024',
    responsible: 'Ana Ribeiro'
  },
  {
    id: 'DOC-002',
    name: 'TechCorp_Balance_Sheet_2023.pdf',
    type: 'Balance Sheet',
    company: 'TechCorp Inc.',
    contract: 'CTR-001',
    status: 'Rejeitado',
    date: '10/01/2024',
    responsible: 'Ana Ribeiro'
  },
  {
    id: 'DOC-003',
    name: 'TechCorp_Balance_Sheet_2023.pdf',
    type: 'Balance Sheet',
    company: 'TechCorp Inc.',
    contract: 'CTR-001',
    status: 'Revisão',
    date: '10/01/2024',
    responsible: 'Ana Ribeiro'
  }
]);

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
</script>

<style scoped>
.documents-view {
  padding: 1rem;
}
</style>

