<!-- components/settings/SettingsNavigation.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Settings</h3>
      </div>
      
      <nav class="px-4 py-3 space-y-1">
        <button
          v-for="item in navigationItems"
          :key="item.key"
          class="w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors"
          :class="[
            currentSection === item.key
              ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
          @click="$emit('change', item.key)"
        >
          <Icon :name="item.icon" class="mr-3 h-5 w-5 flex-shrink-0" />
          {{ item.label }}
        </button>
      </nav>
      
      <!-- Danger zone -->
      <div class="px-6 py-4 mt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 class="text-sm font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h4>
        
        <button
          type="button"
          class="w-full flex items-center justify-center px-4 py-2 border border-red-300 dark:border-red-700 text-sm font-medium rounded-md text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800"
          @click="$emit('delete-account')"
        >
          <Icon name="heroicons:trash" class="h-4 w-4 mr-1.5" />
          Delete Account
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface NavItem {
    key: string;
    label: string;
    icon: string;
  }
  
  defineProps<{
    currentSection: string;
  }>();
  
  defineEmits<{
    (e: 'change', section: string): void;
    (e: 'delete-account'): void;
  }>();
  
  const navigationItems: NavItem[] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: 'heroicons:user-circle'
    },
    {
      key: 'security',
      label: 'Security',
      icon: 'heroicons:shield-check'
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: 'heroicons:bell'
    },
    {
      key: 'appearance',
      label: 'Appearance',
      icon: 'heroicons:paint-brush'
    },
    {
      key: 'integrations',
      label: 'Integrations',
      icon: 'heroicons:puzzle-piece'
    },
    {
      key: 'billing',
      label: 'Billing',
      icon: 'heroicons:credit-card'
    }
  ];
  </script>