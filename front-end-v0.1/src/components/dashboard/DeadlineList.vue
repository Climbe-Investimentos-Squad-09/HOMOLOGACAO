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
import { hasPermission, userHasRole } from '@/utils/permissions'

const props = defineProps({ title: String })

const authStore = useAuthStore()
const loading = ref(false)
const deadlines = ref([])

const hasRole = computed(() => userHasRole())
const permissions = computed(() => authStore.permissions || [])

const loadDeadlines = () => {
  loading.value = true
  
  const mockDeadlines = []
  
  if (hasRole.value && permissions.value.includes('contratos:visualizar')) {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    
    mockDeadlines.push({
      title: 'Renovação de contrato - TechCorp',
      date: nextWeek.toLocaleDateString('pt-BR'),
      priority: 'Alta',
      priorityClass: 'high-priority'
    })
  }
  
  if (hasRole.value && permissions.value.includes('propostas:visualizar')) {
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(today.getMonth() + 1)
    
    mockDeadlines.push({
      title: 'Validade de proposta - DesignStudio',
      date: nextMonth.toLocaleDateString('pt-BR'),
      priority: 'Média',
      priorityClass: 'medium-priority'
    })
  }
  
  if (hasRole.value && permissions.value.includes('reunioes:visualizar')) {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    mockDeadlines.push({
      title: 'Reunião de alinhamento',
      date: tomorrow.toLocaleDateString('pt-BR'),
      priority: 'Alta',
      priorityClass: 'high-priority'
    })
  }
  
  deadlines.value = mockDeadlines.slice(0, 5)
  loading.value = false
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