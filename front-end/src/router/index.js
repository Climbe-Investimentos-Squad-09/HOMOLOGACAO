import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {noSidebar: true}
    },
    {
      path: '/google-signup',
      name: 'google-signup',
      component: () => import('../views/GoogleSignupView.vue'),
      meta: {noSidebar: true}
    },
    {
      path: '/pending-approval',
      name: 'pending-approval',
      component: () => import('../views/PendingApprovalView.vue'),
      meta: {noSidebar: true}
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../components/UserTable/UserTable.vue')
    },
    {
      path: '/companies',
      name: 'companies',
      component: () => import('../views/CompaniesView.vue')
    }
  ],
})

export default router
