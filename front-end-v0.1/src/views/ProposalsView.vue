<template>
  <div class="proposals-view">
    <ProposalsHeader @open-create-modal="isCreateModalOpen = true" @filters-changed="handleFiltersChange" />
    <ProposalsTable :proposals="filteredProposals" :loading="loading" />
    <ProposalsCreateModal v-if="isCreateModalOpen" @close="isCreateModalOpen = false" @created="loadProposals" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProposalsHeader from '../components/proposals/ProposalsHeader.vue';
import ProposalsTable from '../components/proposals/ProposalsTable.vue';
import ProposalsCreateModal from '../components/proposals/ProposalsCreateModal.vue';
import { getProposals } from '@/api/proposals';
import { StatusProposta } from '@/api/types';

const isCreateModalOpen = ref(false);
const selectedFilters = ref([]);
const allProposals = ref([]);
const loading = ref(false);

const statusMap = {
  'Aprovada': 'Aceito',
  'Em_analise': 'Revisão',
  'Recusada': 'Rascunho'
};

const loadProposals = async () => {
  loading.value = true;
  try {
    const proposals = await getProposals();
    allProposals.value = proposals.map(proposal => ({
      id: proposal.idProposta,
      title: `Proposta #${proposal.idProposta}`,
      company: proposal.empresa?.nomeFantasia || 'N/A',
      status: statusMap[proposal.statusProposta] || proposal.statusProposta,
      value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorProposta),
      validUntil: new Date(proposal.prazoValidade).toLocaleDateString('pt-BR'),
      responsible: proposal.atribuicoes?.[0]?.usuario?.nomeCompleto || 'N/A',
      originalStatus: proposal.statusProposta
    }));
  } catch (error) {
    console.error('Erro ao carregar propostas:', error);
  } finally {
    loading.value = false;
  }
};

const handleFiltersChange = (filters) => {
  selectedFilters.value = filters;
};

const filteredProposals = computed(() => {
  if (selectedFilters.value.length === 0) {
    return allProposals.value;
  } else {
    return allProposals.value.filter(proposal =>
      selectedFilters.value.includes(proposal.status)
    );
  }
});

onMounted(() => {
  loadProposals();
});
</script>

<style scoped>
.proposals-view {
  padding: 20px;
}

@media (max-width: 768px) {
  .proposals-view {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .proposals-view {
    padding: 0.75rem;
  }
}
</style>