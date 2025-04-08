<!-- components/contact/SupportTicketForm.vue -->
<template>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Ticket Subject -->
      <div>
        <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subject
        </label>
        <div class="mt-1">
          <input
            id="subject"
            v-model="form.subject"
            type="text"
            required
            class="appearance-none block w-full h-12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Brief description of your issue"
          />
        </div>
      </div>
  
      <!-- Ticket Category -->
      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <div class="mt-1">
          <select
            id="category"
            v-model="form.category"
            required
            class="appearance-none block w-full h-12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="" disabled selected>Select a category</option>
            <option v-for="category in categories" :key="category.value" :value="category.value">
              {{ category.label }}
            </option>
          </select>
        </div>
      </div>
  
      <!-- Ticket Priority -->
      <div>
        <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority
        </label>
        <div class="mt-1">
          <select
            id="priority"
            v-model="form.priority"
            required
            class="appearance-none block w-full h-12 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          >
            <option value="" disabled selected>Select priority level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
  
      <!-- Ticket Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <div class="mt-1">
          <textarea
            id="description"
            v-model="form.description"
            rows="5"
            required
            class="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Please provide detailed information about your issue"
          ></textarea>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please include any relevant details that will help us address your issue more effectively.
        </p>
      </div>
  
      <!-- File Attachment -->
      <div>
        <label for="attachments" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Attachments (Optional)
        </label>
        <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <Icon
              name="heroicons:paper-clip"
              class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            />
            <div class="flex text-sm text-gray-600 dark:text-gray-400">
              <label
                for="file-upload"
                class="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  class="sr-only"
                  @change="handleFileUpload"
                  multiple
                />
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF, PDF up to 10MB
            </p>
          </div>
        </div>
        
        <!-- File list preview -->
        <ul v-if="selectedFiles.length > 0" class="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="(file, index) in selectedFiles" :key="index" class="py-2 flex justify-between items-center">
            <div class="flex items-center">
              <Icon name="heroicons:document" class="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span class="text-sm text-gray-600 dark:text-gray-400">{{ file.name }}</span>
            </div>
            <button 
              type="button" 
              @click="removeFile(index)" 
              class="text-red-500 hover:text-red-700 dark:hover:text-red-400"
            >
              <Icon name="heroicons:trash" class="h-5 w-5" />
            </button>
          </li>
        </ul>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          :disabled="isSubmitting"
        >
          <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-2" />
          Submit Ticket
        </Button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  const categories = [
    { value: 'account', label: 'Account Issues' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'orders', label: 'Orders & Shipping' },
    { value: 'products', label: 'Product Management' },
    { value: 'technical', label: 'Technical Problem' },
    { value: 'other', label: 'Other' }
  ];
  
  const emit = defineEmits(['submit', 'cancel']);
  
  const form = ref({
    subject: '',
    category: '',
    priority: '',
    description: ''
  });
  
  const selectedFiles = ref([]);
  const isSubmitting = ref(false);
  
  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    selectedFiles.value = [...selectedFiles.value, ...newFiles];
  };
  
  const removeFile = (index) => {
    selectedFiles.value.splice(index, 1);
  };
  
  const submitForm = async () => {
    try {
      isSubmitting.value = true;
      
      // In a real implementation, you would upload files to a server
      // and get their URLs to attach to the ticket
      
      const ticketData = {
        ...form.value,
        attachments: selectedFiles.value.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
          // In a real app, you'd include the uploaded URL
        }))
      };
      
      await emit('submit', ticketData);
      
      // Reset form on successful submission
      form.value = {
        subject: '',
        category: '',
        priority: '',
        description: ''
      };
      selectedFiles.value = [];
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  </script>