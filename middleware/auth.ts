// middleware/auth.ts
import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtRouteMiddleware((to) => {
  // Skip middleware if we're running on the server
  if (process.server) return;
  
  console.log('Auth Middleware - Current path:', to.path);
  const isLoginPage = to.path === '/login';
  console.log('Is login page:', isLoginPage);
  
  // First, check for token in localStorage directly
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const isAuthenticated = !!token && !!userStr;
  
  console.log('Token exists:', !!token);
  console.log('User data exists:', !!userStr);
  
  const authStore = useAuthStore();
  
  // If authenticated according to localStorage but not in store, initialize the store
  if (isAuthenticated && !authStore.isAuthenticated) {
    console.log('Found auth data in localStorage, initializing store');
    authStore.initializeAuth();
  }
  
  // Now check authentication status
  console.log('User authenticated (after check):', isAuthenticated);
  
  // If route requires authentication and user is not authenticated
  if (!isLoginPage && !isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return navigateTo('/login');
  }
  
  // If the route is the login page and user is authenticated
  if (isLoginPage && isAuthenticated) {
    console.log('Already authenticated, redirecting to dashboard');
    return navigateTo('/');
  }
});