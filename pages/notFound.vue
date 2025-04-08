<!-- pages/NotFound.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div class="max-w-md w-full text-center">
        <h1 class="text-6xl font-bold text-purple-600 dark:text-purple-400">404</h1>
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mt-4">Page Not Found</h2>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div class="mt-8">
          <button 
            @click="goHome" 
            class="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goHome = () => {
    router.push('/');
  };
  </script>