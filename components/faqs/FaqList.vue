<!-- components/faqs/FaqList.vue -->
<template>
    <div class="space-y-4">
      <TransitionGroup name="list">
        <FaqAccordionItem
          v-for="faq in faqs"
          :key="faq.id"
          :faq="faq"
          :is-open="openFaqIds.includes(faq.id)"
          @toggle="toggleFaq(faq.id)"
        />
      </TransitionGroup>
      
      <EmptyState
        v-if="faqs.length === 0"
        icon="heroicons:question-mark-circle"
        :message="emptyStateMessage"
        action-label="Reset Filters"
        action-icon="heroicons:arrow-path"
        @action="$emit('reset-filters')"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import FaqAccordionItem from '~/components/faqs/FaqAccordionItem.vue';
  import EmptyState from '~/components/common/EmptyState.vue';
  
  const props = defineProps({
    faqs: {
      type: Array,
      required: true
    },
    emptyStateMessage: {
      type: String,
      default: 'No FAQs found matching your search criteria.'
    }
  });
  
  defineEmits(['reset-filters']);
  
  const openFaqIds = ref([]);
  
  const toggleFaq = (id) => {
    const index = openFaqIds.value.indexOf(id);
    if (index === -1) {
      openFaqIds.value.push(id);
    } else {
      openFaqIds.value.splice(index, 1);
    }
  };
  
  // Close all FAQs when the list changes (e.g., due to filtering)
  watch(() => props.faqs, () => {
    openFaqIds.value = [];
  }, { deep: true });
  </script>
  
  <style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>