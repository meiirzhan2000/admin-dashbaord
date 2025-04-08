<!-- components/common/EmptyState.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
      <Icon :name="icon" class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
      <p class="mt-4 text-gray-700 dark:text-gray-300">{{ message }}</p>
      <slot name="action">
        <button 
          v-if="actionLabel"
          @click="$emit('action')" 
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
        >
          <Icon v-if="actionIcon" :name="actionIcon" class="h-4 w-4 mr-1" />
          {{ actionLabel }}
        </button>
      </slot>
    </div>
  </template>
  
  <script setup>
  defineProps({
    icon: {
      type: String,
      default: 'heroicons:exclamation-circle'
    },
    message: {
      type: String,
      default: 'No items found.'
    },
    actionLabel: {
      type: String,
      default: ''
    },
    actionIcon: {
      type: String,
      default: ''
    }
  });
  
  defineEmits(['action']);
  </script>