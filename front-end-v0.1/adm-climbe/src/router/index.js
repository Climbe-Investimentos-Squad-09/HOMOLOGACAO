import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import DashboardView from '../views/DashboardView.vue';
import CalendarView from '../views/CalendarView.vue';
import ProposalsView from '../views/ProposalsView.vue';
import ContractsView from '../views/ContractsView.vue';
import AuthorizationsView from '../views/AuthorizationsView.vue';
import UsersView from '../views/UsersView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: HomeView,
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: CalendarView,
    },
    {
      path: '/propostas',
      name: 'propostas',
      component: ProposalsView,
    },
    {
      path: '/contratos',
      name: 'contratos',
      component: ContractsView,
    },
    {
      path: '/contratos/criar',
      name: 'criar-contrato',
      component: ContractsView,
      props: { openModal: true }
    }, 
    {
      path: '/autorizacoes',
      name: 'autorizacoes',
      component: AuthorizationsView,
    },{
      path: '/usuarios',
      name: 'usuarios',
      component: UsersView,
    },
  ],
});

export default router;