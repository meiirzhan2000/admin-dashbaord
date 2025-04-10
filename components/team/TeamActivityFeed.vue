<!-- components/team/TeamActivityFeed.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Team Activity</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Recent actions and updates from your team members
        </p>
      </div>
      
      <div class="flow-root px-4 py-5 sm:px-6">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        
        <EmptyState
          v-else-if="activities.length === 0"
          icon="heroicons:clock"
          message="No recent activity to display"
        />
        
        <ul v-else role="list" class="-mb-8">
          <li v-for="(activity, activityIdx) in activities" :key="activity.id">
            <div class="relative pb-8">
              <span 
                v-if="activityIdx !== activities.length - 1" 
                class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                aria-hidden="true"
              ></span>
              
              <div class="relative flex items-start space-x-3">
                <!-- Activity icon -->
                <div>
                  <div 
                    class="relative px-1 h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800"
                    :class="[getActivityColor(activity.type)]"
                  >
                    <Icon :name="getActivityIcon(activity.type)" class="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                </div>
                
                <!-- Activity content -->
                <div class="flex-1 min-w-0">
                  <div>
                    <div class="text-sm">
                      <a 
                        href="#" 
                        class="font-medium text-gray-900 dark:text-white"
                        @click.prevent="$emit('view-user', activity.userId)"
                      >
                        {{ activity.userName }}
                      </a>
                    </div>
                    <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(activity.timestamp) }}
                    </p>
                  </div>
                  
                  <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>{{ activity.description }}</p>
                  </div>
                  
                  <!-- Optional target link -->
                  <div v-if="activity.target" class="mt-2">
                    <a
                      :href="activity.target.link"
                      class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                    >
                      <Icon :name="activity.target.icon || 'heroicons:arrow-top-right-on-square'" class="h-4 w-4 mr-1" />
                      {{ activity.target.text }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Load more button -->
      <div v-if="activities.length > 0 && hasMoreActivities" class="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          full-width
          :disabled="loadingMore"
          @click="$emit('load-more')"
        >
          <Icon v-if="loadingMore" name="heroicons:arrow-path" class="h-4 w-4 mr-2 animate-spin" />
          {{ loadingMore ? 'Loading more...' : 'Load more activities' }}
        </Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { format, formatDistanceToNow, parseISO } from 'date-fns';
  import EmptyState from '~/components/common/EmptyState.vue';
  import Button from '~/components/ui/Button.vue';
  
  interface ActivityTarget {
    text: string;
    link: string;
    icon?: string;
  }
  
  interface TeamActivity {
    id: number;
    type: string;
    userId: number;
    userName: string;
    description: string;
    timestamp: string;
    target?: ActivityTarget;
  }
  
  const props = defineProps<{
    activities: TeamActivity[];
    loading: boolean;
    loadingMore: boolean;
    hasMoreActivities: boolean;
  }>();
  
  defineEmits(['load-more', 'view-user']);
  
  // Helper functions
  const formatDate = (dateString: string): string => {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      
      // If it's today, show a relative time (3 hours ago)
      if (date.getDate() === now.getDate() && 
          date.getMonth() === now.getMonth() && 
          date.getFullYear() === now.getFullYear()) {
        return formatDistanceToNow(date, { addSuffix: true });
      }
      
      // Otherwise, show the actual date
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };
  
  const getActivityIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      'product_added': 'heroicons:cube-plus',
      'product_updated': 'heroicons:pencil-square',
      'product_deleted': 'heroicons:trash',
      'login': 'heroicons:arrow-right-on-rectangle',
      'logout': 'heroicons:arrow-left-on-rectangle',
      'settings_changed': 'heroicons:cog-6-tooth',
      'user_invited': 'heroicons:user-plus',
      'user_role_changed': 'heroicons:user-circle',
      'comment_added': 'heroicons:chat-bubble-left-ellipsis'
    };
    
    return iconMap[type] || 'heroicons:information-circle';
  };
  
  const getActivityColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'product_added': 'bg-green-600',
      'product_updated': 'bg-blue-600',
      'product_deleted': 'bg-red-600',
      'login': 'bg-indigo-600',
      'logout': 'bg-gray-600',
      'settings_changed': 'bg-amber-600',
      'user_invited': 'bg-purple-600',
      'user_role_changed': 'bg-teal-600',
      'comment_added': 'bg-pink-600'
    };
    
    return colorMap[type] || 'bg-gray-600';
  };
  </script>