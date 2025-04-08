// router.ts
import { createRouter, createWebHistory } from 'vue-router';

// Define your routes
const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login.vue'),
    meta: { guest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/notFound.vue')
  }
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;