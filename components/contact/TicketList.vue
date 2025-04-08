<!-- components/contact/TicketList.vue -->
<template>
    <div>
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
      
      <!-- Empty state -->
      <EmptyState
        v-else-if="tickets.length === 0"
        icon="heroicons:ticket"
        message="No support tickets found"
      >
        <template #action>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Need help? Create a new support ticket to get assistance from our team.
          </p>
        </template>
      </EmptyState>
      
      <!-- Tickets list -->
      <div v-else class="overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date Created
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr 
                v-for="ticket in tickets" 
                :key="ticket.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ ticket.ticketId }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ ticket.subject }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <StatusBadge :status="ticket.status" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDate(ticket.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ formatDate(ticket.updatedAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="link"
                    @click="$emit('view-ticket', ticket)"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { format, parseISO } from 'date-fns';
  import EmptyState from '~/components/common/EmptyState.vue';
  import StatusBadge from '~/components/contact/StatusBadge.vue';
  import Button from '~/components/ui/Button.vue';
  
  defineProps({
    tickets: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['view-ticket']);
  
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  </script>