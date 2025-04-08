<template>
    <div>
      <h1 class="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Settings</h1>
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p class="text-gray-700 dark:text-gray-300">User profile and settings will go here.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({
    middleware: ['auth']
  });
  </script>