<template>
  <div class="contracts-view">
    <ContractsHeader 
      @search-changed="handleSearchChange"
      @filters-changed="handleFiltersChange"
      @open-create-modal="openCreateModal"
    />
    <ContractsCreateModal v-if="showCreateModal" @close="closeCreateModal" />
    <ContractsTable :contracts="filteredContracts" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContractsHeader from '../components/contracts/ContractsHeader.vue';
import ContractsTable from '../components/contracts/ContractsTable.vue';
import ContractsCreateModal from '../components/contracts/ContractsCreateModal.vue';

const route = useRoute();
const router = useRouter();

const showCreateModal = ref(false);

const props = defineProps({
  openModal: {
    type: Boolean,
    default: false
  }
});

const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
  if (route.name === 'criar-contrato') {
    router.push('/contratos');
  }
};

watch(() => route.name, (newRouteName) => {
  if (newRouteName === 'criar-contrato') {
    showCreateModal.value = true;
  }
}, { immediate: true });

onMounted(() => {
  if (props.openModal || route.name === 'criar-contrato') {
    showCreateModal.value = true;
  }
});

const searchQuery = ref('');
const selectedFilters = ref([]);

const allContracts = ref([
  {
    id: 'CTR-001',
    title: 'Software Development Services',
    company: 'TechCorp Inc.',
    status: 'Ativo',
    value: '25.000,00',
    inicialDate: '31/12/2023',
    finalDate: '30/12/2024',
    responsible: 'Ana Ribeiro'
  },
  {
    id: 'CTR-002',
    title: 'Web Design Project',
    company: 'DesignStudio Ltd.',
    status: 'Inativo',
    value: '15.000,00',
    inicialDate: '01/01/2024',
    finalDate: '31/06/2024',
    responsible: 'João Silva'
  },
  {
    id: 'CTR-003',
    title: 'Mobile App Development',
    company: 'AppCorp Solutions',
    status: 'Rascunho',
    value: '35.000,00',
    inicialDate: '15/02/2024',
    finalDate: '15/08/2024',
    responsible: 'Maria Oliveira'
  },
  {
    id: 'CTR-004',
    title: 'Database Migration',
    company: 'DataTech Systems',
    status: 'Revisão',
    value: '20.000,00',
    inicialDate: '01/03/2024',
    finalDate: '30/04/2024',
    responsible: 'Pedro Souza'
  },
  {
    id: 'CTR-005',
    title: 'Cloud Infrastructure Setup',
    company: 'CloudFirst Inc.',
    status: 'Ativo',
    value: '40.000,00',
    inicialDate: '10/01/2024',
    finalDate: '10/12/2024',
    responsible: 'Ana Ribeiro'
  },
  {
    id: 'CTR-006',
    title: 'Security Audit Services',
    company: 'SecureNet Corp.',
    status: 'Inativo',
    value: '12.000,00',
    inicialDate: '05/11/2023',
    finalDate: '05/01/2024',
    responsible: 'João Silva'
  }
]);

const handleSearchChange = (query) => {
  searchQuery.value = query;
};

const handleFiltersChange = (filters) => {
  selectedFilters.value = filters;
};

const filteredContracts = computed(() => {
  let filtered = allContracts.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter(contract => 
      contract.id.toLowerCase().includes(query) ||
      contract.title.toLowerCase().includes(query) ||
      contract.company.toLowerCase().includes(query) ||
      contract.value.toLowerCase().includes(query)
    );
  }

  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(contract => 
      selectedFilters.value.includes(contract.status)
    );
  }

  return filtered;
});
</script>

<style scoped>
.contracts-view {
  padding: 1rem;
}
</style>