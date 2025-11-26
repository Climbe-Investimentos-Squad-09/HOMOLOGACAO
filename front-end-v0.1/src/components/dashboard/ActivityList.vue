<template>
  <section class="card">
    <h2 class="card-title">{{ title }}</h2>
    <hr />
    <div v-if="loading" class="loading-state">
      <p>Carregando atividades...</p>
    </div>
    <ul v-else-if="activities.length > 0" class="item-list">
      <li v-for="(activity, index) in activities" :key="index" class="list-item">
        <span class="dot" :class="activity.type"></span>
        <div class="text-container">
          <span class="item-title">{{ activity.title }}</span>
          <span class="item-time">{{ activity.time }}</span>
        </div>
        <span v-if="activity.status" class="status-badge" :class="activity.statusClass">
          {{ activity.status }}
        </span>
      </li>
    </ul>
    <div v-else class="empty-state">
      <p>Nenhuma atividade recente</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { hasPermission, userHasRole } from '@/utils/permissions'

const props = defineProps({ title: String })

const authStore = useAuthStore()
const loading = ref(false)
const activities = ref([])

const hasRole = computed(() => userHasRole())
const permissions = computed(() => authStore.permissions || [])

const loadActivities = () => {
  loading.value = true
  
  const mockActivities = []
  
  if (hasRole.value && permissions.value.includes('contratos:visualizar')) {
    mockActivities.push({
      title: 'Novo contrato criado',
      time: 'Hoje',
      type: 'contract',
      status: 'Ativo',
      statusClass: 'active'
    })
  }
  
  if (hasRole.value && permissions.value.includes('propostas:visualizar')) {
    mockActivities.push({
      title: 'Proposta atualizada',
      time: 'Ontem',
      type: 'proposal',
      status: 'Em análise',
      statusClass: 'review'
    })
  }
  
  if (hasRole.value && permissions.value.includes('documentos_juridicos:visualizar')) {
    mockActivities.push({
      title: 'Documento adicionado',
      time: '2 dias atrás',
      type: 'document',
      status: null,
      statusClass: null
    })
  }
  
  if (hasRole.value && permissions.value.includes('usuarios:visualizar')) {
    mockActivities.push({
      title: 'Novo usuário cadastrado',
      time: '3 dias atrás',
      type: 'user',
      status: 'Pendente',
      statusClass: 'pending'
    })
  }
  
  if (mockActivities.length === 0) {
    mockActivities.push({
      title: 'Bem-vindo ao sistema',
      time: 'Agora',
      type: 'info',
      status: null,
      statusClass: null
    })
  }
  
  activities.value = mockActivities.slice(0, 5)
  loading.value = false
}

onMounted(() => {
  loadActivities()
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
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
}

.list-item:last-child {
  border-bottom: none;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #77B4E6;
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.text-container {
  flex: 1;
}

.item-title {
  display: block;
  font-size: 0.95rem;
  color: #212529;
}

.item-time {
  display: block;
  font-size: 0.8rem;
  color: #6C757D;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.active {
  background-color: #CFF8D2;
  border: #B5EDB9 solid 1px;
  color: #018D0B;
}

.status-badge.review {
  background-color: #FFEBCC;
  border: #FFD699 solid 1px;
  color: #CE8209;
}

.status-badge.pending {
  background-color: #FFF4E6;
  border: #FFE4B5 solid 1px;
  color: #B8860B;
}

.dot.contract {
  background-color: #018D0B;
}

.dot.proposal {
  background-color: #0B7DDB;
}

.dot.document {
  background-color: #CE8209;
}

.dot.user {
  background-color: #7A65F4;
}

.dot.info {
  background-color: #6C757D;
}

.loading-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6C757D;
}
</style>