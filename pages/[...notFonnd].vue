<!-- pages/[...notFound].vue -->
<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div class="max-w-md w-full text-center">
        <div class="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">404</div>
        <h1 class="text-3xl font-semibold text-gray-800 dark:text-white">Page Not Found</h1>
        
        <div class="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Icon name="heroicons:exclamation-triangle" class="h-16 w-16 mx-auto text-amber-500 mb-4" />
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              left-icon="heroicons:home"
              @click="goHome"
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outline"
              left-icon="heroicons:arrow-left"
              @click="goBack"
            >
              Go Back
            </Button>
          </div>
        </div>
        
        <div class="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import Button from '~/components/ui/Button.vue';
  
  const router = useRouter();
  
  const goHome = () => {
    router.push('/');
  };
  
  const goBack = () => {
    router.back();
  };
  </script>