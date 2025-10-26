<template>
  <div class="proposals-view">
    <ProposalsHeader @open-create-modal="isCreateModalOpen = true" @filters-changed="handleFiltersChange" />
    <ProposalsTable :proposals="filteredProposals" />
    <ProposalsCreateModal v-if="isCreateModalOpen" @close="isCreateModalOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProposalsHeader from '../components/proposals/ProposalsHeader.vue';
import ProposalsTable from '../components/proposals/ProposalsTable.vue';
import ProposalsCreateModal from '../components/proposals/ProposalsCreateModal.vue';

const isCreateModalOpen = ref(false);
const selectedFilters = ref([]);

const allProposals = ref([
  {
    id: 'PRP-001',
    title: 'Software Development Services',
    company: 'TechCorp Inc.',
    status: 'Aceito',
    value: '25.000,00',
    validUntil: '04/02/2024',
    responsible: 'Ana Ribeiro'
  },
  {
    id: 'PRP-002',
    title: 'Web Design Project',
    company: 'DesignStudio Ltd.',
    status: 'Revisão',
    value: '15.000,00',
    validUntil: '04/02/2024',
    responsible: 'João Silva'
  },
  {
    id: 'PRP-003',
    title: 'Mobile App Development',
    company: 'AppCorp Solutions',
    status: 'Rascunho',
    value: '35.000,00',
    validUntil: '04/02/2024',
    responsible: 'Maria Oliveira'
  },
]);

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
</script>

<style scoped>
.proposals-view {
  padding: 20px;
}
</style>