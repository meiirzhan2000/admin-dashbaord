// stores/useFaqStore.js
import { defineStore } from 'pinia';

export const useFaqStore = defineStore('faq', {
  state: () => ({
    faqs: [
      {
        id: 1,
        question: 'How do I manage inventory for different sizes and colors?',
        answer: 'To manage inventory for different sizes and colors, navigate to the <strong>Products</strong> section and select the item you want to manage. Click on "Manage Variants" to adjust inventory levels for each size and color combination. You can also set up alerts for low stock items and enable automatic reordering.',
        category: 'Products',
        relatedLinks: [
          { title: 'Inventory Management Guide', url: '/documentation/inventory' },
          { title: 'Setting Up Stock Alerts', url: '/documentation/stock-alerts' }
        ]
      },
      {
        id: 2,
        question: 'How do I process a return or exchange?',
        answer: 'To process a return or exchange, go to the <strong>Orders</strong> section and locate the order in question. Click "Process Return" and follow the guided workflow. You\'ll need to specify return reason, condition of items, and whether you\'re issuing a refund or exchange. All returns will be tracked in the Returns dashboard.',
        category: 'Returns',
        relatedLinks: [
          { title: 'Return Policy Template', url: '/documentation/return-policy' },
          { title: 'Returns Dashboard Guide', url: '/documentation/returns-dashboard' }
        ]
      },
      {
        id: 3,
        question: 'How can I set up shipping rates for different regions?',
        answer: 'Configure region-specific shipping rates in the <strong>Settings > Shipping</strong> section. You can define shipping zones based on countries or regions, set weight-based or flat rate pricing, and configure special rules for expedited shipping options. Remember to regularly review international shipping regulations for compliance.',
        category: 'Shipping',
        relatedLinks: [
          { title: 'International Shipping Guide', url: '/documentation/international-shipping' }
        ]
      },
      {
        id: 4,
        question: 'How do I offer store credit instead of refunds?',
        answer: 'To offer store credit, go to <strong>Settings > Payments</strong> and enable the store credit feature. Once enabled, you can issue store credits from the order management screen when processing returns or addressing customer service issues. Store credits can be tracked in the Customer accounts section.',
        category: 'Payments',
        relatedLinks: [
          { title: 'Setting Up Store Credit', url: '/documentation/store-credit' },
          { title: 'Customer Credit Management', url: '/documentation/credit-management' }
        ]
      },
      {
        id: 5,
        question: 'How can I track the status of a specific order?',
        answer: 'To track an order status, navigate to the <strong>Orders</strong> section and use the search function to find the specific order by order number, customer name, or email. Click on the order to view detailed information including payment status, fulfillment status, shipping updates, and customer communications history.',
        category: 'Orders',
        relatedLinks: [
          { title: 'Order Tracking Guide', url: '/documentation/order-tracking' }
        ]
      },
      {
        id: 6,
        question: 'How do I set up automated discount codes?',
        answer: 'Set up automated discounts in the <strong>Marketing > Promotions</strong> section. You can create rules based on cart value, product categories, customer groups, or time periods. For recurring promotions, use the scheduling feature to automatically activate and deactivate discount codes.',
        category: 'Products',
        relatedLinks: [
          { title: 'Promotional Strategy Guide', url: '/documentation/promotions' },
          { title: 'Seasonal Discount Templates', url: '/documentation/discount-templates' }
        ]
      },
      {
        id: 7,
        question: 'How do I generate sales reports for specific time periods?',
        answer: 'Generate sales reports by going to the <strong>Reports</strong> section and selecting "Sales Reports." You can specify date ranges, product categories, or customer segments. Reports can be customized to show revenue, profit margins, taxes, or shipping costs. All reports can be exported as CSV or PDF files.',
        category: 'Payments',
        relatedLinks: [
          { title: 'Financial Reporting Guide', url: '/documentation/financial-reports' }
        ]
      },
      {
        id: 8,
        question: 'How do I add new admin users to the dashboard?',
        answer: 'To add new admin users, go to <strong>Settings > User Management</strong> and click "Add New User." Specify their email, set their role (admin, editor, viewer), and customize their permissions for different sections of the dashboard. New users will receive an email invitation to create their password.',
        category: 'Account',
        relatedLinks: [
          { title: 'User Roles and Permissions', url: '/documentation/user-roles' },
          { title: 'Security Best Practices', url: '/documentation/security' }
        ]
      },
      {
        id: 9,
        question: 'How do I handle pre-orders for upcoming product lines?',
        answer: 'Manage pre-orders by enabling the pre-order feature in the <strong>Products</strong> section when creating or editing a product. You can set expected shipping dates, collect either full or partial payments, and customize pre-order messaging. Pre-orders will be flagged in the orders dashboard for special fulfillment handling.',
        category: 'Products',
        relatedLinks: [
          { title: 'Pre-order Management Guide', url: '/documentation/pre-orders' }
        ]
      },
      {
        id: 10,
        question: 'How do I set up integration with my warehouse management system?',
        answer: 'Integrate with your warehouse management system in <strong>Settings > Integrations</strong>. Select your WMS provider from the list of available integrations, enter your API credentials, and configure synchronization settings for inventory, orders, and returns. Test the connection before finalizing the setup.',
        category: 'Shipping',
        relatedLinks: [
          { title: 'Integration Partners Directory', url: '/documentation/integrations' },
          { title: 'API Documentation', url: '/documentation/api' }
        ]
      },
      {
        id: 11,
        question: 'How do I customize the order notification emails?',
        answer: 'Customize order notifications in <strong>Settings > Communications</strong>. You can edit the email templates for order confirmation, shipping updates, delivery confirmation, and return processing. Use the variable tags to include dynamic content like order details, tracking links, and customer information.',
        category: 'Orders',
        relatedLinks: [
          { title: 'Email Template Guide', url: '/documentation/email-templates' }
        ]
      },
      {
        id: 12,
        question: 'How do I resolve payment disputes or chargebacks?',
        answer: 'Handle payment disputes in the <strong>Orders</strong> section by locating the disputed order and selecting "Manage Dispute." You can upload evidence such as shipping confirmation, correspondence, and product information. The system will guide you through the documentation process required by the payment processor.',
        category: 'Payments',
        relatedLinks: [
          { title: 'Chargeback Prevention Tips', url: '/documentation/prevent-chargebacks' },
          { title: 'Evidence Collection Guide', url: '/documentation/dispute-evidence' }
        ]
      }
    ],
    isLoading: false,
    error: null
  }),
  
  getters: {
    allFaqs: (state) => state.faqs,
    
    faqById: (state) => (id) => {
      return state.faqs.find(faq => faq.id === id) || null;
    },
    
    faqsByCategory: (state) => (category) => {
      if (!category) return state.faqs;
      return state.faqs.filter(faq => faq.category === category);
    },
    
    categories: (state) => {
      const categories = state.faqs.map(faq => faq.category);
      return [...new Set(categories)].filter(Boolean);
    },
    
    searchFaqs: (state) => (query) => {
      if (!query) return state.faqs;
      
      const searchTerm = query.toLowerCase();
      return state.faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm) || 
        faq.answer.toLowerCase().includes(searchTerm)
      );
    }
  },
  
  actions: {
    // In a real app, these would make API calls
    async fetchFaqs() {
      try {
        this.isLoading = true;
        // In a real app: const response = await api.get('/faqs');
        // this.faqs = response.data;
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        this.isLoading = false;
      } catch (error) {
        this.error = error.message || 'Failed to fetch FAQs';
        this.isLoading = false;
      }
    },
    
    async addFaq(faqData) {
      try {
        this.isLoading = true;
        // In a real app: const response = await api.post('/faqs', faqData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate a new ID (in a real app, the server would do this)
        const newId = Math.max(...this.faqs.map(f => f.id), 0) + 1;
        
        // Add the new FAQ to the store
        this.faqs.push({
          id: newId,
          ...faqData
        });
        
        this.isLoading = false;
        return newId;
      } catch (error) {
        this.error = error.message || 'Failed to add FAQ';
        this.isLoading = false;
        throw error;
      }
    },
    
    async updateFaq(id, faqData) {
      try {
        this.isLoading = true;
        // In a real app: const response = await api.put(`/faqs/${id}`, faqData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update the FAQ in the store
        const index = this.faqs.findIndex(faq => faq.id === id);
        if (index !== -1) {
          this.faqs[index] = { 
            ...this.faqs[index],
            ...faqData
          };
        }
        
        this.isLoading = false;
      } catch (error) {
        this.error = error.message || 'Failed to update FAQ';
        this.isLoading = false;
        throw error;
      }
    },
    
    async deleteFaq(id) {
      try {
        this.isLoading = true;
        // In a real app: await api.delete(`/faqs/${id}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove the FAQ from the store
        this.faqs = this.faqs.filter(faq => faq.id !== id);
        
        this.isLoading = false;
      } catch (error) {
        this.error = error.message || 'Failed to delete FAQ';
        this.isLoading = false;
        throw error;
      }
    }
  }
});