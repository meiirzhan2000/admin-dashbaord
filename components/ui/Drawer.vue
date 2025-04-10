<!-- components/ui/Drawer.vue -->
<template>
    <TransitionRoot :show="modelValue" as="template">
      <Dialog as="div" class="relative z-50" @close="$emit('update:modelValue', false)">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div :class="[
              'pointer-events-none fixed inset-y-0 flex max-w-full',
              position === 'right' ? 'right-0 pl-10' : 'left-0 pr-10'
            ]">
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-300"
                :enter-from="position === 'right' ? 'translate-x-full' : '-translate-x-full'"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leave-from="translate-x-0"
                :leave-to="position === 'right' ? 'translate-x-full' : '-translate-x-full'"
              >
                <DialogPanel class="pointer-events-auto w-screen" :class="[sizeClass]">
                  <div class="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-800 shadow-xl">
                    <div class="px-4 sm:px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                      <div class="flex items-start justify-between">
                        <DialogTitle class="text-lg font-medium text-gray-900 dark:text-white">
                          {{ title }}
                        </DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            class="rounded-md bg-white dark:bg-transparent text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            @click="$emit('update:modelValue', false)"
                          >
                            <span class="sr-only">Close panel</span>
                            <Icon name="heroicons:x-mark" class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="relative flex-1">
                      <slot></slot>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild
  } from '@headlessui/vue';
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Drawer'
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
    },
    position: {
      type: String,
      default: 'right',
      validator: (value) => ['left', 'right'].includes(value)
    }
  });
  
  defineEmits(['update:modelValue']);
  
  // Compute size class based on prop
  const sizeClass = computed(() => {
    const sizes = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-xl',
      xl: 'max-w-2xl',
      full: 'max-w-full'
    };
    
    return sizes[props.size] || sizes.md;
  });
  </script>