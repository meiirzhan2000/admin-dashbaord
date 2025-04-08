<!-- components/navigation/AppFooter.vue -->
<template>
    <footer class="bg-white dark:bg-gray-800 py-4 px-6 border-t border-gray-200 dark:border-gray-700">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ new Date().getFullYear() }} Your Company. All rights reserved.
        </p>
        
        <div class="mt-2 md:mt-0 flex space-x-4">
          <a href="#" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Terms of Service
          </a>
          <a href="#" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Privacy Policy
          </a>
          <a href="#" class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            Help Center
          </a>
        </div>
      </div>
    </footer>
  </template>