// stores/useAuthStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

interface LoginResponse {
  seller: User;
  token: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false,
    error: null as string | null,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      
      try {
        // Make the login request
        const response = await axios.post(`/api/seller/signin`, {
          email,
          password
        });
        
        const data = response.data;
        
        // Set auth state
        this.user = data.seller;
        this.token = data.token;
        
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.seller));
        
        // Set default axios auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        
        // Set up token expiration check
        this.checkTokenExpiration(data.token);
        
        this.loading = false;
        
        // Show success notification
        try {
          const nuxtApp = useNuxtApp();
          if (nuxtApp.$toast) {
            nuxtApp.$toast.success({
              title: 'Login Successful',
              description: `Welcome back, ${data.seller.name}!`
            });
          }
        } catch (e) {
          // Fallback if toast fails
          console.log('Login successful:', data.seller.name);
        }
        
        return data;
      } catch (error) {
        this.loading = false;
        
        // Handle different error types
        if (error && typeof error === 'object' && 'response' in error) {
          const err = error as { response?: { data?: { message?: string } } };
          // Server responded with an error status
          this.error = err.response?.data?.message || 'Authentication failed';
        } else if (error && typeof error === 'object' && 'request' in error) {
          // Request was made but no response received
          this.error = 'No response from server. Please check your connection';
        } else if (error && typeof error === 'object' && 'message' in error) {
          const err = error as { message?: string };
          // Something else caused the error
          this.error = err.message || 'Failed to authenticate';
        } else {
          this.error = 'An unknown error occurred';
        }
        
        throw new Error(this.error);
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear axios auth header
      delete axios.defaults.headers.common['Authorization'];
      
      // Use router to navigate to login page
      const router = useRouter();
      router.push('/login');
      
      // Show logout notification
      try {
        const nuxtApp = useNuxtApp();
        if (nuxtApp.$toast) {
          nuxtApp.$toast.info({
            title: 'Logged Out',
            description: 'You have been successfully logged out'
          });
        }
      } catch (e) {
        // Fallback if toast fails
        console.log('Logged out successfully');
      }
    },
    
    checkTokenExpiration(token: string) {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) throw new Error("Invalid token");
        
        const payload = JSON.parse(atob(tokenParts[1]));
        const exp = payload.exp * 1000;
        
        const currentTime = Date.now();
        const timeUntilExpiration = exp - currentTime;
        
        if (timeUntilExpiration <= 0) {
          this.logout();
          return;
        }
        
        // Set up automatic logout when token expires
        setTimeout(() => {
          this.logout();
          
          // Show notification
          try {
            const nuxtApp = useNuxtApp();
            if (nuxtApp.$toast) {
              nuxtApp.$toast.warning({
                title: 'Session Expired',
                description: 'Your session has expired. Please log in again.'
              });
            }
          } catch (e) {
            // Fallback if toast fails
            console.log('Session expired');
          }
        }, timeUntilExpiration);
      } catch (error) {
        this.logout();
      }
    },
    
    // initializeAuth() {
    //   // Set initialized flag
    //   this.initialized = true;
      
    //   // Get token and user from localStorage
    //   const token = localStorage.getItem('token');
    //   const userStr = localStorage.getItem('user');
      
    //   if (token) {
    //     // Set the token in state
    //     this.token = token;
        
    //     // Set default axios auth header
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
    //     // Check token expiration
    //     this.checkTokenExpiration(token);
        
    //     // Try to parse user data
    //     if (userStr) {
    //       try {
    //         this.user = JSON.parse(userStr);
    //       } catch (e) {
    //         // If user data is invalid, fetch it from API
    //         this.fetchUserProfile();
    //       }
    //     } else {
    //       // If no user data, fetch it from API
    //       this.fetchUserProfile();
    //     }
    //   }
    // },

    initializeAuth() {
      // Set initialized flag
      this.initialized = true;
      
      // Get token and user from localStorage
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token) {
        // Set the token in state
        this.token = token;
        
        // Set default axios auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Check token expiration (skip for dummy token)
        if (token !== 'dummy-dev-token-for-testing-only') {
          this.checkTokenExpiration(token);
        }
        
        // Try to parse user data
        if (userStr) {
          try {
            this.user = JSON.parse(userStr);
            console.log('User data loaded from localStorage:', this.user?.name);
          } catch (e) {
            // If user data is invalid, fetch it from API
            console.error('Error parsing user data from localStorage', e);
            this.fetchUserProfile();
          }
        } else {
          // If no user data, fetch it from API
          this.fetchUserProfile();
        }
      }
    },
    
    async fetchUserProfile() {
      if (!this.token) return;
      
      try {
        const response = await axios.get(`/api/seller/profile`);
        this.user = response.data;
        
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        // If getting profile fails, token might be invalid
        this.logout();
      }
    },
    
    setError(message: string) {
      this.error = message;
    },
    
    clearError() {
      this.error = null;
    }
  }
});