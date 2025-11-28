<template>
  <div class="calendar-view">
    <CalendarHeader 
      :current-view="currentView"
      @view-changed="handleViewChange"
      @open-create-meeting="isCreateMeetingModalOpen = true"
      @open-create-report="isCreateReportModalOpen = true"
    />
    
    <div class="calendar-content">
      <CalendarWeekly 
        v-if="currentView === 'weekly'"
        :refresh-trigger="refreshTrigger"
      />
      <CalendarMonthly 
        v-else-if="currentView === 'monthly'"
        :refresh-trigger="refreshTrigger"
      />
      <CalendarReports 
        v-else-if="currentView === 'reports'"
        :refresh-trigger="refreshTrigger"
      />
    </div>

    <CalendarCreateMeetingModal 
      v-if="isCreateMeetingModalOpen"
      @close="isCreateMeetingModalOpen = false"
      @created="handleMeetingCreated"
    />

    <CalendarCreateReportModal 
      v-if="isCreateReportModalOpen"
      @close="isCreateReportModalOpen = false"
      @created="handleReportCreated"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CalendarHeader from '../components/calendar/CalendarHeader.vue'
import CalendarWeekly from '../components/calendar/CalendarWeekly.vue'
import CalendarMonthly from '../components/calendar/CalendarMonthly.vue'
import CalendarReports from '../components/calendar/CalendarReports.vue'
import CalendarCreateMeetingModal from '../components/calendar/CalendarCreateMeetingModal.vue'
import CalendarCreateReportModal from '../components/calendar/CalendarCreateReportModal.vue'

const currentView = ref('weekly')
const isCreateMeetingModalOpen = ref(false)
const isCreateReportModalOpen = ref(false)
const refreshTrigger = ref(0)

const handleViewChange = (view) => {
  currentView.value = view
}

const handleMeetingCreated = () => {
  refreshTrigger.value++
}

const handleReportCreated = () => {
  refreshTrigger.value++
}
</script>

<style scoped>
.calendar-view {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.calendar-content {
  flex: 1;
}

@media (max-width: 768px) {
  .calendar-view {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .calendar-view {
    padding: 0.75rem;
  }
}
</style>
