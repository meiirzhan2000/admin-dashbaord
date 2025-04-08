<!-- pages/Products.vue -->
<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Products</h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        This is a sample products page to demonstrate routing.
      </p>
      
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 class="text-lg font-semibold mb-4">Sample Products</h2>
        <p>Your product content would go here.</p>
        
        <button 
          @click="goToDashboard" 
          class="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const goToDashboard = () => {
    router.push('/');
  };
  </script>
  