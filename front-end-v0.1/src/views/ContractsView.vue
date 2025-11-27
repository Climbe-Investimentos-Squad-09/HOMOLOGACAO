<template>
  <div class="contracts-view">
    <ContractsHeader 
      @search-changed="handleSearchChange"
      @filters-changed="handleFiltersChange"
      @open-create-modal="openCreateModal"
    />
    <ContractsCreateModal v-if="showCreateModal" @close="closeCreateModal" @created="loadContracts" />
    <ContractsTable :contracts="filteredContracts" :loading="loading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ContractsHeader from '../components/contracts/ContractsHeader.vue';
import ContractsTable from '../components/contracts/ContractsTable.vue';
import ContractsCreateModal from '../components/contracts/ContractsCreateModal.vue';
import { getContracts } from '@/api/contracts';

const route = useRoute();
const router = useRouter();

const showCreateModal = ref(false);
const allContracts = ref([]);
const loading = ref(false);

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

const loadContracts = async () => {
  loading.value = true;
  try {
    const contracts = await getContracts();
    allContracts.value = contracts.map(contract => ({
      id: `CTR-${contract.idContrato}`,
      title: `Contrato #${contract.idContrato}`,
      company: contract.proposta?.empresa?.nomeFantasia || 'N/A',
      status: contract.statusContrato,
      value: contract.proposta ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.proposta.valorProposta) : 'N/A',
      inicialDate: new Date(contract.dataCriacao).toLocaleDateString('pt-BR'),
      finalDate: contract.dataEncerramento ? new Date(contract.dataEncerramento).toLocaleDateString('pt-BR') : 'N/A',
      responsible: contract.compliance?.nomeCompleto || 'N/A'
    }));
  } catch (error) {
    console.error('Erro ao carregar contratos:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.openModal || route.name === 'criar-contrato') {
    showCreateModal.value = true;
  }
  loadContracts();
});

const searchQuery = ref('');
const selectedFilters = ref([]);

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

@media (max-width: 768px) {
  .contracts-view {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .contracts-view {
    padding: 0.5rem;
  }
}
</style>