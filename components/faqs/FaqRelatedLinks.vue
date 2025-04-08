<!-- components/faqs/FaqRelatedLinks.vue -->
<template>
    <div>
      <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Related Resources:</p>
      <ul class="mt-2 space-y-1">
        <li v-for="(link, linkIndex) in links" :key="linkIndex">
          <a
            :href="link.url"
            class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm flex items-center"
          >
            <Icon name="heroicons:link" class="h-4 w-4 mr-1" />
            {{ link.title }}
          </a>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  defineProps({
    links: {
      type: Array,
      required: true
    }
  });
  </script>