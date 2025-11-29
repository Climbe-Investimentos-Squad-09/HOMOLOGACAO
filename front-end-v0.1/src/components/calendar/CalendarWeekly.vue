<template>
  <div class="calendar-weekly">
    <div class="week-selector">
      <label>Semana da data:</label>
      <div class="date-input-wrapper">
        <input 
          type="date" 
          v-model="selectedDate"
          @change="handleDateChange"
          class="date-input"
        />
        <svg class="calendar-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#6C757D"/>
        </svg>
      </div>
    </div>

    <div class="week-grid">
      <div 
        v-for="day in weekDays" 
        :key="day.date"
        :class="['day-card', { 'today': day.isToday, 'selected': day.isSelected }]"
      >
        <div class="day-header">
          <span class="day-name">{{ day.dayName }}</span>
          <span class="day-number">{{ day.dayNumber }}</span>
        </div>
        <div class="day-meetings">
          <div 
            v-for="meeting in getMeetingsForDay(day.date)" 
            :key="meeting.idReuniao"
            class="meeting-item"
          >
            <div class="meeting-time">{{ formatTime(meeting.dataHoraInicio) }}</div>
            <div class="meeting-title">{{ meeting.titulo }}</div>
            <div class="meeting-company">{{ meeting.empresa?.nomeFantasia || 'Empresa' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="summary-bar">
      <div class="summary-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20ZM7 11H9V13H7V11ZM11 11H13V13H11V11ZM15 11H17V13H15V11Z" fill="#495057"/>
        </svg>
        <span>Reuniões: {{ totalMeetings }}</span>
      </div>
      <div class="summary-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#FF9800"/>
        </svg>
        <span>Eventos urgentes: {{ urgentEvents }}</span>
      </div>
      <div class="summary-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#495057"/>
        </svg>
        <span>Horas totais: {{ totalHours }} hora{{ totalHours !== 1 ? 's' : '' }} em reuniões</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getUserMeetings } from '@/api/meetings'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  refreshTrigger: {
    type: Number,
    default: 0
  }
})

const meetings = ref([])
const loading = ref(false)
const selectedDate = ref(new Date().toISOString().split('T')[0])

const weekDays = computed(() => {
  const date = new Date(selectedDate.value)
  const dayOfWeek = date.getDay()
  const startDate = new Date(date)
  startDate.setDate(date.getDate() - dayOfWeek)
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    currentDate.setHours(0, 0, 0, 0)
    
    const isToday = currentDate.getTime() === today.getTime()
    const isSelected = currentDate.toISOString().split('T')[0] === selectedDate.value
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      dayName: dayNames[i],
      dayNumber: currentDate.getDate(),
      isToday,
      isSelected
    })
  }
  
  return days
})

const totalMeetings = computed(() => {
  return meetings.value.length
})

const urgentEvents = computed(() => {
  // Por enquanto retornar 0, pode ser implementado com lógica de urgência
  return 0
})

const totalHours = computed(() => {
  let total = 0
  meetings.value.forEach(meeting => {
    const start = new Date(meeting.dataHoraInicio)
    const end = new Date(meeting.dataHoraFim)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    total += diffHours
  })
  return Math.round(total)
})

const getMeetingsForDay = (date) => {
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.dataHoraInicio).toISOString().split('T')[0]
    return meetingDate === date
  }).sort((a, b) => {
    return new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime()
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const loadMeetings = async () => {
  loading.value = true
  try {
    const auth = useAuthStore()
    const userId = auth.user?.idUsuario
    if (!userId) {
      meetings.value = []
    } else {
      const loadedMeetings = await getUserMeetings(userId)
      meetings.value = loadedMeetings
    }
  } catch (error) {
    console.error('Erro ao carregar reuniões:', error)
    meetings.value = []
  } finally {
    loading.value = false
  }
}

const handleDateChange = () => {
  loadMeetings()
}

watch(() => props.refreshTrigger, () => {
  loadMeetings()
})

onMounted(() => {
  loadMeetings()
})
</script>

<style scoped>
.calendar-weekly {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.week-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.week-selector label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #495057;
}

.date-input-wrapper {
  position: relative;
  display: inline-block;
}

.date-input {
  padding: 8px 12px 8px 40px;
  border: 1px solid #DBDBDB;
  border-radius: 6px;
  background-color: #FFFFFF;
  font-size: 0.875rem;
  color: #495057;
  cursor: pointer;
  min-width: 150px;
}

.date-input:focus {
  outline: none;
  border-color: #3C6E6C;
}

.calendar-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}

.day-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 1rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.day-card.today {
  border-color: #4AA19D;
  border-width: 2px;
}

.day-card.selected {
  background-color: #F0FFFF;
}

.day-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #E9ECEF;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6C757D;
  text-transform: uppercase;
}

.day-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.day-meetings {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meeting-item {
  background-color: #DFF6F6;
  border-radius: 6px;
  padding: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.meeting-item:hover {
  background-color: #CEEEEE;
}

.meeting-time {
  font-weight: 600;
  color: #3C6E6C;
  margin-bottom: 0.25rem;
}

.meeting-title {
  font-weight: 500;
  color: #212529;
  margin-bottom: 0.125rem;
}

.meeting-company {
  font-size: 0.7rem;
  color: #6C757D;
}

.summary-bar {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background-color: #F8F9FA;
  border-radius: 8px;
  border: 1px solid #E9ECEF;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
}

.summary-item svg {
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .week-grid {
    gap: 0.75rem;
  }

  .day-card {
    min-height: 180px;
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .week-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .day-card {
    min-height: auto;
  }

  .summary-bar {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>

