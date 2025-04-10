<!-- components/reports/MetricCard.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</p>
          <p class="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{{ value }}</p>
        </div>
        <div 
          :class="[
            'rounded-full p-3',
            iconBgClass
          ]"
        >
          <Icon :name="icon" class="h-6 w-6 text-white" />
        </div>
      </div>
      
      <div class="mt-4 flex items-center">
        <div 
          :class="[
            'flex items-center text-sm font-medium',
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'
          ]"
        >
          <Icon 
            :name="trend === 'up' ? 'heroicons:arrow-up' : 'heroicons:arrow-down'" 
            class="mr-1 h-4 w-4 flex-shrink-0" 
          />
          <span>{{ change }}</span>
        </div>
        <span class="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">vs. previous period</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    change: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'heroicons:chart-bar'
    },
    trend: {
      type: String,
      default: 'up',
      validator: (value) => ['up', 'down'].includes(value)
    }
  });
  
  // Generate a background color class based on the icon name
  const iconBgClass = computed(() => {
    const iconName = props.icon.toLowerCase();
    
    if (iconName.includes('dollar') || iconName.includes('currency')) {
      return 'bg-green-500 dark:bg-green-600';
    } else if (iconName.includes('shopping') || iconName.includes('bag')) {
      return 'bg-blue-500 dark:bg-blue-600';
    } else if (iconName.includes('receipt') || iconName.includes('percent')) {
      return 'bg-purple-500 dark:bg-purple-600';
    } else if (iconName.includes('arrow') || iconName.includes('return')) {
      return 'bg-amber-500 dark:bg-amber-600';
    }
    
    // Default color
    return 'bg-indigo-500 dark:bg-indigo-600';
  });
  </script>