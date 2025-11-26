<template>
  <section class="welcome-card">
    <div class="welcome-content">
      <div class="welcome-text">
        <h1 class="welcome-title">
          Bem-vindo{{ user?.name ? `, ${user.name.split(' ')[0]}` : '' }}!
        </h1>
        <p class="welcome-date">{{ formattedDate }}</p>
        <p class="welcome-subtitle">Tenha um ótimo dia de trabalho</p>
      </div>
      <div class="welcome-logo">
        <img src="/img/climbe-logo.png" alt="Climbe Logo" class="logo-image" />
        <p class="company-tagline">Investimentos independentes</p>
      </div>
    </div>
    <div v-if="userRole" class="welcome-role">
      <span class="role-badge">{{ userRole }}</span>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getRoleById } from '@/api/roles'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userRole = ref('')

const formattedDate = computed(() => {
  const today = new Date()
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return today.toLocaleDateString('pt-BR', options)
})

const loadUserRole = async () => {
  if (user.value?.profile) {
    try {
      const role = await getRoleById(user.value.profile)
      userRole.value = role.nomeCargo
    } catch (error) {
      userRole.value = 'Sem cargo'
    }
  } else {
    userRole.value = 'Sem cargo'
  }
}

onMounted(() => {
  loadUserRole()
})
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #39C6BB 0%, #2ea89d 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(57, 198, 187, 0.2);
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  pointer-events: none;
}

.welcome-card::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  pointer-events: none;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.welcome-text {
  flex: 1;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: white;
}

.welcome-date {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  opacity: 0.95;
  font-weight: 400;
}

.welcome-subtitle {
  font-size: 0.95rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

.welcome-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  min-width: 180px;
}

.logo-image {
  width: 80px;
  height: auto;
  object-fit: contain;
}

.company-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.company-tagline {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.9;
  text-align: center;
}

.welcome-role {
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
}

.role-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .welcome-card {
    padding: 1.5rem;
  }

  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .welcome-logo {
    width: 100%;
    min-width: auto;
  }

  .logo-image {
    width: 60px;
  }

  .company-name {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .welcome-card {
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .welcome-title {
    font-size: 1.25rem;
  }

  .welcome-date {
    font-size: 0.9rem;
  }

  .welcome-subtitle {
    font-size: 0.85rem;
  }

  .welcome-logo {
    padding: 1rem;
  }

  .logo-image {
    width: 50px;
  }

  .company-name {
    font-size: 1.1rem;
  }

  .company-tagline {
    font-size: 0.8rem;
  }
}
</style>

