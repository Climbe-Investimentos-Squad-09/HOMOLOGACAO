<template>
  <div class="dashboard-view">
    <QuickActions />
    <div class="content-grid">
      <ActivityList title="Atividades recentes" />
      <DeadlineList title="Deadlines próximas" />
    </div>
  </div>
</template>

<script setup>
import QuickActions from '../components/dashboard/QuickActions.vue';
import ActivityList from '../components/dashboard/ActivityList.vue';
import DeadlineList from '../components/dashboard/DeadlineList.vue';
</script>

<style scoped>
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
