<!-- components/ui/Modal.vue -->
<template>
    <TransitionRoot as="template" :show="modelValue">
      <Dialog as="div" class="relative z-50" @close="$emit('update:modelValue', false)">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel 
                class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full" 
                :class="[sizeClass, maxSizeClass]"
              >
                <div v-if="showClose" class="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    class="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                    @click="$emit('update:modelValue', false)"
                  >
                    <span class="sr-only">Close</span>
                    <Icon name="heroicons:x-mark" class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div v-if="$slots.header || title" class="mb-4">
                  <slot name="header">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                      {{ title }}
                    </DialogTitle>
                  </slot>
                </div>
                
                <div>
                  <slot></slot>
                </div>
                
                <div v-if="$slots.footer" class="mt-5 sm:mt-6">
                  <slot name="footer"></slot>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
    },
    maxHeight: {
      type: String,
      default: 'none'
    },
    showClose: {
      type: Boolean,
      default: true
    }
  });
  
  defineEmits(['update:modelValue']);
  
  const sizeClass = computed(() => {
    const sizes = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
      '3xl': 'sm:max-w-3xl',
      '4xl': 'sm:max-w-4xl',
      '5xl': 'sm:max-w-5xl',
      '6xl': 'sm:max-w-6xl',
      '7xl': 'sm:max-w-7xl',
      full: 'sm:max-w-full sm:mx-4'
    };
    return sizes[props.size] || sizes.md;
  });
  
  const maxSizeClass = computed(() => {
    if (props.maxHeight === 'none') return '';
    
    const maxHeights = {
      xs: 'max-h-64',
      sm: 'max-h-80',
      md: 'max-h-96',
      lg: 'max-h-[32rem]',
      xl: 'max-h-[36rem]',
      '2xl': 'max-h-[42rem]',
      screen: 'max-h-screen'
    };
    
    return maxHeights[props.maxHeight] || '';
  });
  </script>