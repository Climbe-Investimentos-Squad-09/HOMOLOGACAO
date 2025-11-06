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
      <router-link to="/calendario" class="nav-item">
        <i class="bi bi-calendar-fill"></i>
        <span>Calendário</span>
      </router-link>
      <router-link to="/propostas" class="nav-item">
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
      <router-link to="/contratos" class="nav-item">
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
      <router-link to="/usuarios" class="nav-item">
        <svg width="20" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1 19V17C1 15.9391 1.42143 14.9217 2.17157 14.1716C2.92172 13.4214 3.93913 13 5 13H9C10.0609 13 11.0783 13.4214 11.8284 14.1716C12.5786 14.9217 13 15.9391 13 17V19M14 1.13C14.8604 1.3503 15.623 1.8507 16.1676 2.55231C16.7122 3.25392 17.0078 4.11683 17.0078 5.005C17.0078 5.89317 16.7122 6.75608 16.1676 7.45769C15.623 8.1593 14.8604 8.6597 14 8.88M19 19V17C18.9949 16.1172 18.6979 15.2608 18.1553 14.5644C17.6126 13.868 16.8548 13.3707 16 13.15M3 5C3 6.06087 3.42143 7.07828 4.17157 7.82843C4.92172 8.57857 5.93913 9 7 9C8.06087 9 9.07828 8.57857 9.82843 7.82843C10.5786 7.07828 11 6.06087 11 5C11 3.93913 10.5786 2.92172 9.82843 2.17157C9.07828 1.42143 8.06087 1 7 1C5.93913 1 4.92172 1.42143 4.17157 2.17157C3.42143 2.92172 3 3.93913 3 5Z"
            stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Usuários</span>
      </router-link>
      <router-link to="/autorizacoes" class="nav-item">
        <i class="bi bi-shield-lock-fill"></i>
        <span>Autorizações</span>
      </router-link>
      <router-link to="/empresas" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2L2 7V17H8V12H12V17H18V7L10 2Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Empresas</span>
      </router-link>
      <router-link to="/perfil" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M0 20C0 15.5817 4.47715 12 10 12C15.5228 12 20 15.5817 20 20" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Perfil</span>
      </router-link>
      <router-link to="/configuracoes" class="nav-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10 1V3M10 17V19M19 10H17M3 10H1M16.364 3.63604L14.8284 5.17157M5.17157 14.8284L3.63604 16.364M16.364 16.364L14.8284 14.8284M5.17157 5.17157L3.63604 3.63604" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Configurações</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <hr>
      <div class="profile-and-logout">
        <div class="user-profile">
          <div class="avatar"></div>
          <div class="user-info">
            <span class="user-name">{{ user?.name || 'Usuário' }}</span>
            <span class="user-role">{{ userRole || 'Sem cargo' }}</span>
          </div>
        </div>
        <button class="logout-button" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
            xmlns="http://www.w3.org/2000/svg">
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
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getRoleById } from '@/api/roles'

const router = useRouter()
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

const loadRoleName = async () => {
  if (user.value?.profile) {
    try {
      const role = await getRoleById(user.value.profile)
      roleName.value = role.nomeCargo
    } catch (error) {
      console.error('Erro ao carregar cargo:', error)
      roleName.value = 'Sem cargo'
    }
  }
}

onMounted(() => {
  loadRoleName()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
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
