<!-- components/ui/Button.vue -->
<template>
    <button
      :type="type"
      @click="$emit('click', $event)"
      :disabled="disabled"
      :class="[
        'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
        sizeClasses,
        variantClasses,
        rounded ? 'rounded-full' : 'rounded-md',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        fullWidth ? 'w-full' : '',
        className
      ]"
    >
      <Icon v-if="leftIcon" :name="leftIcon" class="h-4 w-4 mr-1.5 flex-shrink-0" />
      <slot></slot>
      <Icon v-if="rightIcon" :name="rightIcon" class="h-4 w-4 ml-1.5 flex-shrink-0" />
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => [
        'primary', 'secondary', 'danger', 'success', 'warning', 'info', 'outline', 'ghost', 'link'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    leftIcon: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  });
  
  defineEmits(['click']);
  
  const sizeClasses = computed(() => {
    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-4 py-2 text-base',
      xl: 'px-6 py-3 text-base'
    };
    return sizes[props.size] || sizes.md;
  });
  
  const variantClasses = computed(() => {
    const variants = {
      primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 shadow-sm',
      secondary: 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500 dark:focus:ring-offset-gray-800 shadow-sm',
      danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-gray-800 shadow-sm',
      success: 'text-white bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:focus:ring-offset-gray-800 shadow-sm',
      warning: 'text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-500 dark:focus:ring-offset-gray-800 shadow-sm',
      info: 'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-offset-gray-800 shadow-sm',
      outline: 'text-indigo-600 dark:text-indigo-400 bg-transparent border border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:ring-indigo-500 dark:focus:ring-offset-gray-800',
      ghost: 'text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 dark:focus:ring-offset-gray-800',
      link: 'text-indigo-600 dark:text-indigo-400 bg-transparent underline hover:text-indigo-800 dark:hover:text-indigo-300 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 shadow-none'
    };
    return variants[props.variant] || variants.primary;
  });
  </script>