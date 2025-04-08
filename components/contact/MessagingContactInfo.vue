<!-- components/contact/MessagingContactInfo.vue -->
<template>
    <div class="space-y-6">
      <div class="text-center sm:text-left">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Messaging Support</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get fast support through your favorite messaging apps. Our team is ready to help with your questions.
        </p>
      </div>
      
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div 
          v-for="(method, index) in contactMethods" 
          :key="index"
          class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 transition hover:shadow-md"
        >
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Icon :name="method.icon" class="h-6 w-6" />
            </div>
            <div class="ml-4">
              <h4 class="text-base font-medium text-gray-900 dark:text-white">{{ method.title }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ method.description }}</p>
            </div>
          </div>
          
          <div class="mb-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">Contact ID</div>
            <div class="text-base font-medium text-gray-900 dark:text-white">
              {{ method.contactInfo }}
            </div>
          </div>
          
          <div class="flex justify-end">
            <a 
              v-if="method.linkUrl"
              :href="method.linkUrl" 
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              <Icon :name="method.icon" class="h-4 w-4 mr-2" />
              {{ method.linkText || 'Start Chat' }}
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-8">
        <h4 class="text-base font-medium text-gray-900 dark:text-white mb-4">Messaging Support Tips</h4>
        
        <ul class="space-y-3 text-gray-600 dark:text-gray-400">
          <li class="flex items-start">
            <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
            <span>Include your order number or account ID for faster assistance</span>
          </li>
          <li class="flex items-start">
            <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
            <span>Send screenshots of any errors you're experiencing</span>
          </li>
          <li class="flex items-start">
            <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
            <span>For complex issues, consider opening a support ticket instead</span>
          </li>
          <li class="flex items-start">
            <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
            <span>Our automated assistant can help with common questions instantly</span>
          </li>
        </ul>
        
        <div class="mt-6 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-sm">
          <div class="flex">
            <Icon name="heroicons:information-circle" class="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Live chat is currently unavailable. The messaging services listed above are fully operational, and we strive to respond to all messages within 4 business hours.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    contactMethods: {
      type: Array,
      required: true
    }
  });
  </script>