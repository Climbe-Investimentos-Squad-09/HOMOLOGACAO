<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <h1>Calendário</h1>
      <button 
        v-if="canCreateMeeting" 
        class="create-meeting-button" 
        @click="handleCreateMeeting"
      >
        <i class="bi bi-plus-circle"></i>
        <span>Criar reunião</span>
      </button>
    </div>
    <div class="calendar-content">
      <p>Calendário em desenvolvimento...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { canEditOrCreate, hasPermission } from '@/utils/permissions'

const canCreateMeeting = computed(() => {
  // Verificar se tem permissão de agendar, editar ou criar reuniões
  return hasPermission('reunioes:agendar') || hasPermission('reunioes:editar') || hasPermission('reunioes:criar')
})

const handleCreateMeeting = () => {
  // Por enquanto não faz nada, como solicitado
  console.log('Criar reunião - funcionalidade em desenvolvimento')
}
</script>

<style scoped>
.calendar-view {
  padding: 1.5rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.create-meeting-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3C6E6C;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-meeting-button:hover {
  background-color: #4AA19D;
}

.create-meeting-button i {
  font-size: 1rem;
}

.calendar-content {
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #6C757D;
}
</style>
