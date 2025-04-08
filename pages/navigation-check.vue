<!-- pages/navigation-check.vue -->
<!-- This is a debugging page to test navigation -->
<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6">Navigation Check</h1>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Current Auth State</h2>
        <div class="space-y-2 mb-6">
          <p><strong>Is Authenticated:</strong> {{ authStore.isAuthenticated }}</p>
          <p><strong>Has Token:</strong> {{ !!authStore.token }}</p>
          <p><strong>Current Route:</strong> {{ route.path }}</p>
          <p v-if="authStore.user"><strong>User:</strong> {{ authStore.user.name }}</p>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-lg font-medium">Navigation Tests</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="(test, index) in navigationTests" 
              :key="index"
              class="border dark:border-gray-700 p-4 rounded-lg"
            >
              <p class="font-medium mb-2">{{ test.name }}</p>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ test.description }}</p>
              <button 
                @click="test.action" 
                class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Test This
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-8">
          <h3 class="text-lg font-medium mb-3">Results Log</h3>
          <div 
            class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg max-h-60 overflow-y-auto font-mono text-sm"
          >
            <div v-for="(log, index) in logs" :key="index" class="mb-1">
              {{ log }}
            </div>
          </div>
        </div>
        
        <div class="mt-8 flex space-x-4">
          <button 
            @click="clearLogs" 
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Clear Logs
          </button>
          <button 
            @click="navigateHome" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useAuthStore } from '~/stores/useAuthStore';
  
  // No auth middleware on this page to allow testing
  definePageMeta({
    middleware: []
  });
  
  const authStore = useAuthStore();
  const route = useRoute();
  const router = useRouter();
  const logs = ref([]);
  
  // Log function
  const log = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    logs.value.push(`[${timestamp}] ${message}`);
    console.log(message);
  };
  
  // Clear logs
  const clearLogs = () => {
    logs.value = [];
  };
  
  // Navigate home
  const navigateHome = async () => {
    log('Attempting to navigate to /');
    try {
      await navigateTo('/');
      log('navigateTo successful');
    } catch (e) {
      log(`navigateTo error: ${e.message}`);
      
      try {
        await router.push('/');
        log('router.push successful');
      } catch (e) {
        log(`router.push error: ${e.message}`);
        
        log('Trying window.location.href as last resort');
        window.location.href = '/';
      }
    }
  };
  
  // Navigation tests
  const navigationTests = [
    {
      name: 'Standard navigateTo',
      description: 'Use Nuxt navigateTo composable',
      action: async () => {
        log('Testing navigateTo to /');
        try {
          await navigateTo('/');
          log('navigateTo successful');
        } catch (e) {
          log(`Error: ${e.message}`);
        }
      }
    },
    {
      name: 'Router Push',
      description: 'Use Vue Router push method',
      action: async () => {
        log('Testing router.push to /');
        try {
          await router.push('/');
          log('router.push successful');
        } catch (e) {
          log(`Error: ${e.message}`);
        }
      }
    },
    {
      name: 'Router Replace',
      description: 'Use Vue Router replace method',
      action: async () => {
        log('Testing router.replace to /');
        try {
          await router.replace('/');
          log('router.replace successful');
        } catch (e) {
          log(`Error: ${e.message}`);
        }
      }
    },
    {
      name: 'Window Location',
      description: 'Use direct window.location.href',
      action: () => {
        log('Testing window.location.href to /');
        window.location.href = '/';
      }
    },
    {
      name: 'Clear Auth & Navigate',
      description: 'Clear auth state then navigate',
      action: async () => {
        log('Clearing auth state');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        authStore.token = null;
        authStore.user = null;
        
        log('Testing navigation to / after clearing auth');
        try {
          await navigateTo('/');
          log('Navigation successful');
        } catch (e) {
          log(`Error: ${e.message}`);
        }
      }
    },
    {
      name: 'Logout & Navigate',
      description: 'Use auth store logout then navigate',
      action: async () => {
        log('Calling authStore.logout()');
        try {
          authStore.logout();
          log('Logout successful');
        } catch (e) {
          log(`Error during logout: ${e.message}`);
        }
      }
    }
  ];
  
  onMounted(() => {
    log('Page mounted');
    log(`Current route: ${route.path}`);
    log(`Is authenticated: ${authStore.isAuthenticated}`);
    
    if (!authStore.initialized) {
      log('Auth store not initialized, initializing...');
      authStore.initializeAuth();
      log('Auth store initialized');
    }
  });
  </script>