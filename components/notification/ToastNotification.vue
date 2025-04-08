<!-- components/notification/ToastNotification.vue -->
<template>
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      <TransitionGroup name="toast">
        <div 
          v-for="toast in toastList" 
          :key="toast.id"
          class="rounded-lg shadow-lg overflow-hidden w-full"
          :class="[
            toast.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
            toast.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' :
            toast.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
            'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          ]"
        >
          <div class="p-4">
            <div class="flex items-start">
              <!-- Icon based on type -->
              <div class="flex-shrink-0">
                <!-- Success icon -->
                <svg 
                  v-if="toast.type === 'success'" 
                  class="h-5 w-5 text-green-400 dark:text-green-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <!-- Error icon -->
                <svg 
                  v-else-if="toast.type === 'error'" 
                  class="h-5 w-5 text-red-400 dark:text-red-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <!-- Warning icon -->
                <svg 
                  v-else-if="toast.type === 'warning'" 
                  class="h-5 w-5 text-yellow-400 dark:text-yellow-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <!-- Info icon -->
                <svg 
                  v-else 
                  class="h-5 w-5 text-blue-400 dark:text-blue-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <!-- Content -->
              <div class="ml-3 w-0 flex-1">
                <p 
                  class="text-sm font-medium"
                  :class="[
                    toast.type === 'success' ? 'text-green-800 dark:text-green-200' :
                    toast.type === 'error' ? 'text-red-800 dark:text-red-200' :
                    toast.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                    'text-blue-800 dark:text-blue-200'
                  ]"
                >
                  {{ toast.title }}
                </p>
                <p 
                  v-if="toast.description" 
                  class="mt-1 text-sm"
                  :class="[
                    toast.type === 'success' ? 'text-green-700 dark:text-green-300' :
                    toast.type === 'error' ? 'text-red-700 dark:text-red-300' :
                    toast.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                    'text-blue-700 dark:text-blue-300'
                  ]"
                >
                  {{ toast.description }}
                </p>
              </div>
              
              <!-- Close button -->
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="removeToast(toast.id)"
                  class="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Toast {
    id: number;
    title: string;
    description: string;
    type: 'success' | 'error' | 'warning' | 'info';
    color: string;
    timeout: number;
  }
  
  const nuxtApp = useNuxtApp();
  const toastService = nuxtApp.$toast;
  
  // Safe access to toasts with type checking
  const toastList = computed<Toast[]>(() => {
    if (toastService && toastService.toasts) {
      return toastService.toasts.value || [];
    }
    return [];
  });
  
  function removeToast(id: number) {
    if (toastService && typeof toastService.remove === 'function') {
      toastService.remove(id);
    }
  }
  </script>
  
  <style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }
  .toast-enter-from {
    transform: translateX(30px);
    opacity: 0;
  }
  .toast-leave-to {
    transform: translateX(30px);
    opacity: 0;
  }
  </style>