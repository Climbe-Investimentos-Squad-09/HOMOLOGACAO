<template>
  <div class="calendar-header-container">
    <div class="view-tabs">
      <button 
        :class="['tab-button', { active: currentView === 'weekly' }]"
        @click="$emit('view-changed', 'weekly')"
      >
        Semanal
      </button>
      <button 
        :class="['tab-button', { active: currentView === 'monthly' }]"
        @click="$emit('view-changed', 'monthly')"
      >
        Mensal
      </button>
      <button 
        :class="['tab-button', { active: currentView === 'reports' }]"
        @click="$emit('view-changed', 'reports')"
      >
        Relatórios
      </button>
    </div>
    
    <div class="header-actions">
      <button 
        v-if="canCreateMeeting && currentView !== 'reports'" 
        class="create-meeting-button" 
        @click="$emit('open-create-meeting')"
      >
        + Criar reunião
      </button>
      <button 
        v-if="canCreateReport && currentView === 'reports'" 
        class="create-report-button" 
        @click="$emit('open-create-report')"
      >
        + Criar relatório
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { canEditOrCreate, hasPermission } from '@/utils/permissions'

const props = defineProps({
  currentView: {
    type: String,
    required: true,
    validator: (value) => ['weekly', 'monthly', 'reports'].includes(value)
  }
})

defineEmits(['view-changed', 'open-create-meeting', 'open-create-report'])

const canCreateMeeting = computed(() => {
  return hasPermission('reunioes:agendar') || hasPermission('reunioes:editar') || hasPermission('reunioes:criar')
})

const canCreateReport = computed(() => {
  // Assumindo que há permissão para criar relatórios
  return hasPermission('reunioes:visualizar')
})
</script>

<style scoped>
.calendar-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.view-tabs {
  display: flex;
  gap: 0.5rem;
  background-color: #FFFFFF;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #DBDBDB;
}

.tab-button {
  padding: 8px 24px;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  background-color: #F8F9FA;
}

.tab-button.active {
  background-color: #E9ECEF;
  color: #212529;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.create-meeting-button,
.create-report-button {
  padding: 9px 24px;
  background-color: #3C6E6C;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.create-meeting-button:hover,
.create-report-button:hover {
  background-color: #4AA19D;
}

@media (max-width: 768px) {
  .calendar-header-container {
    flex-direction: column;
    align-items: stretch;
  }

  .view-tabs {
    width: 100%;
    justify-content: space-between;
  }

  .tab-button {
    flex: 1;
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

