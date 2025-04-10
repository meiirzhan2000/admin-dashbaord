<!-- pages/products/categories.vue -->
<template>
    <div>
      <PageHeader title="Product Categories">
        <template #actions>
          <Button
            variant="primary"
            left-icon="heroicons:plus"
            @click="showAddCategoryModal = true"
          >
            Add Category
          </Button>
        </template>
      </PageHeader>
  
      <!-- Loading state -->
      <div v-if="productStore.loading" class="bg-white dark:bg-gray-800 shadow rounded-lg p-8 flex justify-center">
        <div class="animate-spin h-8 w-8 border-2 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
  
      <!-- Empty state -->
      <EmptyState
        v-else-if="productStore.categories.length === 0"
        icon="heroicons:squares-2x2"
        message="No categories found"
        action-label="Add New Category"
        action-icon="heroicons:plus"
        @action="showAddCategoryModal = true"
      >
        <template #action>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Get started by adding your first product category.
          </p>
        </template>
      </EmptyState>
  
      <!-- Categories grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="category in productStore.categories"
          :key="category.id"
          class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden group"
        >
          <!-- Category Image -->
          <div class="h-40 bg-gray-200 dark:bg-gray-700 relative">
            <img
              v-if="category.image"
              :src="category.image"
              :alt="category.name"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="h-full w-full flex items-center justify-center"
            >
              <Icon name="heroicons:squares-2x2" class="h-12 w-12 text-gray-400" />
            </div>
  
            <!-- Actions overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div class="flex space-x-2">
                <button
                  @click="editCategory(category)"
                  class="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
                  title="Edit Category"
                >
                  <Icon name="heroicons:pencil-square" class="h-5 w-5" />
                </button>
                <button
                  @click="confirmDeleteCategory(category)"
                  class="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100"
                  title="Delete Category"
                >
                  <Icon name="heroicons:trash" class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
  
          <!-- Category Info -->
          <div class="p-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate">{{ category.name }}</h3>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                {{ getCategoryProductCount(category.id) }} products
              </span>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{{ category.description }}</p>
            
            <div class="mt-4 flex justify-end">
              <Button
                variant="link"
                size="sm"
                @click="navigateToProducts(category.id)"
              >
                View Products
              </Button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add/Edit Category Modal -->
      <Modal
        v-model="showCategoryModal"
        :title="editingCategory ? 'Edit Category' : 'Add Category'"
      >
        <form @submit.prevent="saveCategory" class="space-y-4">
          <!-- Category Name -->
          <div>
            <label for="category-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Name *
            </label>
            <input
              id="category-name"
              v-model="categoryForm.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Enter category name"
            />
          </div>
  
          <!-- Category Slug -->
          <div>
            <label for="category-slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Slug *
            </label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                /categories/
              </span>
              <input
                id="category-slug"
                v-model="categoryForm.slug"
                type="text"
                required
                class="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="category-slug"
              />
            </div>
          </div>
  
          <!-- Parent Category -->
          <div>
            <label for="parent-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Parent Category
            </label>
            <select
              id="parent-category"
              v-model="categoryForm.parentId"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option :value="undefined">None (Top Level Category)</option>
              <option 
                v-for="cat in availableParentCategories" 
                :key="cat.id" 
                :value="cat.id"
                :disabled="editingCategory && cat.id === editingCategory.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
  
          <!-- Category Description -->
          <div>
            <label for="category-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="category-description"
              v-model="categoryForm.description"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Describe this category..."
            ></textarea>
          </div>
  
          <!-- Category Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category Image
            </label>
            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div class="space-y-1 text-center">
                <Icon name="heroicons:photo" class="mx-auto h-12 w-12 text-gray-400" />
                <div class="flex text-sm text-gray-600 dark:text-gray-400">
                  <label for="category-image" class="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none">
                    <span>Upload an image</span>
                    <input id="category-image" name="category-image" type="file" class="sr-only" @change="handleImageUpload" />
                  </label>
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            <!-- Image Preview -->
            <div v-if="categoryForm.image" class="mt-2">
              <div class="relative h-24 w-full max-w-xs rounded overflow-hidden">
                <img :src="categoryForm.image" alt="Category image" class="h-full w-full object-cover" />
                <button 
                  @click="categoryForm.image = ''" 
                  class="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                  title="Remove image"
                >
                  <Icon name="heroicons:x-mark" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
  
          <!-- Form Actions -->
          <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <Button
              variant="secondary"
              @click="showCategoryModal = false"
              class="sm:col-start-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              :disabled="isSubmitting"
              class="sm:col-start-2"
            >
              <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-2" />
              {{ editingCategory ? 'Update' : 'Create' }} Category
            </Button>
          </div>
        </form>
      </Modal>
  
      <!-- Delete Confirmation Modal -->
      <Modal v-model="showDeleteModal" title="Delete Category">
        <p class="text-gray-500 dark:text-gray-400">
          Are you sure you want to delete <span class="font-semibold text-gray-900 dark:text-white">{{ categoryToDelete?.name }}</span>?
          
          <span v-if="getCategoryProductCount(categoryToDelete?.id) > 0" class="block mt-2 text-red-600 dark:text-red-400">
            This category has {{ getCategoryProductCount(categoryToDelete?.id) }} products associated with it. These products will need to be reassigned to another category.
          </span>
        </p>
        <div class="mt-6 flex justify-end space-x-3">
          <Button 
            variant="secondary" 
            @click="showDeleteModal = false"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            @click="deleteCategory"
            :disabled="isSubmitting"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-2" />
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProductStore } from '~/stores/useProductStore';
  import PageHeader from '~/components/common/PageHeader.vue';
  import Button from '~/components/ui/Button.vue';
  import EmptyState from '~/components/common/EmptyState.vue';
  import Modal from '~/components/ui/Modal.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const productStore = useProductStore();
  
  // State for modals
  const showCategoryModal = ref(false);
  const showDeleteModal = ref(false);
  const editingCategory = ref(null);
  const categoryToDelete = ref(null);
  const isSubmitting = ref(false);
  
  // Form state
  const categoryForm = ref({
    name: '',
    slug: '',
    description: '',
    parentId: undefined,
    image: ''
  });
  
  // Reset the form
  const resetForm = () => {
    categoryForm.value = {
      name: '',
      slug: '',
      description: '',
      parentId: undefined,
      image: ''
    };
    editingCategory.value = null;
  };
  
  // Available parent categories (exclude the one being edited)
  const availableParentCategories = computed(() => {
    return productStore.categories.filter(cat => 
      !editingCategory.value || cat.id !== editingCategory.value.id
    );
  });
  
  // Get product count for a category
  const getCategoryProductCount = (categoryId) => {
    return productStore.products.filter(product => product.categoryId === categoryId).length;
  };
  
  // Generate a slug from the category name
  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  };
  
  // Watch category name changes to update slug
  watch(() => categoryForm.value.name, (newName) => {
    if (!editingCategory.value || !categoryForm.value.slug) {
      categoryForm.value.slug = generateSlug(newName);
    }
  });
  
  // Open the add category modal
  const showAddCategoryModal = () => {
    resetForm();
    showCategoryModal.value = true;
  };
  
  // Open the edit category modal
  const editCategory = (category) => {
    editingCategory.value = category;
    categoryForm.value = {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId,
      image: category.image || ''
    };
    showCategoryModal.value = true;
  };
  
  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // In a real app, you would upload this file to a server and get a URL back
    // For this example, we'll create a temporary URL object
    const reader = new FileReader();
    reader.onload = (e) => {
      categoryForm.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Clear the input
    event.target.value = null;
  };
  
  // Save the category
  const saveCategory = async () => {
    try {
      isSubmitting.value = true;
      
      if (editingCategory.value) {
        // Update existing category
        await productStore.updateCategory(editingCategory.value.id, categoryForm.value);
        useNuxtApp().$toast.success('Category updated successfully');
      } else {
        // Add new category
        await productStore.addCategory(categoryForm.value);
        useNuxtApp().$toast.success('Category created successfully');
      }
      
      showCategoryModal.value = false;
      resetForm();
    } catch (error) {
      useNuxtApp().$toast.error('Failed to save category');
      console.error('Error saving category:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Confirm delete category
  const confirmDeleteCategory = (category) => {
    categoryToDelete.value = category;
    showDeleteModal.value = true;
  };
  
  // Delete the category
  const deleteCategory = async () => {
    try {
      isSubmitting.value = true;
      
      try {
        await productStore.deleteCategory(categoryToDelete.value.id);
        useNuxtApp().$toast.success('Category deleted successfully');
      } catch (error) {
        // If there are products in this category, we'll get an error
        if (error.message.includes('Cannot delete category that is in use')) {
          useNuxtApp().$toast.error('Cannot delete category that has products assigned to it');
        } else {
          throw error;
        }
      }
      
      showDeleteModal.value = false;
      categoryToDelete.value = null;
    } catch (error) {
      useNuxtApp().$toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Navigate to products filtered by category
  const navigateToProducts = (categoryId) => {
    router.push({ 
      path: '/products',
      query: { category: categoryId }
    });
  };
  
  // Fetch categories on mount
  onMounted(async () => {
    if (productStore.categories.length === 0) {
      await productStore.fetchCategories();
    }
    
    if (productStore.products.length === 0) {
      await productStore.fetchProducts();
    }
  });
  </script>