<!-- components/settings/NotificationsForm.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage how you receive notifications and updates
        </p>
      </div>
      
      <form @submit.prevent="$emit('submit', preferences)" class="p-6">
        <!-- Email notifications -->
        <div class="space-y-6">
          <div>
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Email Notifications</h4>
            
            <div class="space-y-3">
              <NotificationToggle 
                v-for="(option, index) in emailOptions" 
                :key="`email-${index}`"
                v-model="preferences.email[option.key]"
                :title="option.title"
                :description="option.description"
              />
            </div>
          </div>
          
          <!-- Push notifications -->
          <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Push Notifications</h4>
            
            <div class="space-y-3">
              <NotificationToggle 
                v-for="(option, index) in pushOptions" 
                :key="`push-${index}`"
                v-model="preferences.push[option.key]"
                :title="option.title"
                :description="option.description"
              />
            </div>
          </div>
          
          <!-- Notification digest -->
          <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Notification Summary</h4>
            
            <div class="mt-1 space-y-4">
              <div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="enableDigest"
                      v-model="preferences.digestEnabled"
                      type="checkbox"
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                  <div class="ml-3">
                    <label for="enableDigest" class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Receive a daily digest of notifications
                    </label>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Instead of individual notifications, get a daily summary of all activities.
                    </p>
                  </div>
                </div>
              </div>
              
              <div v-if="preferences.digestEnabled">
                <label for="digestTime" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Delivery Time
                </label>
                <select
                  id="digestTime"
                  v-model="preferences.digestTime"
                  class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                >
                  <option v-for="hour in 24" :key="hour" :value="formatHour(hour - 1)">
                    {{ formatHour(hour - 1) }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  All times are in your local timezone.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Mobile app settings -->
          <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile Settings</h4>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                <span class="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
                Connected
              </span>
            </div>
            
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your mobile app notification preferences.
            </p>
            
            <div class="mt-4">
              <Button
                variant="outline"
                size="sm"
                left-icon="heroicons:device-phone-mobile"
              >
                Manage Mobile App Settings
              </Button>
            </div>
          </div>
        </div>
        
        <!-- Action buttons -->
        <div class="mt-8 flex justify-end space-x-3 pt-5 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            @click="resetPreferences"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, toRefs } from 'vue';
  import Button from '~/components/ui/Button.vue';
  import NotificationToggle from './NotificationToggle.vue';
  
  interface NotificationOption {
    key: string;
    title: string;
    description: string;
  }
  
  interface NotificationPreferences {
    email: Record<string, boolean>;
    push: Record<string, boolean>;
    digestEnabled: boolean;
    digestTime: string;
  }
  
  const props = defineProps<{
    initialPreferences: NotificationPreferences;
    isSubmitting: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: 'submit', data: NotificationPreferences): void;
    (e: 'reset'): void;
  }>();
  
  const { initialPreferences } = toRefs(props);
  
  // Create a deep copy of the preferences to avoid modifying props directly
  const preferences = ref<NotificationPreferences>(JSON.parse(JSON.stringify(initialPreferences.value)));
  
  // Email notification options
  const emailOptions: NotificationOption[] = [
    {
      key: 'productUpdates',
      title: 'Product Updates',
      description: 'Get notified when products are added, updated, or removed'
    },
    {
      key: 'orderStatus',
      title: 'Order Status',
      description: 'Receive updates when orders are placed, shipped, or delivered'
    },
    {
      key: 'inventoryAlerts',
      title: 'Inventory Alerts',
      description: 'Be alerted when inventory is running low or out of stock'
    },
    {
      key: 'marketing',
      title: 'Marketing & Promotions',
      description: 'Receive newsletters, promotions, and special offers'
    }
  ];
  
  // Push notification options
  const pushOptions: NotificationOption[] = [
    {
      key: 'productUpdates',
      title: 'Product Updates',
      description: 'Get notified when products are added, updated, or removed'
    },
    {
      key: 'orderStatus',
      title: 'Order Status',
      description: 'Receive updates when orders are placed, shipped, or delivered'
    },
    {
      key: 'inventoryAlerts',
      title: 'Inventory Alerts',
      description: 'Be alerted when inventory is running low or out of stock'
    },
    {
      key: 'messages',
      title: 'Chat Messages',
      description: 'Get notified when you receive a new message or chat request'
    }
  ];
  
  // Reset form to initial values
  const resetPreferences = () => {
    preferences.value = JSON.parse(JSON.stringify(initialPreferences.value));
    emit('reset');
  };
  
  // Format hours for the time dropdown
  const formatHour = (hour: number): string => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
  };
  </script>