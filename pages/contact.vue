<!-- pages/contact.vue -->
<template>
  <div>
    <!-- Page header -->
    <PageHeader title="Contact Support">
      <template #actions>
        <Button 
          v-if="isAuthenticated" 
          variant="primary" 
          left-icon="heroicons:ticket" 
          @click="openNewTicketModal"
        >
          New Support Ticket
        </Button>
      </template>
    </PageHeader>

    <!-- Main contact sections -->
    <div class="space-y-8">
      <!-- Support options tabs -->
      <SupportTabs v-model="activeTab" :tabs="supportTabs" />
      
      <!-- Support content based on selected tab -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <!-- Email Support Tab -->
        <div v-if="activeTab === 'email'" class="p-6">
          <div v-if="!isAuthenticated" class="text-center py-8">
            <Icon name="heroicons:lock-closed" class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" />
            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Authentication Required</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">Please log in to submit and view support tickets.</p>
            <div class="mt-6">
              <Button 
                variant="primary" 
                left-icon="heroicons:arrow-right-on-rectangle" 
                @click="navigateToLogin"
              >
                Log In
              </Button>
            </div>
          </div>
          
          <div v-else>
            <!-- Ticket listing tabs -->
            <div class="mb-6">
              <FilterTabs
                v-model="selectedTicketStatus"
                :options="ticketStatusOptions"
              />
            </div>
            
            <!-- Tickets list -->
            <TicketList 
              :tickets="filteredTickets" 
              :loading="ticketsLoading"
              @view-ticket="viewTicketDetails"
            />
          </div>
        </div>
        
        <!-- Phone Support Tab -->
        <div v-if="activeTab === 'phone'" class="p-6">
          <PhoneContactInfo :contact-methods="phoneContactMethods" />
        </div>
        
        <!-- Messaging Support Tab -->
        <div v-if="activeTab === 'messaging'" class="p-6">
          <MessagingContactInfo :contact-methods="messagingContactMethods" />
        </div>
      </div>
    </div>
    
    <!-- New Support Ticket Modal -->
    <Modal
      v-model="showNewTicketModal"
      title="Create Support Ticket"
      size="lg"
    >
      <SupportTicketForm 
        @submit="submitTicket" 
        @cancel="closeNewTicketModal" 
      />
    </Modal>
    
    <!-- Ticket Details Modal -->
    <Modal
      v-model="showTicketDetailsModal"
      title="Ticket Details"
      size="lg"
    >
      <TicketDetails 
        v-if="selectedTicket"
        :ticket="selectedTicket"
        @add-reply="addTicketReply"
        @close="closeTicketDetailsModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/useAuthStore';
import { useTicketStore } from '~/stores/useTicketStore';

// Import components
import PageHeader from '~/components/common/PageHeader.vue';
import Button from '~/components/ui/Button.vue';
import FilterTabs from '~/components/common/FilterTabs.vue';
import Modal from '~/components/ui/Modal.vue';
import SupportTabs from '~/components/contact/SupportTabs.vue';
import TicketList from '~/components/contact/TicketList.vue';
import SupportTicketForm from '~/components/contact/SupportTicketForm.vue';
import TicketDetails from '~/components/contact/TicketDetails.vue';
import PhoneContactInfo from '~/components/contact/PhoneContactInfo.vue';
import MessagingContactInfo from '~/components/contact/MessagingContactInfo.vue';

definePageMeta({
  middleware: ['auth']
});

const router = useRouter();
const authStore = useAuthStore();
const ticketStore = useTicketStore();

// Auth state
const isAuthenticated = computed(() => !!authStore.user);

// Support tab state
const activeTab = ref('email');
const supportTabs = [
  { id: 'email', label: 'Email Support', icon: 'heroicons:envelope' },
  { id: 'phone', label: 'Phone Support', icon: 'heroicons:phone' },
  { id: 'messaging', label: 'Messaging', icon: 'heroicons:chat-bubble-left-right' }
];

// Ticket state
const showNewTicketModal = ref(false);
const showTicketDetailsModal = ref(false);
const selectedTicket = ref(null);
const selectedTicketStatus = ref('');
const ticketsLoading = ref(false);

const ticketStatusOptions = [
  { value: '', label: 'All Tickets' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting', label: 'Waiting for Response' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
];

// Contact information
const phoneContactMethods = [
  {
    title: 'Customer Support',
    description: 'Available Monday to Friday, 9am - 5pm EST',
    contactInfo: '+1 (555) 123-4567',
    icon: 'heroicons:phone'
  },
  {
    title: 'Technical Support',
    description: 'Available Monday to Friday, 8am - 8pm EST',
    contactInfo: '+1 (555) 987-6543',
    icon: 'heroicons:wrench-screwdriver'
  }
];

const messagingContactMethods = [
  {
    title: 'WhatsApp Support',
    description: 'Fast responses during business hours',
    contactInfo: '+1 (555) 123-4567',
    icon: 'heroicons:chat-bubble-left-ellipsis',
    linkUrl: 'https://wa.me/15551234567',
    linkText: 'Start WhatsApp Chat'
  },
  {
    title: 'Telegram Support',
    description: '24/7 bot assistance with live agent follow-up',
    contactInfo: '@YourStoreSupportBot',
    icon: 'heroicons:paper-airplane',
    linkUrl: 'https://t.me/YourStoreSupportBot',
    linkText: 'Message on Telegram'
  }
];

// Computed
const filteredTickets = computed(() => {
  if (!selectedTicketStatus.value) {
    return ticketStore.tickets;
  }
  return ticketStore.tickets.filter(ticket => ticket.status === selectedTicketStatus.value);
});

// Methods
onMounted(async () => {
  if (isAuthenticated.value) {
    ticketsLoading.value = true;
    await ticketStore.fetchTickets();
    ticketsLoading.value = false;
  }
});

const navigateToLogin = () => {
  router.push('/login');
};

const openNewTicketModal = () => {
  showNewTicketModal.value = true;
};

const closeNewTicketModal = () => {
  showNewTicketModal.value = false;
};

const submitTicket = async (ticketData) => {
  try {
    await ticketStore.createTicket(ticketData);
    closeNewTicketModal();
    useNuxtApp().$toast.success('Support ticket submitted successfully');
  } catch (error) {
    useNuxtApp().$toast.error('Failed to submit ticket: ' + (error.message || 'Unknown error'));
  }
};

const viewTicketDetails = (ticket) => {
  selectedTicket.value = ticket;
  showTicketDetailsModal.value = true;
};

const closeTicketDetailsModal = () => {
  showTicketDetailsModal.value = false;
  selectedTicket.value = null;
};

const addTicketReply = async (ticketId, replyData) => {
  try {
    await ticketStore.addReply(ticketId, replyData);
    useNuxtApp().$toast.success('Reply added successfully');
    
    // Refresh the selected ticket data
    const updatedTicket = ticketStore.getTicketById(ticketId);
    if (updatedTicket) {
      selectedTicket.value = { ...updatedTicket };
    }
  } catch (error) {
    useNuxtApp().$toast.error('Failed to add reply: ' + (error.message || 'Unknown error'));
  }
};
</script>