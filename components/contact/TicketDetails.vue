<!-- components/contact/TicketDetails.vue -->
<template>
    <div class="space-y-6">
      <!-- Ticket header information -->
      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ ticket.subject }}</h3>
            <div class="mt-1 flex items-center">
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Ticket ID: {{ ticket.ticketId }}
              </p>
              <span class="mx-2 text-gray-300 dark:text-gray-600">•</span>
              <StatusBadge :status="ticket.status" />
            </div>
          </div>
          <div class="flex flex-shrink-0 gap-2">
            <Button
              v-if="canSendEmail"
              variant="outline"
              left-icon="heroicons:envelope"
              @click="sendEmailUpdate"
            >
              Send Email Update
            </Button>
            <Button
              v-if="ticket.status !== 'closed'"
              variant="outline"
              left-icon="heroicons:x-mark"
              @click="closeTicket"
            >
              Close Ticket
            </Button>
          </div>
        </div>
        
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div class="text-gray-500 dark:text-gray-400">Category</div>
            <div class="font-medium text-gray-900 dark:text-white capitalize">
              {{ ticket.category.replace('_', ' ') }}
            </div>
          </div>
          
          <div>
            <div class="text-gray-500 dark:text-gray-400">Priority</div>
            <div class="font-medium text-gray-900 dark:text-white capitalize">
              {{ ticket.priority }}
            </div>
          </div>
          
          <div>
            <div class="text-gray-500 dark:text-gray-400">Created On</div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ formatDate(ticket.createdAt) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Original ticket description -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-2">Description</h4>
        <div class="bg-white dark:bg-gray-700 rounded-lg p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {{ ticket.description }}
        </div>
        
        <!-- Attachments if any -->
        <div v-if="ticket.attachments && ticket.attachments.length > 0" class="mt-4">
          <h5 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments:</h5>
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="(attachment, index) in ticket.attachments" 
              :key="index"
              class="flex items-center bg-gray-100 dark:bg-gray-600 px-3 py-2 rounded-md"
            >
              <Icon name="heroicons:paper-clip" class="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ attachment.name }}</span>
              <a 
                v-if="attachment.url" 
                :href="attachment.url" 
                download
                class="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                <Icon name="heroicons:arrow-down-tray" class="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Conversation thread -->
      <div>
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-2">Conversation</h4>
        
        <div class="space-y-4">
          <div
            v-for="(message, index) in ticket.messages"
            :key="index"
            :class="[
              'p-4 rounded-lg',
              message.isStaff 
                ? 'bg-indigo-50 dark:bg-indigo-900/30 ml-4 md:ml-8'
                : 'bg-gray-50 dark:bg-gray-800 mr-4 md:mr-8'
            ]"
          >
            <div class="flex justify-between items-start">
              <div class="flex items-center">
                <div class="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <Icon :name="message.isStaff ? 'heroicons:user-circle' : 'heroicons:user'" class="h-6 w-6" />
                </div>
                <div class="ml-2">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ message.isStaff ? 'Support Agent' : 'You' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(message.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Reply form -->
      <div v-if="ticket.status !== 'closed'">
        <h4 class="text-md font-medium text-gray-900 dark:text-white mb-2">Add Reply</h4>
        <div class="bg-white dark:bg-gray-700 rounded-lg p-4">
          <textarea
            v-model="replyMessage"
            rows="4"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
            placeholder="Type your reply here..."
          ></textarea>
          
          <div class="flex justify-end mt-4">
            <Button
              variant="primary"
              :disabled="!replyMessage.trim() || isSending"
              @click="sendReply"
            >
              <Icon v-if="isSending" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </div>
      
      <!-- Email Update Modal -->
      <Modal v-model="showEmailModal" title="Send Email Update" size="md">
        <form @submit.prevent="sendEmail" class="space-y-4">
          <div>
            <label for="email-subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              id="email-subject"
              v-model="emailForm.subject"
              type="text"
              class="appearance-none block w-full h-12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              :placeholder="`Re: ${ticket.subject}`"
            />
          </div>
          
          <div>
            <label for="email-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              id="email-message"
              v-model="emailForm.message"
              rows="5"
              class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter your email message"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              @click="showEmailModal = false"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              :disabled="!emailForm.message.trim() || isSendingEmail"
            >
              <Icon v-if="isSendingEmail" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-2" />
              Send Email
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { format, parseISO } from 'date-fns';
  import StatusBadge from '~/components/contact/StatusBadge.vue';
  import Button from '~/components/ui/Button.vue';
  import Modal from '~/components/ui/Modal.vue';
  
  const props = defineProps({
    ticket: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['add-reply', 'close']);
  
  // State
  const replyMessage = ref('');
  const isSending = ref(false);
  const showEmailModal = ref(false);
  const isSendingEmail = ref(false);
  const emailForm = ref({
    subject: '',
    message: ''
  });
  
  // Computed values
  const canSendEmail = true; // In a real app, this would be based on user permissions
  
  // Methods
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  const sendReply = async () => {
    if (!replyMessage.value.trim()) return;
    
    try {
      isSending.value = true;
      await emit('add-reply', props.ticket.id, {
        content: replyMessage.value,
        isStaff: false,
        timestamp: new Date().toISOString()
      });
      
      // Clear the reply field on successful submission
      replyMessage.value = '';
    } finally {
      isSending.value = false;
    }
  };
  
  const closeTicket = async () => {
    try {
      // In a real app, this would call an API to update the ticket status
      // For now we'll just close the modal
      emit('close');
    } catch (error) {
      console.error('Error closing ticket:', error);
    }
  };
  
  const sendEmailUpdate = () => {
    emailForm.value = {
      subject: `Re: ${props.ticket.subject}`,
      message: ''
    };
    showEmailModal.value = true;
  };
  
  const sendEmail = async () => {
    if (!emailForm.value.message.trim()) return;
    
    try {
      isSendingEmail.value = true;
      
      // In a real app, this would send an actual email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      useNuxtApp().$toast.success('Email sent successfully');
      showEmailModal.value = false;
    } catch (error) {
      useNuxtApp().$toast.error('Failed to send email: ' + (error.message || 'Unknown error'));
    } finally {
      isSendingEmail.value = false;
    }
  };
  </script>