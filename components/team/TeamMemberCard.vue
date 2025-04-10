<!-- components/team/TeamMemberCard.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="p-4 sm:p-6">
        <!-- Header with user info and role badge -->
        <div class="flex items-start justify-between">
          <div class="flex items-center">
            <div class="relative">
              <img 
                v-if="member.avatar" 
                :src="member.avatar" 
                :alt="member.name"
                class="h-12 w-12 rounded-full object-cover border-2 border-white dark:border-gray-700"
              />
              <div 
                v-else 
                class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg"
              >
                {{ getInitials(member.name) }}
              </div>
              
              <!-- Online status indicator -->
              <div 
                class="absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800" 
                :class="member.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'"
              ></div>
            </div>
            
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ member.name }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ member.email }}
              </p>
            </div>
          </div>
          
          <Badge
            :variant="getRoleBadgeVariant(member.role)"
          >
            {{ member.role }}
          </Badge>
        </div>
        
        <!-- Member details -->
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500 dark:text-gray-400">Department</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ member.department }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">Joined</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(member.joinedDate) }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">Products</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ member.productsCount }}</p>
          </div>
          <div>
            <p class="text-gray-500 dark:text-gray-400">Last active</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatLastActive(member.lastActive) }}</p>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="mt-6 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            left-icon="heroicons:envelope"
            @click="$emit('contact', member)"
          >
            Contact
          </Button>
          
          <Button
            v-if="canManageTeam"
            variant="outline"
            size="sm"
            left-icon="heroicons:pencil-square"
            @click="$emit('edit', member)"
          >
            Edit
          </Button>
        </div>
      </div>
      
      <!-- Recent activity preview -->
      <div 
        v-if="member.recentActivity" 
        class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-600"
      >
        <div class="flex items-start">
          <Icon 
            :name="getActivityIcon(member.recentActivity.type)" 
            class="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5" 
          />
          <div class="ml-3">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              {{ member.recentActivity.description }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(member.recentActivity.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { format, formatDistanceToNow, parseISO } from 'date-fns';
  import Badge from '~/components/ui/Badge.vue';
  import Button from '~/components/ui/Button.vue';
  import { useAuthStore } from '~/stores/useAuthStore';
  
  interface Activity {
    id: number;
    type: string;
    description: string;
    timestamp: string;
  }
  
  interface TeamMember {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    department: string;
    joinedDate: string;
    productsCount: number;
    lastActive: string;
    isOnline: boolean;
    recentActivity?: Activity;
  }
  
  const props = defineProps<{
    member: TeamMember
  }>();
  
  defineEmits(['contact', 'edit']);
  
  const authStore = useAuthStore();
  
  // Check if the current user can manage team members
  const canManageTeam = computed(() => {
    return authStore.user?.role === 'admin' || authStore.user?.role === 'manager';
  });
  
  // Helper functions
  const getInitials = (name: string): string => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  const formatDate = (dateString: string): string => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const formatLastActive = (dateString: string): string => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  
  const getRoleBadgeVariant = (role: string): string => {
    const roleMap: Record<string, string> = {
      'admin': 'purple',
      'manager': 'blue',
      'editor': 'green',
      'viewer': 'default'
    };
    
    return roleMap[role.toLowerCase()] || 'default';
  };
  
  const getActivityIcon = (type: string): string => {
    const iconMap: Record<string, string> = {
      'product_added': 'heroicons:cube',
      'product_updated': 'heroicons:pencil-square',
      'login': 'heroicons:arrow-right-on-rectangle',
      'logout': 'heroicons:arrow-left-on-rectangle',
      'settings_changed': 'heroicons:cog-6-tooth'
    };
    
    return iconMap[type] || 'heroicons:information-circle';
  };
  </script>