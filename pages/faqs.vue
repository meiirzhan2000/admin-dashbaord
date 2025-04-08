<!-- pages/faqs.vue -->
<template>
  <div>
    <!-- Page header with search -->
    <PageHeader title="Frequently Asked Questions">
      <template #actions>
        <SearchInput
          v-model="searchQuery"
          placeholder="Search FAQs..."
          icon-name="heroicons:magnifying-glass"
        />
      </template>
    </PageHeader>

    <!-- FAQ Categories -->
    <FilterTabs
      v-model="selectedCategory"
      :options="categories"
    />

    <!-- Main content area with loading state -->
    <div v-if="faqStore.isLoading" class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    
    <template v-else>
      <!-- FAQ List -->
      <FaqList
        :faqs="paginatedFaqs"
        @reset-filters="resetFilters"
      />
      
      <!-- Pagination -->
      <Pagination
        v-if="totalPages > 1"
        v-model:current-page="currentPage"
        :total-items="filteredFaqs.length"
        :items-per-page="itemsPerPage"
      />
      
      <!-- Add FAQ button for admins -->
      <div v-if="isAdmin" class="mt-8 flex justify-end">
        <Button
          variant="primary"
          left-icon="heroicons:plus"
          @click="showAddFaqModal = true"
        >
          Add New FAQ
        </Button>
      </div>
    </template>
    
    <!-- Add/Edit FAQ Modal -->
    <Modal
      v-model="showAddFaqModal"
      :title="editingFaq ? 'Edit FAQ' : 'Add New FAQ'"
      size="lg"
    >
      <FaqAddForm
        :faq-data="editingFaq"
        :available-categories="categories"
        @submit="handleFaqSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore';
import { useFaqStore } from '~/stores/useFaqStore';

import PageHeader from '~/components/common/PageHeader.vue';
import SearchInput from '~/components/common/SearchInput.vue';
import FilterTabs from '~/components/common/FilterTabs.vue';
import Pagination from '~/components/common/Pagination.vue';
import Button from '~/components/ui/Button.vue';
import Modal from '~/components/ui/Modal.vue';
import FaqList from '~/components/faqs/FaqList.vue';
import FaqAddForm from '~/components/faqs/FaqAddForm.vue';

definePageMeta({
  middleware: ['auth']
});

// Initialize stores
const authStore = useAuthStore();
const faqStore = useFaqStore();

// Check if user is admin
const isAdmin = computed(() => authStore.user?.role === 'admin');

// State
const searchQuery = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAddFaqModal = ref(false);
const editingFaq = ref(null);

// Fetch FAQs on mount
onMounted(async () => {
  await faqStore.fetchFaqs();
});

// Computed properties
const categories = computed(() => faqStore.categories);

const filteredFaqs = computed(() => {
  let result = faqStore.allFaqs;
  
  // Apply category filter
  if (selectedCategory.value) {
    result = faqStore.faqsByCategory(selectedCategory.value);
  }
  
  // Apply search filter
  if (searchQuery.value) {
    result = faqStore.searchFaqs(searchQuery.value);
    
    // If a category is also selected, we need to filter the search results by category
    if (selectedCategory.value) {
      result = result.filter(faq => faq.category === selectedCategory.value);
    }
  }
  
  return result;
});

const paginatedFaqs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredFaqs.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredFaqs.value.length / itemsPerPage.value);
});

// Methods
const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  currentPage.value = 1;
};

const openAddFaqModal = (faq = null) => {
  editingFaq.value = faq;
  showAddFaqModal.value = true;
};

const closeModal = () => {
  showAddFaqModal.value = false;
  editingFaq.value = null;
};

const handleFaqSubmit = async (faqData) => {
  try {
    if (editingFaq.value) {
      // Update existing FAQ
      await faqStore.updateFaq(editingFaq.value.id, faqData);
      // Show success notification
      useNuxtApp().$toast.success('FAQ updated successfully');
    } else {
      // Add new FAQ
      await faqStore.addFaq(faqData);
      // Show success notification
      useNuxtApp().$toast.success('FAQ added successfully');
    }
    closeModal();
  } catch (error) {
    // Show error notification
    useNuxtApp().$toast.error('Error saving FAQ: ' + (error.message || 'Unknown error'));
  }
};

// Reset pagination when filters change
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1;
});
</script>