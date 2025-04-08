<!-- components/contact/SupportTabs.vue -->
<template>
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Support Options">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('update:modelValue', tab.id)"
          :class="[
            modelValue === tab.id
              ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
            'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
          ]"
          :aria-current="modelValue === tab.id ? 'page' : undefined"
        >
          <Icon 
            :name="tab.icon"
            :class="[
              modelValue === tab.id 
                ? 'text-indigo-500 dark:text-indigo-400' 
                : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
              'h-5 w-5 mr-2'
            ]" 
            aria-hidden="true" 
          />
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </template>
  
  <script setup>
  defineProps({
    modelValue: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true,
      validator: (tabs) => {
        return tabs.every(tab => typeof tab.id === 'string' && 
                                typeof tab.label === 'string' && 
                                typeof tab.icon === 'string');
      }
    }
  });
  
  defineEmits(['update:modelValue']);
  </script>