<!-- components/settings/NotificationToggle.vue -->
<template>
    <div class="flex items-start">
      <div class="flex-1">
        <div class="flex items-center">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white">
            {{ title }}
          </h4>
        </div>
        <p v-if="description" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <button
        type="button"
        @click="toggleValue"
        :class="[
          modelValue ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
        ]"
        :aria-checked="modelValue"
      >
        <span
          :class="[
            modelValue ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
          ]"
        >
          <span
            :class="[
              modelValue ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
            ]"
            aria-hidden="true"
          >
            <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
              <path
                d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span
            :class="[
              modelValue ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
              'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
            ]"
            aria-hidden="true"
          >
            <svg class="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 12 12">
              <path
                d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
              />
            </svg>
          </span>
        </span>
      </button>
    </div>
  </template>
  
  [{     "resource": "/c:/Users/Meiirzhanb/Desktop/Projects/gaya-website/components/settings/AppearanceForm.vue",     "owner": "typescript",     "code": "2304",     "severity": 8,     "message": "Cannot find name 'emit'.",     "source": "ts-plugin",     "startLineNumber": 284,     "startColumn": 5,     "endLineNumber": 284,     "endColumn": 9 }]  [{     "resource": "/c:/Users/Meiirzhanb/Desktop/Projects/gaya-website/components/settings/NotificationsForm.vue",     "owner": "typescript",     "code": "2304",     "severity": 8,     "message": "Cannot find name 'emit'.",     "source": "ts-plugin",     "startLineNumber": 221,     "startColumn": 5,     "endLineNumber": 221,     "endColumn": 9 }] [{     "resource": "/c:/Users/Meiirzhanb/Desktop/Projects/gaya-website/components/settings/NotificationToggle.vue",     "owner": "typescript",     "code": "2304",     "severity": 8,     "message": "Cannot find name 'props'.",     "source": "ts-plugin",     "startLineNumber": 76,     "startColumn": 32,     "endLineNumber": 76,     "endColumn": 37 }] components\settings\NotificationToggle.vue provide changes that needs to apply only

  I need to fix the TypeScript error in the NotificationToggle.vue component. The issue is that it's trying to access props directly, but with the script setup syntax, you need to properly destructure props. Here's the fix for the NotificationToggle.vue component:
  
  
  components/settings/NotificationToggle.vue
  Code 
  The issue was that in NotificationToggle.vue, you were using props.modelValue but hadn't assigned the returned value from defineProps to a variable. In the script setup syntax, you need to store the result of defineProps in a variable to access the props:
  
  typescript
  // Wrong:
  defineProps<{...}>();
  // Later trying to use props.something - this won't work!
  
  // Correct:
  const props = defineProps<{...}>();
  // Now you can use props.something
  I've modified the script to correctly assign the props to a constant so you can reference them later. This is a common pattern needed when using Vue 3's script setup syntax with TypeScript.
  
  The same issue is likely present in the other components as well (AppearanceForm.vue and NotificationsForm.vue) - they appear to be referencing emit without having assigned the result of defineEmits to a variable. You'd need to fix those similarly by making sure you store the result:
  
  typescript
  // Fix for other components:
  const emit = defineEmits<{...}>();
  
  Tip:
  Long chats cause you to reach your usage limits faster.
  Start a new chat 
  
  
  
  <script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean;
    title: string;
    description?: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();
  
  const toggleValue = () => {
    emit('update:modelValue', !props.modelValue);
  };
  </script>