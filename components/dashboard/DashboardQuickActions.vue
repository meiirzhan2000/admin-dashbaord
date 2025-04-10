<!-- components/dashboard/DashboardQuickActions.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            v-for="action in actions"
            :key="action.id"
            class="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-600"
            @click="$emit('action-click', action.id)"
          >
            <div 
              class="flex items-center justify-center h-12 w-12 rounded-full mb-3"
              :class="action.bgColor"
            >
              <Icon :name="action.icon" :class="`h-6 w-6 ${action.iconColor}`" />
            </div>
            <span class="text-sm font-medium text-center text-gray-900 dark:text-white">{{ action.label }}</span>
          </button>
        </div>
      </div>
      
      <!-- Recent activities or tasks -->
      <div v-if="recentTasks.length > 0" class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <h4 class="text-base font-medium text-gray-900 dark:text-white mb-3">Recent Tasks</h4>
        
        <ul class="space-y-2">
          <li
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <div 
              class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
              :class="getTaskStatusColor(task.status)"
            >
              <Icon :name="getTaskStatusIcon(task.status)" class="h-4 w-4 text-white" />
            </div>
            
            <div class="ml-3 flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ task.title }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ task.dueDate ? `Due ${task.dueDate}` : 'No due date' }}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              @click="$emit('view-task', task.id)"
            >
              View
            </Button>
          </li>
        </ul>
        
        <div class="mt-3 text-center">
          <Button
            variant="link"
            size="sm"
            @click="$emit('view-all-tasks')"
          >
            View all tasks
          </Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Button from '~/components/ui/Button.vue';
  
  interface QuickAction {
    id: string;
    label: string;
    icon: string;
    bgColor: string;
    iconColor: string;
  }
  
  interface Task {
    id: number;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    dueDate?: string;
  }
  
  const props = defineProps<{
    actions: QuickAction[];
    recentTasks: Task[];
  }>();
  
  defineEmits(['action-click', 'view-task', 'view-all-tasks']);
  
  // Helper functions
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500 dark:bg-gray-600';
      case 'in_progress':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'completed':
        return 'bg-green-500 dark:bg-green-600';
      case 'overdue':
        return 'bg-red-500 dark:bg-red-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };
  
  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return 'heroicons:clock';
      case 'in_progress':
        return 'heroicons:play';
      case 'completed':
        return 'heroicons:check';
      case 'overdue':
        return 'heroicons:exclamation-triangle';
      default:
        return 'heroicons:clock';
    }
  };
  </script>