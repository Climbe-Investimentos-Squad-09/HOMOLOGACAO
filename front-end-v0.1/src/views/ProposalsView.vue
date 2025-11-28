<template>
  <div class="proposals-view">
    <ProposalsHeader @open-create-modal="isCreateModalOpen = true" @filters-changed="handleFiltersChange" />
    <ProposalsTable :proposals="filteredProposals" :loading="loading" @refresh="loadProposals" />
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
    console.log('Propostas recebidas:', proposals);
    
    allProposals.value = proposals.map(proposal => {
      console.log('Processando proposta:', proposal);
      console.log('Atribuições:', proposal.atribuicoes);
      
      // Buscar o responsável nas atribuições
      let responsible = 'Não atribuído';
      if (proposal.atribuicoes && Array.isArray(proposal.atribuicoes) && proposal.atribuicoes.length > 0) {
        for (const atribuicao of proposal.atribuicoes) {
          if (atribuicao.usuario) {
            if (atribuicao.usuario.nomeCompleto) {
              responsible = atribuicao.usuario.nomeCompleto;
              break;
            }
          }
        }
      }
      
      let creator = 'Não informado'
      if (proposal.idEmissor) {
        if (typeof proposal.idEmissor === 'object') {
          creator = proposal.idEmissor.nomeCompleto || proposal.idEmissor.name || 'Não informado'
        } else if (typeof proposal.idEmissor === 'number') {
          creator = 'Usuário ID: ' + proposal.idEmissor
        }
      }
      
      return {
        id: proposal.idProposta,
        title: `Proposta #${proposal.idProposta}`,
        company: proposal.empresa?.nomeFantasia || proposal.empresa?.razaoSocial || 'Empresa não informada',
        status: statusMap[proposal.statusProposta] || proposal.statusProposta,
        value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorProposta),
        validUntil: new Date(proposal.prazoValidade).toLocaleDateString('pt-BR'),
        responsible: responsible,
        creator: creator,
        originalStatus: proposal.statusProposta
      };
    });
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