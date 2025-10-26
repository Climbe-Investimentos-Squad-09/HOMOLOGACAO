<template>
  <div class="app-container">
    <AsideComponent />
    <div class="main-content-wrapper">
      <NavComponent />
      <main class="page-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import AsideComponent from './components/Aside/AsideComponent.vue';
import NavComponent from './components/Nav/NavBar.vue';
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