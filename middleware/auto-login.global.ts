// middleware/auto-login.global.ts
import { useAuthStore } from '~/stores/useAuthStore';

// Flag to enable automatic login for development
const AUTO_LOGIN = true; // Set to false when you want normal authentication flow

export default defineNuxtRouteMiddleware((to) => {
  // Skip on server side
  if (process.server) return;
  
  // Only run auto-login in development mode
  if (!AUTO_LOGIN) return;
  
  const authStore = useAuthStore();
  
  // If we're already authenticated, don't do anything
  if (authStore.isAuthenticated) return;
  
  // If we're on the login page, set dummy data and redirect to dashboard
  if (to.path === '/login') {
    console.log('DEV MODE: Auto-login activated. Bypassing login screen.');
    
    // Set dummy data in auth store
    const dummyUser = {
      id: 1,
      name: "Development User",
      email: "dev@example.com",
      role: "admin"
    };
    
    const dummyToken = "dummy-dev-token-for-testing-only";
    
    // Update auth store
    authStore.user = dummyUser;
    authStore.token = dummyToken;
    
    // Save to localStorage to persist across refreshes
    localStorage.setItem('token', dummyToken);
    localStorage.setItem('user', JSON.stringify(dummyUser));
    
    // Redirect to dashboard
    return navigateTo('/');
  }
});