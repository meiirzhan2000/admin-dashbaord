<!-- components/common/FilterTabs.vue -->
<template>
    <div class="mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          @click="$emit('update:modelValue', '')"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            modelValue === ''
              ? activeClasses
              : inactiveClasses
          ]"
        >
          All
        </button>
        <button
          v-for="option in options"
          :key="option.value || option"
          @click="$emit('update:modelValue', option.value || option)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            modelValue === (option.value || option)
              ? activeClasses
              : inactiveClasses
          ]"
        >
          {{ option.label || option }}
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      required: true
    },
    activeClasses: {
      type: String,
      default: 'bg-indigo-600 text-white'
    },
    inactiveClasses: {
      type: String,
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }
  });
  
  defineEmits(['update:modelValue']);
  </script>