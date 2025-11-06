<template>
  <div class="app-container" v-if="showLayout">
    <AsideComponent />
    <div class="main-content-wrapper">
      <NavComponent />
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
  <router-view v-else />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AsideComponent from './components/Aside/AsideComponent.vue';
import NavComponent from './components/Nav/NavBar.vue';

const route = useRoute()
const authStore = useAuthStore()

const showLayout = computed(() => {
  const publicRoutes = ['login']
  return authStore.isAuthenticated && !publicRoutes.includes(route.name)
})
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
  background-color: #F8F9FA;
}

.main-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
}

.page-content {
  padding: 2rem;
  flex-grow: 1;
  overflow-y: auto;
}
</style>