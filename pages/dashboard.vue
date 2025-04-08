<!-- pages/Dashboard.vue -->
<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
      <div v-if="user" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 class="text-lg font-semibold">Welcome, {{ user.name }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Email: {{ user.email }}</p>
        <p class="text-gray-600 dark:text-gray-400">Role: {{ user.role || 'User' }}</p>
        
        <button 
          @click="logout" 
          class="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue';
  import { useAuthStore } from '~/stores/useAuthStore';
  
  const authStore = useAuthStore();
  const user = ref(null);
  
  onMounted(async () => {
    if (authStore.user) {
      user.value = authStore.user;
    } else {
      try {
        await authStore.fetchUserProfile();
        user.value = authStore.user;
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  });
  
  const logout = () => {
    authStore.logout();
  };
  </script>