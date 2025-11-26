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
  <ToastNotification />
  <ConfirmModal 
    :isOpen="confirmModal.isOpen.value"
    :title="confirmModal.config.value.title"
    :message="confirmModal.config.value.message"
    :confirmText="confirmModal.config.value.confirmText"
    :cancelText="confirmModal.config.value.cancelText"
    :type="confirmModal.config.value.type"
    :showClose="confirmModal.config.value.showClose"
    :showCancel="confirmModal.config.value.showCancel"
    @confirm="confirmModal.handleConfirm"
    @cancel="confirmModal.handleCancel"
    @close="confirmModal.closeModal"
  />
  <AlertModal
    :isOpen="alertModal.isOpen.value"
    :title="alertModal.config.value.title"
    :message="alertModal.config.value.message"
    :type="alertModal.config.value.type"
    @close="alertModal.closeAlert"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useConfirmModal } from './composables/useConfirmModal'
import { useAlertModal } from './composables/useAlertModal'
import AsideComponent from './components/Aside/AsideComponent.vue'
import NavComponent from './components/Nav/NavBar.vue'
import ToastNotification from './components/ToastNotification.vue'
import ConfirmModal from './components/ConfirmModal.vue'
import AlertModal from './components/AlertModal.vue'

const route = useRoute()
const authStore = useAuthStore()
const confirmModal = useConfirmModal()
const alertModal = useAlertModal()

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

@media (max-width: 1024px) {
  .page-content {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .main-content-wrapper {
    width: 100%;
  }

  .page-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .page-content {
    padding: 0.75rem;
  }
}
</style>