<!-- components/faqs/FaqAddForm.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">{{ isEditing ? 'Edit FAQ' : 'Add New FAQ' }}</h2>
      
      <form @submit.prevent="submitForm">
        <div class="space-y-4">
          <!-- Question -->
          <div>
            <label for="question" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Question</label>
            <input
              id="question"
              v-model="form.question"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>
          
          <!-- Answer (as rich text) -->
          <div>
            <label for="answer" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Answer</label>
            <textarea
              id="answer"
              v-model="form.answer"
              rows="5"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            ></textarea>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">You can use basic HTML tags for formatting.</p>
          </div>
          
          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              v-model="form.category"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">-- Select Category --</option>
              <option v-for="category in availableCategories" :key="category" :value="category">{{ category }}</option>
              <option value="new">+ Add new category</option>
            </select>
          </div>
          
          <!-- New Category (shows only when "Add new category" is selected) -->
          <div v-if="form.category === 'new'">
            <label for="newCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Category Name</label>
            <input
              id="newCategory"
              v-model="form.newCategory"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>
          
          <!-- Related Links -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Related Links</label>
            <div class="space-y-2 mt-2">
              <div 
                v-for="(link, index) in form.relatedLinks" 
                :key="index"
                class="flex space-x-2"
              >
                <input
                  v-model="link.title"
                  type="text"
                  placeholder="Link Title"
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
                <input
                  v-model="link.url"
                  type="text"
                  placeholder="URL"
                  class="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
                <Button
                  variant="danger"
                  size="sm"
                  @click="removeLink(index)"
                  aria-label="Remove link"
                >
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              class="mt-2"
              @click="addLink"
            >
              <Icon name="heroicons:plus" class="h-4 w-4 mr-1" />
              Add Link
            </Button>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <Button
            variant="secondary"
            @click="$emit('cancel')"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            {{ isEditing ? 'Update' : 'Create' }} FAQ
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  const props = defineProps({
    faqData: {
      type: Object,
      default: null
    },
    availableCategories: {
      type: Array,
      default: () => ['Orders', 'Shipping', 'Returns', 'Payments', 'Products', 'Account']
    }
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  
  const isEditing = computed(() => !!props.faqData);
  
  const form = ref({
    question: '',
    answer: '',
    category: '',
    newCategory: '',
    relatedLinks: []
  });
  
  onMounted(() => {
    if (props.faqData) {
      // If we're editing, populate the form with existing data
      form.value = {
        ...props.faqData,
        relatedLinks: props.faqData.relatedLinks ? [...props.faqData.relatedLinks] : [],
        newCategory: ''
      };
    } else {
      // Initialize with empty related links array for new FAQs
      form.value.relatedLinks = [];
    }
  });
  
  const addLink = () => {
    form.value.relatedLinks.push({ title: '', url: '' });
  };
  
  const removeLink = (index) => {
    form.value.relatedLinks.splice(index, 1);
  };
  
  const submitForm = () => {
    const faqToSubmit = { ...form.value };
    
    // If adding a new category, use that instead of the "new" placeholder
    if (faqToSubmit.category === 'new' && faqToSubmit.newCategory) {
      faqToSubmit.category = faqToSubmit.newCategory;
    }
    
    // Remove empty related links
    faqToSubmit.relatedLinks = faqToSubmit.relatedLinks.filter(
      link => link.title.trim() && link.url.trim()
    );
    
    // Remove the newCategory field as it's not needed in the final data
    delete faqToSubmit.newCategory;
    
    emit('submit', faqToSubmit);
  };
  </script>