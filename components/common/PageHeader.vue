<!-- components/common/PageHeader.vue -->
<template>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ title }}</h1>
      <div v-if="$slots.actions" class="mt-4 sm:mt-0">
        <slot name="actions"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      required: true
    }
  });
  </script>