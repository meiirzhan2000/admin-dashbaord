<!-- components/team/TeamStats.vue -->
<template>
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="stat in stats" 
        :key="stat.name" 
        class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
      >
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <Icon 
                :name="stat.icon" 
                :class="[stat.iconColor, 'h-6 w-6']" 
                aria-hidden="true" 
              />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {{ stat.name }}
                </dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ stat.value }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-5 py-3">
          <div class="text-sm">
            <a 
              v-if="stat.href" 
              :href="stat.href" 
              class="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
            >
              View all
            </a>
            <span v-else-if="stat.change" :class="[
              stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
              'font-medium flex items-center'
            ]">
              <Icon 
                :name="stat.changeType === 'increase' ? 'heroicons:arrow-up' : 'heroicons:arrow-down'" 
                class="h-4 w-4 mr-1" 
              />
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">

  import type { Stat } from '~/types/dashboard';
  
  defineProps<{
    stats: Stat[];
  }>();
  </script>