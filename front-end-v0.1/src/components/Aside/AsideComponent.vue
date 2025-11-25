<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/img/climb-logo-preto.png" alt="logo Climbe" class="logo" />
    </div>
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17.318 11.5H13.443C12.9293 11.4995 12.4364 11.7027 12.0724 12.065C11.7083 12.4274 11.5029 12.9193 11.501 13.433V17.308C11.5007 17.5631 11.5508 17.8158 11.6483 18.0515C11.7458 18.2872 11.8888 18.5014 12.0692 18.6818C12.2496 18.8622 12.4638 19.0052 12.6995 19.1027C12.9353 19.2002 13.1879 19.2503 13.443 19.25H17.318C17.8315 19.2479 18.3232 19.0423 18.6853 18.6783C19.0475 18.3142 19.2505 17.8215 19.25 17.308V13.433C19.2503 13.1792 19.2005 12.9279 19.1035 12.6933C19.0065 12.4588 18.8642 12.2457 18.6847 12.0663C18.5053 11.8868 18.2922 11.7445 18.0577 11.6475C17.8231 11.5505 17.5718 11.5007 17.318 11.501M6.557 11.5H2.682C2.16859 11.5029 1.67721 11.7089 1.3152 12.073C0.953191 12.437 0.749993 12.9296 0.750001 13.443V17.318C0.749738 17.5718 0.799531 17.8231 0.89653 18.0577C0.993529 18.2922 1.13583 18.5053 1.31528 18.6847C1.49474 18.8642 1.70783 19.0065 1.94235 19.1035C2.17687 19.2005 2.42821 19.2503 2.682 19.25H6.557C7.07048 19.2505 7.56324 19.0475 7.92726 18.6853C8.29128 18.3232 8.49688 17.8315 8.499 17.318V13.443C8.49926 13.1879 8.44921 12.9353 8.35171 12.6995C8.25421 12.4638 8.11117 12.2496 7.93079 12.0692C7.75041 11.8888 7.53622 11.7458 7.30048 11.6483C7.06475 11.5508 6.8121 11.5007 6.557 11.501M6.557 0.750001H2.682C2.42821 0.749738 2.17687 0.799531 1.94235 0.89653C1.70783 0.993529 1.49474 1.13583 1.31528 1.31528C1.13583 1.49474 0.993529 1.70783 0.89653 1.94235C0.799531 2.17687 0.749738 2.42821 0.750001 2.682V6.557C0.749467 7.07048 0.952527 7.56324 1.31468 7.92726C1.67683 8.29128 2.16852 8.49688 2.682 8.499H6.557C6.8121 8.49926 7.06475 8.44921 7.30048 8.35171C7.53622 8.25421 7.75041 8.11117 7.93079 7.93079C8.11117 7.75041 8.25421 7.53622 8.35171 7.30048C8.44921 7.06475 8.49926 6.8121 8.499 6.557V2.682C8.49688 2.16852 8.29128 1.67683 7.92726 1.31468C7.56324 0.952527 7.07048 0.749467 6.557 0.750001ZM17.318 0.750001H13.443C12.9295 0.749467 12.4368 0.952527 12.0727 1.31468C11.7087 1.67683 11.5031 2.16852 11.501 2.682V6.557C11.5013 7.07197 11.706 7.56577 12.0701 7.92991C12.4342 8.29405 12.928 8.49874 13.443 8.499H17.318C17.8315 8.49688 18.3232 8.29128 18.6853 7.92726C19.0475 7.56324 19.2505 7.07048 19.25 6.557V2.682C19.2503 2.42821 19.2005 2.17687 19.1035 1.94235C19.0065 1.70783 18.8642 1.49474 18.6847 1.31528C18.5053 1.13583 18.2922 0.993529 18.0577 0.89653C17.8231 0.799531 17.5718 0.749738 17.318 0.750001Z"
            stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Tela Inicial</span>
      </router-link>
      <router-link 
        v-if="canViewCalendar" 
        to="/calendario" 
        class="nav-item"
      >
        <i class="bi bi-calendar-fill"></i>
        <span>Calendário</span>
      </router-link>
      <router-link 
        v-if="canViewProposals" 
        to="/propostas" 
        class="nav-item"
      >
        <svg width="20" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 2H5C4.44772 2 4 2.44772 4 3V21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21V3C20 2.44772 19.5523 2 19 2Z"
            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8 2H12.5V10L10.25 8L8 10V2Z" stroke="black" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M8 14H13M8 17H16" stroke="black" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>Propostas</span>
      </router-link>
      <router-link 
        v-if="canViewContracts" 
        to="/contratos" 
        class="nav-item"
      >
        <svg width="20" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 21H6C5.20435 21 4.44129 20.6839 3.87868 20.1213C3.31607 19.5587 3 18.7957 3 18V17H8.5M17 8.5V5C17 4.60444 17.1173 4.21776 17.3371 3.88886C17.5568 3.55996 17.8692 3.30362 18.2346 3.15224C18.6001 3.00087 19.0022 2.96126 19.3902 3.03843C19.7781 3.1156 20.1345 3.30608 20.4142 3.58579C20.6939 3.86549 20.8844 4.22186 20.9616 4.60982C21.0387 4.99778 20.9991 5.39992 20.8478 5.76537C20.6964 6.13082 20.44 6.44318 20.1111 6.66294C19.7822 6.8827 19.3956 7 19 7H17"
            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M19 3H8C7.20435 3 6.44129 3.31607 5.87868 3.87868C5.31607 4.44129 5 5.20435 5 6V17M9 7H13M9 11H13M18.42 12.61C18.8138 12.2162 19.348 11.9949 19.905 11.9949C20.462 11.9949 20.9962 12.2162 21.39 12.61C21.7838 13.0038 22.0051 13.538 22.0051 14.095C22.0051 14.652 21.7838 15.1862 21.39 15.58L15 22H12V19L18.42 12.61Z"
            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Contratos</span>
      </router-link>
      <router-link 
        v-if="canViewCompanies" 
        to="/empresas" 
        class="nav-item"
      >
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 4C5 4.26522 4.89464 4.51957 4.70711 4.70711C4.51957 4.89464 4.26522 5 4 5C3.73478 5 3.48043 4.89464 3.29289 4.70711C3.10536 4.51957 3 4.26522 3 4C3 3.73478 3.10536 3.48043 3.29289 3.29289C3.48043 3.10536 3.73478 3 4 3C4.26522 3 4.51957 3.10536 4.70711 3.29289C4.89464 3.48043 5 3.73478 5 4ZM4 8C4.26522 8 4.51957 7.89464 4.70711 7.70711C4.89464 7.51957 5 7.26522 5 7C5 6.73478 4.89464 6.48043 4.70711 6.29289C4.51957 6.10536 4.26522 6 4 6C3.73478 6 3.48043 6.10536 3.29289 6.29289C3.10536 6.48043 3 6.73478 3 7C3 7.26522 3.10536 7.51957 3.29289 7.70711C3.48043 7.89464 3.73478 8 4 8ZM5 10C5 10.2652 4.89464 10.5196 4.70711 10.7071C4.51957 10.8946 4.26522 11 4 11C3.73478 11 3.48043 10.8946 3.29289 10.7071C3.10536 10.5196 3 10.2652 3 10C3 9.73478 3.10536 9.48043 3.29289 9.29289C3.48043 9.10536 3.73478 9 4 9C4.26522 9 4.51957 9.10536 4.70711 9.29289C4.89464 9.48043 5 9.73478 5 10ZM5 13C5 13.2652 4.89464 13.5196 4.70711 13.7071C4.51957 13.8946 4.26522 14 4 14C3.73478 14 3.48043 13.8946 3.29289 13.7071C3.10536 13.5196 3 13.2652 3 13C3 12.7348 3.10536 12.4804 3.29289 12.2929C3.48043 12.1054 3.73478 12 4 12C4.26522 12 4.51957 12.1054 4.70711 12.2929C4.89464 12.4804 5 12.7348 5 13ZM4 17C4.26522 17 4.51957 16.8946 4.70711 16.7071C4.89464 16.5196 5 16.2652 5 16C5 15.7348 4.89464 15.4804 4.70711 15.2929C4.51957 15.1054 4.26522 15 4 15C3.73478 15 3.48043 15.1054 3.29289 15.2929C3.10536 15.4804 3 15.7348 3 16C3 16.2652 3.10536 16.5196 3.29289 16.7071C3.48043 16.8946 3.73478 17 4 17ZM11 14C11.2652 14 11.5196 13.8946 11.7071 13.7071C11.8946 13.5196 12 13.2652 12 13C12 12.7348 11.8946 12.4804 11.7071 12.2929C11.5196 12.1054 11.2652 12 11 12C10.7348 12 10.4804 12.1054 10.2929 12.2929C10.1054 12.4804 10 12.7348 10 13C10 13.2652 10.1054 13.5196 10.2929 13.7071C10.4804 13.8946 10.7348 14 11 14ZM14 14C14.2652 14 14.5196 13.8946 14.7071 13.7071C14.8946 13.5196 15 13.2652 15 13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1054 14.2652 12 14 12C13.7348 12 13.4804 12.1054 13.2929 12.2929C13.1054 12.4804 13 12.7348 13 13C13 13.2652 13.1054 13.5196 13.2929 13.7071C13.4804 13.8946 13.7348 14 14 14ZM14 11C14.2652 11 14.5196 10.8946 14.7071 10.7071C14.8946 10.5196 15 10.2652 15 10C15 9.73478 14.8946 9.48043 14.7071 9.29289C14.5196 9.10536 14.2652 9 14 9C13.7348 9 13.4804 9.10536 13.2929 9.29289C13.1054 9.48043 13 9.73478 13 10C13 10.2652 13.1054 10.5196 13.2929 10.7071C13.4804 10.8946 13.7348 11 14 11ZM12 10C12 10.2652 11.8946 10.5196 11.7071 10.7071C11.5196 10.8946 11.2652 11 11 11C10.7348 11 10.4804 10.8946 10.2929 10.7071C10.1054 10.5196 10 10.2652 10 10C10 9.73478 10.1054 9.48043 10.2929 9.29289C10.4804 9.10536 10.7348 9 11 9C11.2652 9 11.5196 9.10536 11.7071 9.29289C11.8946 9.48043 12 9.73478 12 10ZM14 8C14.2652 8 14.5196 7.89464 14.7071 7.70711C14.8946 7.51957 15 7.26522 15 7C15 6.73478 14.8946 6.48043 14.7071 6.29289C14.5196 6.10536 14.2652 6 14 6C13.7348 6 13.4804 6.10536 13.2929 6.29289C13.1054 6.48043 13 6.73478 13 7C13 7.26522 13.1054 7.51957 13.2929 7.70711C13.4804 7.89464 13.7348 8 14 8ZM12 7C12 7.26522 11.8946 7.51957 11.7071 7.70711C11.5196 7.89464 11.2652 8 11 8C10.7348 8 10.4804 7.89464 10.2929 7.70711C10.1054 7.51957 10 7.26522 10 7C10 6.73478 10.1054 6.48043 10.2929 6.29289C10.4804 6.10536 10.7348 6 11 6C11.2652 6 11.5196 6.10536 11.7071 6.29289C11.8946 6.48043 12 6.73478 12 7ZM11 3V2.25C11 1.65326 10.7629 1.08097 10.341 0.65901C9.91903 0.237053 9.34674 0 8.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V18.75C0 19.164 0.336 19.5 0.75 19.5H17.25C17.4489 19.5 17.6397 19.421 17.7803 19.2803C17.921 19.1397 18 18.9489 18 18.75V5.25C18 4.65326 17.7629 4.08097 17.341 3.65901C16.919 3.23705 16.3467 3 15.75 3H11ZM1.5 2.25C1.5 2.05109 1.57902 1.86032 1.71967 1.71967C1.86032 1.57902 2.05109 1.5 2.25 1.5H8.75C8.94891 1.5 9.13968 1.57902 9.28033 1.71967C9.42098 1.86032 9.5 2.05109 9.5 2.25V3H9.25C8.65326 3 8.08097 3.23705 7.65901 3.65901C7.23705 4.08097 7 4.65326 7 5.25V18H1.5V2.25ZM11.5 18V16.5H13.5V18H11.5ZM15 15.75C15 15.5511 14.921 15.3603 14.7803 15.2197C14.6397 15.079 14.4489 15 14.25 15H10.75C10.5511 15 10.3603 15.079 10.2197 15.2197C10.079 15.3603 10 15.5511 10 15.75V18H8.5V5.25C8.5 5.05109 8.57902 4.86032 8.71967 4.71967C8.86032 4.57902 9.05109 4.5 9.25 4.5H15.75C15.9489 4.5 16.1397 4.57902 16.2803 4.71967C16.421 4.86032 16.5 5.05109 16.5 5.25V18H15V15.75Z"
            fill="black" />
        </svg>

        <span>Empresas</span>
      </router-link>
      <router-link 
        v-if="canViewUsers" 
        to="/usuarios" 
        class="nav-item"
      >
        <svg width="20" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 19V17C1 15.9391 1.42143 14.9217 2.17157 14.1716C2.92172 13.4214 3.93913 13 5 13H9C10.0609 13 11.0783 13.4214 11.8284 14.1716C12.5786 14.9217 13 15.9391 13 17V19M14 1.13C14.8604 1.3503 15.623 1.8507 16.1676 2.55231C16.7122 3.25392 17.0078 4.11683 17.0078 5.005C17.0078 5.89317 16.7122 6.75608 16.1676 7.45769C15.623 8.1593 14.8604 8.6597 14 8.88M19 19V17C18.9949 16.1172 18.6979 15.2608 18.1553 14.5644C17.6126 13.868 16.8548 13.3707 16 13.15M3 5C3 6.06087 3.42143 7.07828 4.17157 7.82843C4.92172 8.57857 5.93913 9 7 9C8.06087 9 9.07828 8.57857 9.82843 7.82843C10.5786 7.07828 11 6.06087 11 5C11 3.93913 10.5786 2.92172 9.82843 2.17157C9.07828 1.42143 8.06087 1 7 1C5.93913 1 4.92172 1.42143 4.17157 2.17157C3.42143 2.92172 3 3.93913 3 5Z"
            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Usuários</span>
      </router-link>
      <router-link 
        v-if="canViewAuthorizations" 
        to="/autorizacoes" 
        class="nav-item"
      >
        <i class="bi bi-shield-lock-fill"></i>
        <span>Autorizações</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <hr>
      <div class="profile-and-logout">
        <div class="user-profile" @click="goToProfile">
          <div class="avatar"></div>
          <div class="user-info">
            <span class="user-name">{{ user?.name || 'Usuário' }}</span>
            <span class="user-role">{{ userRole || 'Sem cargo' }}</span>
          </div>
        </div>
        <button class="logout-button" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 18C1.45 18 0.979333 17.8043 0.588 17.413C0.196667 17.0217 0.000666667 16.5507 0 16V2C0 1.45 0.196 0.979333 0.588 0.588C0.98 0.196667 1.45067 0.000666667 2 0H8C8.28333 0 8.521 0.0960001 8.713 0.288C8.905 0.48 9.00067 0.717333 9 1C8.99933 1.28267 8.90333 1.52033 8.712 1.713C8.52067 1.90567 8.28333 2.00133 8 2H2V16H8C8.28333 16 8.521 16.096 8.713 16.288C8.905 16.48 9.00067 16.7173 9 17C8.99933 17.2827 8.90333 17.5203 8.712 17.713C8.52067 17.9057 8.28333 18.0013 8 18H2ZM14.175 10H7C6.71667 10 6.47933 9.904 6.288 9.712C6.09667 9.52 6.00067 9.28267 6 9C5.99933 8.71733 6.09533 8.48 6.288 8.288C6.48067 8.096 6.718 8 7 8H14.175L12.3 6.125C12.1167 5.94167 12.025 5.71667 12.025 5.45C12.025 5.18333 12.1167 4.95 12.3 4.75C12.4833 4.55 12.7167 4.44567 13 4.437C13.2833 4.42833 13.525 4.52433 13.725 4.725L17.3 8.3C17.5 8.5 17.6 8.73333 17.6 9C17.6 9.26667 17.5 9.5 17.3 9.7L13.725 13.275C13.525 13.475 13.2877 13.571 13.013 13.563C12.7383 13.555 12.5007 13.4507 12.3 13.25C12.1167 13.05 12.0293 12.8127 12.038 12.538C12.0467 12.2633 12.1423 12.034 12.325 11.85L14.175 10Z"
              fill="black" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getRoleById } from '@/api/roles'
import { hasPermission, userHasRole } from '@/utils/permissions'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const roleName = ref('')

const userRole = computed(() => {
  if (roleName.value) {
    return roleName.value
  }
  if (!user.value?.profile) {
    return 'Sem cargo'
  }
  return 'Carregando...'
})

// Verificações de permissões para o sidebar
// Se não tiver cargo, só pode ver dashboard e calendário
const hasRole = computed(() => userHasRole())
const permissions = computed(() => authStore.permissions || [])

// Recarregar permissões quando a rota mudar (para pegar mudanças feitas em outras abas)
watch(() => route.path, async () => {
  if (authStore.isAuthenticated) {
    await authStore.loadUserPermissions()
  }
})

// Funções computed que dependem das permissões (usando diretamente o store para reatividade)
// Calendário sempre visível (mesmo sem cargo)
const canViewCalendar = computed(() => {
  return true // Calendário sempre visível
})
// Propostas, Contratos, Usuários, Empresas e Autorizações aparecem se tiver permissão (mesmo sem cargo, se tiver permissões extras)
const canViewProposals = computed(() => {
  return permissions.value.includes('propostas:visualizar')
})
const canViewContracts = computed(() => {
  return permissions.value.includes('contratos:visualizar')
})
const canViewUsers = computed(() => {
  return permissions.value.includes('usuarios:visualizar')
})
const canViewCompanies = computed(() => {
  return permissions.value.includes('empresas:visualizar')
})
const canViewAuthorizations = computed(() => {
  return permissions.value.includes('usuarios:visualizar') // Assumindo mesma permissão
})

const loadRoleName = async () => {
  if (user.value?.profile) {
    try {
      const role = await getRoleById(user.value.profile)
      roleName.value = role.nomeCargo
    } catch (error) {
      roleName.value = 'Sem cargo'
    }
  }
}

onMounted(async () => {
  loadRoleName()
  // Sempre recarregar permissões para garantir que estão atualizadas
  if (authStore.isAuthenticated) {
    await authStore.loadUserPermissions()
  }
  
  // Recarregar permissões periodicamente (a cada 30 segundos) para pegar mudanças
  const intervalId = setInterval(async () => {
    if (authStore.isAuthenticated) {
      await authStore.loadUserPermissions()
    }
  }, 30000) // 30 segundos
  
  // Limpar intervalo quando componente for desmontado
  onUnmounted(() => {
    clearInterval(intervalId)
  })
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const goToProfile = () => {
  router.push('/perfil')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #FFFFFF;
  border-right: 1px solid #E9ECEF;
  display: flex;
  flex-direction: column;
}

.logo {
  max-width: 100%;
  padding: 16px 48px 16px 16px;
  margin-bottom: 0.4rem;
}

.sidebar-nav {
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  gap: 12px;
  transition: background-color 0.2s, color 0.2s;
  border-right: 3px solid transparent;
}

.nav-item:hover {
  background-color: #F0FFFF;
}

.nav-item.router-link-exact-active {
  background-color: #DFF6F6;
  color: #4AA19D;
  font-weight: 600;
  border-right: 2px solid #4AA19D;
}

.nav-item.router-link-exact-active svg path {
  stroke: #4AA19D;
}

.sidebar-footer {
  margin-top: auto;
}

.sidebar-footer hr {
  width: 95%;
  border: 1px solid #EAEAEA;
  margin: 0.1rem auto;
}

.profile-and-logout {
  padding: 16px 16px 24px 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: #F8F9FA;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #CED4DA;
  margin-right: 12px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 0.875rem;
  color: #6C757D;
}

.logout-button {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #CED4DA;
  background-color: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #F8F9FA;
}

.logout-button svg {
  vertical-align: middle;
}
</style>
