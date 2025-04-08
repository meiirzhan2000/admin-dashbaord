// stores/useTicketStore.js
import { defineStore } from 'pinia';

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    tickets: [
      {
        id: 1,
        ticketId: 'TKT-2025-001',
        subject: 'Unable to upload product images',
        description: 'I\'ve been trying to upload images for my new clothing line but keep getting an error message. The error says "File size exceeds maximum limit" but the files are under 2MB, which should be within the allowed size.',
        category: 'products',
        priority: 'high',
        status: 'open',
        createdAt: '2025-04-01T10:23:45Z',
        updatedAt: '2025-04-01T10:23:45Z',
        attachments: [
          { name: 'error-screenshot.jpg', size: 245000, type: 'image/jpeg' }
        ],
        messages: [
          {
            content: 'I\'ve been trying to upload images for my new clothing line but keep getting an error message. The error says "File size exceeds maximum limit" but the files are under 2MB, which should be within the allowed size.',
            isStaff: false,
            timestamp: '2025-04-01T10:23:45Z'
          }
        ]
      },
      {
        id: 2,
        ticketId: 'TKT-2025-002',
        subject: 'Discount code not applying correctly',
        description: 'I created a discount code for 15% off all shirts, but customers are reporting that it\'s not applying properly. The discount only works on some shirts but not others.',
        category: 'products',
        priority: 'medium',
        status: 'in_progress',
        createdAt: '2025-04-02T14:15:30Z',
        updatedAt: '2025-04-03T09:45:12Z',
        attachments: [],
        messages: [
          {
            content: 'I created a discount code for 15% off all shirts, but customers are reporting that it\'s not applying properly. The discount only works on some shirts but not others.',
            isStaff: false,
            timestamp: '2025-04-02T14:15:30Z'
          },
          {
            content: 'Thank you for reporting this issue. I\'ve checked your discount settings and found that the code is only set to apply to the "T-shirts" category but not to "Dress shirts" or "Polo shirts". Would you like me to update the settings to include all shirt types?',
            isStaff: true,
            timestamp: '2025-04-03T09:45:12Z'
          }
        ]
      },
      {
        id: 3,
        ticketId: 'TKT-2025-003',
        subject: 'How to implement size guide',
        description: 'I want to add a size guide to my store to help customers choose the right size. Is there a built-in feature for this or do I need to create a custom page?',
        category: 'technical',
        priority: 'low',
        status: 'waiting',
        createdAt: '2025-04-05T11:30:20Z',
        updatedAt: '2025-04-06T15:22:18Z',
        attachments: [],
        messages: [
          {
            content: 'I want to add a size guide to my store to help customers choose the right size. Is there a built-in feature for this or do I need to create a custom page?',
            isStaff: false,
            timestamp: '2025-04-05T11:30:20Z'
          },
          {
            content: 'Yes, we do have a built-in size guide feature. You can access it by going to Products > Settings > Size Guide. From there, you can create different size charts for different product categories. Would you like me to provide step-by-step instructions on how to set this up?',
            isStaff: true,
            timestamp: '2025-04-05T13:45:12Z'
          },
          {
            content: 'That would be great! Please send me detailed instructions on how to set up size guides for different product types (shirts, pants, dresses, etc.).',
            isStaff: false,
            timestamp: '2025-04-06T15:22:18Z'
          }
        ]
      },
      {
        id: 4,
        ticketId: 'TKT-2025-004',
        subject: 'Order fulfillment integration with warehouse',
        description: 'We recently switched to a new warehouse partner and need to integrate their system with our store for automatic order fulfillment and inventory updates. Their system supports API integration.',
        category: 'technical',
        priority: 'high',
        status: 'resolved',
        createdAt: '2025-03-28T09:15:44Z',
        updatedAt: '2025-04-02T16:38:25Z',
        attachments: [
          { name: 'api-documentation.pdf', size: 1458000, type: 'application/pdf' }
        ],
        messages: [
          {
            content: 'We recently switched to a new warehouse partner and need to integrate their system with our store for automatic order fulfillment and inventory updates. Their system supports API integration. I\'ve attached their API documentation.',
            isStaff: false,
            timestamp: '2025-03-28T09:15:44Z'
          },
          {
            content: 'Thank you for providing the API documentation. I\'ve reviewed it and I\'m happy to inform you that we can set up this integration. We\'ll need to create API credentials in your warehouse partner\'s system and then configure those in our platform. Would you like to schedule a call to complete this setup together?',
            isStaff: true,
            timestamp: '2025-03-29T10:20:33Z'
          },
          {
            content: 'Yes, that would be helpful. I\'m available next Tuesday afternoon if that works for you.',
            isStaff: false,
            timestamp: '2025-03-30T14:05:19Z'
          },
          {
            content: 'Perfect! I\'ve scheduled a call for next Tuesday at 2pm EST. You\'ll receive a calendar invitation with the meeting details shortly. In the meantime, please make sure you have admin access to your warehouse partner\'s system so we can create the necessary API keys during the call.',
            isStaff: true,
            timestamp: '2025-03-31T09:12:57Z'
          },
          {
            content: 'The integration has been completed successfully. Your orders will now automatically sync with your warehouse system, and inventory levels will update in real-time. Please let us know if you encounter any issues or have questions about the integration.',
            isStaff: true,
            timestamp: '2025-04-02T16:38:25Z'
          }
        ]
      },
      {
        id: 5,
        ticketId: 'TKT-2025-005',
        subject: 'Request for bulk product import feature',
        description: 'I need to upload hundreds of products to my store. Is there a way to do this in bulk rather than adding them one by one?',
        category: 'products',
        priority: 'medium',
        status: 'closed',
        createdAt: '2025-03-15T16:43:22Z',
        updatedAt: '2025-03-20T11:30:17Z',
        attachments: [],
        messages: [
          {
            content: 'I need to upload hundreds of products to my store. Is there a way to do this in bulk rather than adding them one by one?',
            isStaff: false,
            timestamp: '2025-03-15T16:43:22Z'
          },
          {
            content: 'Yes, we offer a bulk import feature. You can download our Excel template, fill it with your product data, and then upload it through the Products > Import section. Would you like me to send you the template and instructions?',
            isStaff: true,
            timestamp: '2025-03-16T10:15:45Z'
          },
          {
            content: 'That would be great, please send the template and instructions.',
            isStaff: false,
            timestamp: '2025-03-16T14:22:37Z'
          },
          {
            content: 'I\'ve attached the template and a detailed guide to help you with the bulk import process. Please let me know if you have any questions after reviewing the materials.',
            isStaff: true,
            timestamp: '2025-03-17T09:05:21Z'
          },
          {
            content: 'Thank you! I was able to successfully import all my products using the template. This is exactly what I needed.',
            isStaff: false,
            timestamp: '2025-03-20T11:30:17Z'
          }
        ]
      }
    ],
    isLoading: false,
    error: null
  }),
  
  getters: {
    allTickets: (state) => state.tickets,
    
    getTicketById: (state) => (id) => {
      return state.tickets.find(ticket => ticket.id === id) || null;
    },
    
    ticketsByStatus: (state) => (status) => {
      if (!status) return state.tickets;
      return state.tickets.filter(ticket => ticket.status === status);
    },
    
    ticketsByPriority: (state) => (priority) => {
      if (!priority) return state.tickets;
      return state.tickets.filter(ticket => ticket.priority === priority);
    },
    
    openTickets: (state) => {
      return state.tickets.filter(ticket => ticket.status !== 'closed' && ticket.status !== 'resolved');
    },
    
    closedTickets: (state) => {
      return state.tickets.filter(ticket => ticket.status === 'closed' || ticket.status === 'resolved');
    }
  },
  
  actions: {
    // In a real app, these would make API calls
    async fetchTickets() {
      try {
        this.isLoading = true;
        // In a real app: const response = await api.get('/tickets');
        // this.tickets = response.data;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        this.isLoading = false;
      } catch (error) {
        this.error = error.message || 'Failed to fetch tickets';
        this.isLoading = false;
      }
    },
    
    async createTicket(ticketData) {
      try {
        this.isLoading = true;
        // In a real app: const response = await api.post('/tickets', ticketData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate a new ID and ticket ID (in a real app, the server would do this)
        const newId = Math.max(...this.tickets.map(t => t.id), 0) + 1;
        const ticketId = `TKT-2025-${String(100 + newId).substring(1)}`;
        
        const now = new Date().toISOString();
        
        // Add the new ticket to the store
        this.tickets.unshift({
          id: newId,
          ticketId,
          subject: ticketData.subject,
          description: ticketData.description,
          category: ticketData.category,
          priority: ticketData.priority,
          status: 'open',
          createdAt: now,
          updatedAt: now,
          attachments: ticketData.attachments || [],
          messages: [
            {
              content: ticketData.description,
              isStaff: false,
              timestamp: now
            }
          ]
        });
        
        this.isLoading = false;
        return newId;
      } catch (error) {
        this.error = error.message || 'Failed to create ticket';
        this.isLoading = false;
        throw error;
      }
    },
    
    async addReply(ticketId, replyData) {
      try {
        this.isLoading = true;
        // In a real app: const response = await api.post(`/tickets/${ticketId}/replies`, replyData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the ticket and add the reply
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
          ticket.messages.push(replyData);
          ticket.updatedAt = new Date().toISOString();
          
          // Update ticket status if user replied to a waiting ticket
          if (ticket.status === 'waiting' && !replyData.isStaff) {
            ticket.status = 'in_progress';
          }
        }
        
        this.isLoading = false;
      } catch (error) {
        this.error = error.message || 'Failed to add reply';
        this.isLoading = false;
        throw error;
      }
    },
    
    async updateTicketStatus(ticketId, status) {
      try {
        this.isLoading = true;
        // In a real app: await api.patch(`/tickets/${ticketId}`, { status });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update the ticket status
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (ticket) {
          ticket.status = status;
          ticket.updatedAt = new Date().toISOString();
        }
        
        this.isLoading = false;
      } catch (error) {
        this.error = error.message || 'Failed to update ticket status';
        this.isLoading = false;
        throw error;
      }
    }
  }
});