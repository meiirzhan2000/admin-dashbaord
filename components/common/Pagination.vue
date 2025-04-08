<!-- components/common/Pagination.vue -->
<template>
    <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
      <!-- Mobile version -->
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          :disabled="currentPage === 1"
          @click="$emit('update:currentPage', currentPage - 1)"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="$emit('update:currentPage', currentPage + 1)"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      <!-- Desktop version -->
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of
            <span class="font-medium">{{ totalItems }}</span> results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              :disabled="currentPage === 1"
              @click="$emit('update:currentPage', 1)"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span class="sr-only">First</span>
              <Icon name="heroicons:chevron-double-left" class="h-5 w-5" />
            </button>
            <button
              :disabled="currentPage === 1"
              @click="$emit('update:currentPage', currentPage - 1)"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span class="sr-only">Previous</span>
              <Icon name="heroicons:chevron-left" class="h-5 w-5" />
            </button>
            
            <!-- Page numbers -->
            <template v-for="page in displayedPageNumbers" :key="page">
              <button
                v-if="page !== '...'"
                @click="$emit('update:currentPage', page)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  currentPage === page
                    ? 'z-10 bg-indigo-50 dark:bg-indigo-900 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-200'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ...
              </span>
            </template>
            
            <button
              :disabled="currentPage === totalPages"
              @click="$emit('update:currentPage', currentPage + 1)"
              class="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span class="sr-only">Next</span>
              <Icon name="heroicons:chevron-right" class="h-5 w-5" />
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="$emit('update:currentPage', totalPages)"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <span class="sr-only">Last</span>
              <Icon name="heroicons:chevron-double-right" class="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    currentPage: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    }
  });
  
  defineEmits(['update:currentPage']);
  
  const totalPages = computed(() => {
    return Math.ceil(props.totalItems / props.itemsPerPage);
  });
  
  const startItem = computed(() => {
    return props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.itemsPerPage + 1;
  });
  
  const endItem = computed(() => {
    return Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
  });
  
  const displayedPageNumbers = computed(() => {
    const totalPagesCount = totalPages.value;
    const current = props.currentPage;
    const pages = [];
    
    if (totalPagesCount <= 7) {
      // If we have 7 or fewer pages, show all pages
      for (let i = 1; i <= totalPagesCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // If current page is among the first 3 pages
      if (current <= 3) {
        pages.push(2, 3, 4, '...', totalPagesCount);
      } 
      // If current page is among the last 3 pages
      else if (current >= totalPagesCount - 2) {
        pages.push('...', totalPagesCount - 3, totalPagesCount - 2, totalPagesCount - 1, totalPagesCount);
      } 
      // If current page is in the middle
      else {
        pages.push('...', current - 1, current, current + 1, '...', totalPagesCount);
      }
    }
    
    return pages;
  });
  </script>