<!-- components/reports/ReportCard.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ title }}</h3>
        
        <div class="flex items-center gap-2">
          <slot name="actions"></slot>
          
          <div class="relative" v-if="showOptions">
            <button 
              @click="isMenuOpen = !isMenuOpen"
              class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
            </button>
            
            <div 
              v-if="isMenuOpen" 
              class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div class="py-1" role="none">
                <button 
                  @click="downloadData"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon name="heroicons:arrow-down-tray" class="h-4 w-4 mr-2" />
                  Download Data
                </button>
                <button 
                  @click="refreshData"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon name="heroicons:arrow-path" class="h-4 w-4 mr-2" />
                  Refresh Data
                </button>
                <button 
                  @click="viewFullReport"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Icon name="heroicons:chart-bar" class="h-4 w-4 mr-2" />
                  View Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    showOptions: {
      type: Boolean,
      default: true
    }
  });
  
  const emit = defineEmits(['refresh', 'download', 'view-full']);
  
  const isMenuOpen = ref(false);
  
  // Methods
  const downloadData = () => {
    emit('download');
    isMenuOpen.value = false;
    useNuxtApp().$toast.info({
      title: 'Download Started',
      description: 'Your data is being prepared for download.'
    });
  };
  
  const refreshData = () => {
    emit('refresh');
    isMenuOpen.value = false;
    useNuxtApp().$toast.info({
      title: 'Refreshing Data',
      description: 'Your report data is being refreshed.'
    });
  };
  
  const viewFullReport = () => {
    emit('view-full');
    isMenuOpen.value = false;
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (isMenuOpen.value && !event.target.closest('.relative')) {
      isMenuOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>