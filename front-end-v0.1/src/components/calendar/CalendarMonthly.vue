<template>
  <div class="calendar-monthly">
    <div class="month-navigation">
      <button class="nav-button" @click="previousMonth">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#495057"/>
        </svg>
      </button>
      <h3 class="month-year">{{ currentMonthYear }}</h3>
      <button class="nav-button" @click="nextMonth">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="#495057"/>
        </svg>
      </button>
    </div>

    <div class="calendar-container">
      <div class="calendar-grid">
        <div class="calendar-header">
          <div class="day-header-cell" v-for="dayName in dayNames" :key="dayName">
            {{ dayName }}
          </div>
        </div>
        <div class="calendar-body">
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            :class="['calendar-day', { 
              'other-month': !day.isCurrentMonth, 
              'today': day.isToday,
              'has-event': day.hasEvent,
              'selected': day.isSelected
            }]"
            @click="selectDay(day)"
          >
            <div class="day-number">{{ day.dayNumber }}</div>
            <div v-if="day.hasEvent" class="day-meetings">
              <div 
                v-for="meeting in getMeetingsForDate(day.date)" 
                :key="meeting.idReuniao"
                class="day-meeting-item"
              >
                {{ meeting.titulo }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="upcoming-events">
        <div class="upcoming-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V9H19V20Z" fill="#495057"/>
          </svg>
          <h3>Próximos eventos</h3>
        </div>
        <div v-if="upcomingMeetings.length > 0" class="events-list">
          <div 
            v-for="meeting in upcomingMeetings" 
            :key="meeting.idReuniao"
            class="event-item"
          >
            <div class="event-card">
              <div class="event-title">{{ meeting.titulo }}</div>
              <div class="event-info">
                <div class="event-time-range">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#3C6E6C"/>
                  </svg>
                  <span>{{ formatDateTime(meeting.dataHoraInicio) }} - {{ formatDateTime(meeting.dataHoraFim) }}</span>
                </div>
                <div class="event-company">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z" fill="#3C6E6C"/>
                  </svg>
                  <span>{{ meeting.empresa?.nomeFantasia || 'Sem empresa' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-events">
          <p>Nenhum evento próximo</p>
        </div>
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

const currentDate = ref(new Date())
const selectedDay = ref(null)
const meetings = ref([])
const loading = ref(false)

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  }).replace(/^\w/, c => c.toUpperCase())
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  // Primeiro e último dia do mês atual
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Dias do mês anterior
  if (startDayOfWeek > 0) {
    const prevMonthLastDay = new Date(year, month, 0)
    const prevMonthDaysCount = prevMonthLastDay.getDate()
    const prevMonth = prevMonthLastDay.getMonth()
    const prevYear = prevMonthLastDay.getFullYear()
    
    // Adicionar os últimos dias do mês anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDaysCount - i
      const date = new Date(prevYear, prevMonth, day)
      const dateString = date.toISOString().split('T')[0]
      days.push({
        date: dateString,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: hasMeetingOnDate(dateString),
        isSelected: false
      })
    }
  }
  
  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateString = date.toISOString().split('T')[0]
    const checkDate = new Date(year, month, day)
    checkDate.setHours(0, 0, 0, 0)
    const isToday = checkDate.getTime() === today.getTime()
    
    days.push({
      date: dateString,
      dayNumber: day,
      isCurrentMonth: true,
      isToday,
      hasEvent: hasMeetingOnDate(dateString),
      isSelected: dateString === selectedDay.value
    })
  }
  
  // Dias do próximo mês para completar a grade (sempre 6 semanas = 42 dias)
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    const dateString = date.toISOString().split('T')[0]
    days.push({
      date: dateString,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: false,
      hasEvent: hasMeetingOnDate(dateString),
      isSelected: false
    })
  }
  
  return days
})

const upcomingMeetings = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return meetings.value
    .filter(meeting => {
      const meetingDate = new Date(meeting.dataHoraInicio)
      meetingDate.setHours(0, 0, 0, 0)
      return meetingDate >= today
    })
    .sort((a, b) => {
      return new Date(a.dataHoraInicio).getTime() - new Date(b.dataHoraInicio).getTime()
    })
    .slice(0, 5) // Apenas os 5 próximos
})

const hasMeetingOnDate = (date) => {
  return meetings.value.some(meeting => {
    const meetingDate = new Date(meeting.dataHoraInicio).toISOString().split('T')[0]
    return meetingDate === date
  })
}

const getMeetingsForDate = (date) => {
  return meetings.value.filter(meeting => {
    const meetingDate = new Date(meeting.dataHoraInicio).toISOString().split('T')[0]
    return meetingDate === date
  })
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const previousMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  loadMeetings()
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  loadMeetings()
}

const selectDay = (day) => {
  if (day.isCurrentMonth) {
    selectedDay.value = day.date
  }
}

const loadMeetings = async () => {
  loading.value = true
  try {
    const auth = useAuthStore()
    const userId = auth.user?.id
    
    if (!userId) {
      console.warn('Nenhum userId encontrado')
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

watch(() => props.refreshTrigger, () => {
  loadMeetings()
})

onMounted(() => {
  loadMeetings()
})
</script>

<style scoped>
.calendar-monthly {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.month-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-button:hover {
  background-color: #F8F9FA;
}

.month-year {
  font-size: 1.125rem;
  font-weight: 600;
  color: #212529;
  min-width: 180px;
  text-align: center;
}

.calendar-container {
  display: flex;
  gap: 2rem;
}

.calendar-grid {
  flex: 1;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 1rem;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.day-header-cell {
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #495057;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-day {
  aspect-ratio: 1;
  padding: 0.5rem;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  transition: background-color 0.2s;
  background-color: #FFFFFF;
  overflow: hidden;
}

.calendar-day:hover {
  background-color: #F8F9FA;
}

.calendar-day.other-month {
  color: #CED4DA;
  background-color: #F8F9FA;
}

.calendar-day.today {
  background-color: #DFF6F6;
  border-color: #4AA19D;
  font-weight: 600;
}

.calendar-day.selected {
  background-color: #CEEEEE;
  border-color: #3C6E6C;
}

.day-number {
  font-size: 0.875rem;
  color: inherit;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.day-meetings {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  overflow-y: auto;
  max-height: calc(100% - 1.5rem);
}

.day-meeting-item {
  font-size: 0.625rem;
  padding: 0.125rem 0.25rem;
  background-color: #3C6E6C;
  color: white;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.upcoming-events {
  width: 320px;
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  padding: 1rem;
  max-height: 600px;
  overflow-y: auto;
}

.upcoming-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #E9ECEF;
}

.upcoming-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item {
  margin-bottom: 0.75rem;
}

.event-card {
  background-color: #FFFFFF;
  border: 1px solid #E9ECEF;
  border-radius: 6px;
  padding: 0.75rem;
}

.event-title {
  font-size: 0.875rem;
  color: #212529;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.event-time-range,
.event-company {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #495057;
}

.event-time-range svg,
.event-company svg {
  flex-shrink: 0;
}

.no-events {
  text-align: center;
  padding: 2rem 1rem;
  color: #6C757D;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .calendar-container {
    flex-direction: column;
  }

  .upcoming-events {
    width: 100%;
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .calendar-body {
    gap: 0.25rem;
  }

  .calendar-day {
    padding: 0.25rem;
  }

  .day-number {
    font-size: 0.75rem;
  }
}
</style>

