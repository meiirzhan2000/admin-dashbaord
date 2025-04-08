// plugins/auth.ts
import axios from 'axios';
import { useAuthStore } from '~/stores/useAuthStore';

export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run on client-side
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Set axios default headers if token exists
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Set up axios interceptor for 401 errors (unauthorized)
      axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 401) {
            // Get the auth store
            const authStore = useAuthStore();
            
            // Log the user out
            authStore.logout();
            
            // Show notification if useToast is available
            try {
              const toast = useToast();
              toast.add({
                title: 'Session Expired',
                description: 'Your authentication has expired. Please log in again.',
                color: 'error'
              });
            } catch (e) {
              // Toast not available, show alert instead
              alert('Your session has expired. Please log in again.');
            }
          }
          return Promise.reject(error);
        }
      );
    });
  }
  
  // Make auth store available throughout the app
  nuxtApp.provide('auth', useAuthStore());
});