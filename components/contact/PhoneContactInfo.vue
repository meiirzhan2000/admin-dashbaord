<!-- components/contact/PhoneContactInfo.vue -->
<template>
    <div class="space-y-6">
      <div class="text-center sm:text-left">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Phone Support</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Contact our support team directly for immediate assistance with your account or orders.
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
          
          <div class="flex items-center">
            <div class="flex-1">
              <div class="text-lg font-medium text-gray-900 dark:text-white">
                {{ method.contactInfo }}
              </div>
            </div>
            <a 
              :href="`tel:${method.contactInfo.replace(/\D/g, '')}`" 
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              <Icon name="heroicons:phone" class="h-4 w-4 mr-2" />
              Call Now
            </a>
          </div>
        </div>
      </div>
      
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mt-8">
        <h4 class="text-base font-medium text-gray-900 dark:text-white mb-2">Hours of Operation</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Weekdays</h5>
            <p class="text-gray-600 dark:text-gray-400">Monday - Friday: 9am - 5pm EST</p>
          </div>
          <div>
            <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300">Weekends</h5>
            <p class="text-gray-600 dark:text-gray-400">Saturday: 10am - 2pm EST</p>
            <p class="text-gray-600 dark:text-gray-400">Sunday: Closed</p>
          </div>
        </div>
        <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md text-sm">
          <div class="flex">
            <Icon name="heroicons:information-circle" class="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Wait times may be longer during peak hours. For non-urgent issues, please consider submitting a support ticket.</p>
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