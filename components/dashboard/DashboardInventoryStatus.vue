<!-- components/dashboard/DashboardInventoryStatus.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Inventory Status</h3>
        <Button
          variant="link"
          size="sm"
          @click="$emit('view-inventory')"
        >
          View all
        </Button>
      </div>
      
      <!-- Inventory summary -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
        <div
          v-for="(stat, index) in inventoryStats"
          :key="index"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center justify-center text-center"
        >
          <div 
            class="flex items-center justify-center h-12 w-12 rounded-full mb-3"
            :class="stat.bgColor"
          >
            <Icon :name="stat.icon" :class="`h-6 w-6 ${stat.iconColor}`" />
          </div>
          <div class="font-semibold text-2xl text-gray-900 dark:text-white">{{ stat.value }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</div>
        </div>
      </div>
      
      <!-- Inventory alerts -->
      <div class="px-6 pb-6">
        <h4 class="text-base font-medium text-gray-900 dark:text-white mb-4">Inventory Alerts</h4>
        
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        
        <EmptyState
          v-else-if="alerts.length === 0"
          icon="heroicons:check-circle"
          message="No inventory alerts at this time"
          action-label="Check Inventory"
          action-icon="heroicons:clipboard-document-check"
          @action="$emit('view-inventory')"
        />
        
        <div
          v-else
          class="space-y-3"
        >
          <div
            v-for="alert in alerts"
            :key="alert.id"
            class="flex items-start p-3 rounded-lg"
            :class="getAlertBgClass(alert.type)"
          >
            <Icon 
              :name="getAlertIcon(alert.type)"
              :class="`h-5 w-5 mt-0.5 ${getAlertIconClass(alert.type)}`"
            />
            <div class="ml-3 flex-1">
              <p class="text-sm font-medium" :class="getAlertTextClass(alert.type)">
                {{ alert.title }}
              </p>
              <p class="mt-1 text-sm" :class="getAlertContentClass(alert.type)">
                {{ alert.description }}
              </p>
              
              <!-- Action buttons -->
              <div v-if="alert.actions" class="mt-2 flex flex-wrap gap-2">
                <Button
                  v-for="(action, actionIndex) in alert.actions"
                  :key="actionIndex"
                  :variant="action.variant || 'outline'"
                  size="xs"
                  @click="$emit('alert-action', { alertId: alert.id, action: action.id })"
                >
                  {{ action.label }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Top categories -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <h4 class="text-base font-medium text-gray-900 dark:text-white mb-4">Category Distribution</h4>
        
        <div class="space-y-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center"
          >
            <div class="w-32 text-sm text-gray-600 dark:text-gray-400">{{ category.name }}</div>
            <div class="w-full">
              <div class="flex items-center">
                <div class="relative flex-1">
                  <div class="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                    <div 
                      class="h-2 rounded-full"
                      :class="category.color"
                      :style="{ width: `${category.percentage}%` }"
                    ></div>
                  </div>
                </div>
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Button from '~/components/ui/Button.vue';
  import EmptyState from '~/components/common/EmptyState.vue';
  import type { InventoryStat, AlertAction, InventoryAlert, InventoryCategory } from '~/types/dashboard';
  
  defineProps<{
    loading: boolean;
    inventoryStats: InventoryStat[];
    alerts: InventoryAlert[];
    categories: InventoryCategory[];
  }>();
  
  defineEmits(['view-inventory', 'alert-action']);
  
  // Helper methods for alert styling
  const getAlertBgClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case 'danger':
        return 'bg-red-50 dark:bg-red-900/20';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  const getAlertIconClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-500 dark:text-amber-400';
      case 'danger':
        return 'text-red-500 dark:text-red-400';
      case 'success':
        return 'text-green-500 dark:text-green-400';
      case 'info':
      default:
        return 'text-blue-500 dark:text-blue-400';
    }
  };
  
  const getAlertTextClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-800 dark:text-amber-300';
      case 'danger':
        return 'text-red-800 dark:text-red-300';
      case 'success':
        return 'text-green-800 dark:text-green-300';
      case 'info':
      default:
        return 'text-blue-800 dark:text-blue-300';
    }
  };
  
  const getAlertContentClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-700 dark:text-amber-200';
      case 'danger':
        return 'text-red-700 dark:text-red-200';
      case 'success':
        return 'text-green-700 dark:text-green-200';
      case 'info':
      default:
        return 'text-blue-700 dark:text-blue-200';
    }
  };
  
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return 'heroicons:exclamation-triangle';
      case 'danger':
        return 'heroicons:exclamation-circle';
      case 'success':
        return 'heroicons:check-circle';
      case 'info':
      default:
        return 'heroicons:information-circle';
    }
  };
  </script>