import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import CalendarView from '../views/CalendarView.vue';
import ProposalsView from '../views/ProposalsView.vue';
import ContractsView from '../views/ContractsView.vue';
import AuthorizationsView from '../views/AuthorizationsView.vue';
import UsersView from '../views/UsersView.vue';
import { authGuard, guestGuard } from './guards';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: HomeView,
      beforeEnter: guestGuard,
    },
    {
      path: '/google-signup',
      name: 'google-signup',
      component: () => import('../views/GoogleSignupView.vue'),
      beforeEnter: guestGuard,
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      beforeEnter: authGuard,
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: CalendarView,
      beforeEnter: authGuard,
    },
    {
      path: '/propostas',
      name: 'propostas',
      component: ProposalsView,
      beforeEnter: authGuard,
    },
    {
      path: '/contratos',
      name: 'contratos',
      component: ContractsView,
      beforeEnter: authGuard,
    },
    {
      path: '/contratos/criar',
      name: 'criar-contrato',
      component: ContractsView,
      props: { openModal: true },
      beforeEnter: authGuard,
    },
    {
      path: '/documentos',
      name: 'documentos',
      component: () => import('../views/DocumentsView.vue'),
      beforeEnter: authGuard,
    }, 
    {
      path: '/autorizacoes',
      name: 'autorizacoes',
      component: AuthorizationsView,
      beforeEnter: authGuard,
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsersView,
      beforeEnter: authGuard,
    },
    {
      path: '/empresas',
      name: 'empresas',
      component: () => import('../views/CompaniesView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: () => import('../views/AuditsView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/ProfileView.vue'),
      beforeEnter: authGuard,
    },
    {
      path: '/configuracoes',
      name: 'configuracoes',
      component: () => import('../views/SettingsView.vue'),
      beforeEnter: authGuard,
    },
  ],
});

export default router;