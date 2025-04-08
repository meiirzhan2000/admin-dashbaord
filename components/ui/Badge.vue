<!-- components/ui/Badge.vue -->
<template>
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="computedClasses"
    >
      <slot></slot>
    </span>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'default',
      validator: (value) => [
        'default', 'primary', 'success', 'warning', 'danger', 
        'purple', 'blue', 'red', 'green', 'amber', 'teal', 'custom'
      ].includes(value)
    },
    customClasses: {
      type: String,
      default: ''
    }
  });
  
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
    primary: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300',
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
    purple: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    red: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
    green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    amber: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300',
    teal: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-300'
  };
  
  const computedClasses = computed(() => {
    if (props.variant === 'custom' && props.customClasses) {
      return props.customClasses;
    }
    return variantClasses[props.variant] || variantClasses.default;
  });
  </script>