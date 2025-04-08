<!-- components/faqs/FaqAccordionItem.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-all duration-200 ease-in-out">
      <button
        @click="$emit('toggle')"
        class="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-inset"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ faq.question }}</h3>
          <div>
            <Badge 
              v-if="faq.category" 
              :variant="getCategoryVariant(faq.category)"
              class="mr-3"
            >
              {{ faq.category }}
            </Badge>
            <Icon
              :name="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
              class="h-5 w-5 text-gray-500 dark:text-gray-400"
            />
          </div>
        </div>
      </button>
      <TransitionRoot
        as="template"
        :show="isOpen"
      >
        <div class="overflow-hidden transition-all duration-200 ease-in-out max-h-0" :style="isOpen ? 'max-height: 500px' : ''">
          <div class="px-6 pb-6 pt-0 border-t border-gray-200 dark:border-gray-700">
            <p class="mt-2 text-gray-700 dark:text-gray-300" v-html="faq.answer"></p>
            <FaqRelatedLinks v-if="faq.relatedLinks && faq.relatedLinks.length > 0" :links="faq.relatedLinks" class="mt-4" />
          </div>
        </div>
      </TransitionRoot>
    </div>
  </template>
  
  <script setup>
  import { TransitionRoot } from '@headlessui/vue';
  import Badge from '~/components/ui/Badge.vue';
  import FaqRelatedLinks from '~/components/faqs/FaqRelatedLinks.vue';
  
  const props = defineProps({
    faq: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    categoryColors: {
      type: Object,
      default: () => ({
        'Orders': 'purple',
        'Shipping': 'blue',
        'Returns': 'red',
        'Payments': 'green',
        'Products': 'amber',
        'Account': 'teal'
      })
    }
  });
  
  defineEmits(['toggle']);
  
  function getCategoryVariant(category) {
    return props.categoryColors[category] || 'default';
  }
  </script>