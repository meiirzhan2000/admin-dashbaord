<!-- components/contact/StatusBadge.vue -->
<template>
    <Badge :variant="statusVariant">
      {{ statusLabel }}
    </Badge>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import Badge from '~/components/ui/Badge.vue';
  
  const props = defineProps({
    status: {
      type: String,
      required: true,
      validator: (value) => ['open', 'in_progress', 'waiting', 'resolved', 'closed'].includes(value)
    }
  });
  
  const statusLabels = {
    open: 'Open',
    in_progress: 'In Progress',
    waiting: 'Waiting for Response',
    resolved: 'Resolved',
    closed: 'Closed'
  };
  
  const statusVariants = {
    open: 'blue',
    in_progress: 'purple',
    waiting: 'amber',
    resolved: 'green',
    closed: 'default'
  };
  
  const statusLabel = computed(() => {
    return statusLabels[props.status] || props.status;
  });
  
  const statusVariant = computed(() => {
    return statusVariants[props.status] || 'default';
  });
  </script>