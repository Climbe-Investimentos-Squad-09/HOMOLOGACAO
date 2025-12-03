<template>
  <section class="card">
    <h2 class="card-title">{{ title }}</h2>
    <hr>
    <div v-if="loading" class="loading-state">
      <p>Carregando deadlines...</p>
    </div>
    <ul v-else-if="deadlines.length > 0" class="item-list">
      <li v-for="(deadline, index) in deadlines" :key="index" class="list-item">
        <div>
          <p>{{ deadline.title }}</p>
          <small>Data final: {{ deadline.date }}</small>
        </div>
        <span class="status-badge" :class="deadline.priorityClass">
          {{ deadline.priority }}
        </span>
      </li>
    </ul>
    <div v-else class="empty-state">
      <p>Nenhum deadline próximo</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getContracts } from '@/api/contracts'
import { getProposals } from '@/api/proposals'
//import { getMeetings } from '@/api/meetings'

const props = defineProps({ title: String })

const authStore = useAuthStore()
const loading = ref(false)
const deadlines = ref([])

const loadDeadlines = async () => {
  loading.value = true
  const allDeadlines = []
  const userId = authStore.user?.id || authStore.user?.idUsuario
  
  try {
    // 1. Contratos próximos do vencimento (onde usuário é responsável)
    if (userId) {
      const contractsRes = await getContracts()
      const contracts = Array.isArray(contractsRes) ? contractsRes : (contractsRes.data || [])
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const next30Days = new Date(today)
      next30Days.setDate(today.getDate() + 30)
      
      contracts.forEach(contract => {
        // Verificar se usuário é responsável
        const isResponsible = contract.atribuicoes?.some(a => a.idUsuario === userId) || 
                            contract.idCompliance === userId
        
        if (isResponsible && contract.dataFim) {
          const dataFim = new Date(contract.dataFim)
          dataFim.setHours(0, 0, 0, 0)
          
          if (dataFim >= today && dataFim <= next30Days) {
            const daysRemaining = Math.ceil((dataFim - today) / (1000 * 60 * 60 * 24))
            allDeadlines.push({
              title: `Contrato #${contract.idContrato} - ${contract.proposta?.empresa?.nomeFantasia || 'Empresa'}`,
              date: dataFim.toLocaleDateString('pt-BR'),
              daysRemaining,
              priority: daysRemaining <= 7 ? 'Alta' : daysRemaining <= 15 ? 'Média' : 'Baixa',
              priorityClass: daysRemaining <= 7 ? 'high-priority' : daysRemaining <= 15 ? 'medium-priority' : 'low-priority',
              type: 'contrato'
            })
          }
        }
      })
    }
    
    // 2. Propostas próximas do vencimento
    const proposalsRes = await getProposals()
    const proposals = Array.isArray(proposalsRes) ? proposalsRes : (proposalsRes.data || [])
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const next30Days = new Date(today)
    next30Days.setDate(today.getDate() + 30)
    
    proposals.forEach(proposal => {
      if (proposal.prazoValidade) {
        const prazoValidade = new Date(proposal.prazoValidade)
        prazoValidade.setHours(0, 0, 0, 0)
        
        const statusExcluidos = ['Aprovada', 'Rejeitada', 'Cancelada']
        const isStatusValido = !statusExcluidos.includes(proposal.statusProposta)
        
        if (isStatusValido && prazoValidade >= today && prazoValidade <= next30Days) {
          const daysRemaining = Math.ceil((prazoValidade - today) / (1000 * 60 * 60 * 24))
          
          allDeadlines.push({
            title: `Proposta #${proposal.idProposta} - ${proposal.empresa?.nomeFantasia || 'Empresa'}`,
            date: prazoValidade.toLocaleDateString('pt-BR'),
            daysRemaining,
            priority: daysRemaining <= 3 ? 'Alta' : daysRemaining <= 7 ? 'Média' : 'Baixa',
            priorityClass: daysRemaining <= 3 ? 'high-priority' : daysRemaining <= 7 ? 'medium-priority' : 'low-priority',
            type: 'proposta'
          })
        }
      }
    })
    
    // 3. Reuniões próximas
    if (userId) {
      const meetingsRes = await getMeetings()
      const meetings = Array.isArray(meetingsRes) ? meetingsRes : (meetingsRes.data || [])
      
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const next7Days = new Date(today)
      next7Days.setDate(today.getDate() + 7)
      
      meetings.forEach(meeting => {
        if (meeting.dataHoraInicio) {
          const meetingDate = new Date(meeting.dataHoraInicio)
          meetingDate.setHours(0, 0, 0, 0)
          
          if (meetingDate >= today && meetingDate <= next7Days) {
            const daysRemaining = Math.ceil((meetingDate - today) / (1000 * 60 * 60 * 24))
            const meetingTime = new Date(meeting.dataHoraInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            
            allDeadlines.push({
              title: `${meeting.titulo || 'Reunião'} - ${meetingTime}`,
              date: meetingDate.toLocaleDateString('pt-BR'),
              daysRemaining,
              priority: daysRemaining === 0 ? 'Alta' : daysRemaining <= 2 ? 'Média' : 'Baixa',
              priorityClass: daysRemaining === 0 ? 'high-priority' : daysRemaining <= 2 ? 'medium-priority' : 'low-priority',
              type: 'reuniao'
            })
          }
        }
      })
    }

    // Ordenar por dias restantes (mais urgente primeiro)
    allDeadlines.sort((a, b) => a.daysRemaining - b.daysRemaining)
    
    deadlines.value = allDeadlines.slice(0, 8) // Mostrar até 8 deadlines
  } catch (error) {
    //console.error('Erro ao carregar deadlines:', error)

    if (error.response) {
      // Resposta recebida do servidor, mas retornou erro (4xx/5xx)
      console.error("Status:", error.response.status);
      console.error("StatusText:", error.response.statusText);
      console.error("Dados do servidor:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      // Nenhuma resposta do servidor
      console.error("Nenhuma resposta recebida. Request:", error.request);
    } else {
      // Erro antes de enviar a requisição
      console.error("Erro ao configurar a requisição:", error.message);
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDeadlines()
})
</script>

<style scoped>
.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #E9ECEF;
}

.card hr {
  border: 1px solid #EBEBEB;
  margin-bottom: 7px;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.item-list::-webkit-scrollbar {
  width: 6px;
}

.item-list::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 3px;
}

.item-list:hover::-webkit-scrollbar-thumb {
  background-color: #ccc;
}

.item-list::-webkit-scrollbar-track {
  background: transparent;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #F8F9FA;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.high-priority {
  background-color: #FFCFCF;
  border: #FFB9B9 solid 1px;
  color: #AE3B3B;
}

.status-badge.medium-priority {
  background-color: #FFEBCC;
  border: #FFD699 solid 1px;
  color: #CE8209;
}

.status-badge.low-priority {
  background-color: #CFF8D2;
  border: #B5EDB9 solid 1px;
  color: #018D0B;
}

.loading-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6C757D;
}
</style>