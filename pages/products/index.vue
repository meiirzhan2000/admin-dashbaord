<!-- pages/products/index.vue -->
<template>
    <div>
      <PageHeader title="Products Management">
        <template #actions>
          <div class="flex items-center gap-3">
            <Button
              variant="outline"
              left-icon="heroicons:funnel"
              @click="isFilterDrawerOpen = true"
            >
              Filter
            </Button>
            <Button
              variant="primary"
              left-icon="heroicons:plus"
              @click="navigateToAddProduct"
            >
              Add Product
            </Button>
          </div>
        </template>
      </PageHeader>
  
      <div class="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div class="w-full sm:max-w-xs">
            <SearchInput
              v-model="searchQuery"
              placeholder="Search products..."
              icon-name="heroicons:magnifying-glass"
            />
          </div>
          <div class="flex items-center gap-4">
            <select
              v-model="productCategory"
              class="form-select rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              <option v-for="category in productStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <select
              v-model="sortBy"
              class="form-select rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="stock-asc">Stock (Low to High)</option>
              <option value="stock-desc">Stock (High to Low)</option>
              <option value="created-desc">Newest First</option>
              <option value="created-asc">Oldest First</option>
            </select>
            <div>
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-md',
                  viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]"
              >
                <Icon name="heroicons:squares-2x2" class="h-5 w-5" />
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded-md ml-1',
                  viewMode === 'list' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                ]"
              >
                <Icon name="heroicons:list-bullet" class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
  
        <!-- Status tabs -->
        <div class="mb-6">
          <FilterTabs
            v-model="productStatus"
            :options="statusOptions"
          />
        </div>
        
        <!-- Loading state -->
        <div v-if="productStore.loading" class="flex justify-center py-12">
          <div class="animate-spin h-8 w-8 border-2 border-indigo-600 rounded-full border-t-transparent"></div>
        </div>
        
        <!-- Empty state -->
        <EmptyState
          v-else-if="filteredProducts.length === 0"
          icon="heroicons:shopping-bag"
          :message="searchQuery ? 'No products match your search criteria' : 'No products found'"
          action-label="Add New Product"
          action-icon="heroicons:plus"
          @action="navigateToAddProduct"
        >
          <template #action>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first product to your inventory.
            </p>
          </template>
        </EmptyState>
        
        <!-- Product grid view -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            @view="navigateToProduct(product.id)"
            @edit="navigateToEditProduct(product.id)"
            @toggle-status="toggleProductStatus(product)"
            @delete="confirmDeleteProduct(product)"
          />
        </div>
        
        <!-- Product list view -->
        <div v-else class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Product</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Category</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Stock</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              <tr v-for="product in paginatedProducts" :key="product.id">
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="flex items-center">
                    <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                      <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name" class="h-full w-full object-cover object-center">
                      <div v-else class="h-full w-full flex items-center justify-center">
                        <Icon name="heroicons:photo" class="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                      <div class="text-gray-500 dark:text-gray-400">SKU: {{ product.sku }}</div>
                    </div>
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {{ getCategoryName(product.categoryId) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  ${{ product.price.toFixed(2) }}
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStockStatusClass(product.stock)
                    ]"
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-sm">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      product.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 
                      product.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    ]"
                  >
                    {{ statusLabels[product.status] || 'Unknown' }}
                  </span>
                </td>
                <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div class="flex items-center justify-end gap-2">
                    <button 
                      @click="navigateToProduct(product.id)"
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      View
                    </button>
                    <button 
                      @click="navigateToEditProduct(product.id)"
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 ml-4"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredProducts.length > 0" class="mt-6">
          <Pagination
            v-model:current-page="currentPage"
            :total-items="filteredProducts.length"
            :items-per-page="itemsPerPage"
          />
        </div>
      </div>
  
      <!-- Filter Drawer -->
      <Drawer v-model="isFilterDrawerOpen" title="Filter Products">
        <ProductFilter 
          v-model="filters" 
          @apply="applyFilters"
          @reset="resetFilters"
        />
      </Drawer>
  
      <!-- Delete Confirmation Modal -->
      <Modal v-model="showDeleteModal" title="Delete Product">
        <p class="text-gray-500 dark:text-gray-400">
          Are you sure you want to delete <span class="font-semibold text-gray-900 dark:text-white">{{ productToDelete?.name }}</span>? This action cannot be undone.
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
            @click="deleteProduct"
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProductStore } from '~/stores/useProductStore';
  
  import PageHeader from '~/components/common/PageHeader.vue';
  import Button from '~/components/ui/Button.vue';
  import SearchInput from '~/components/common/SearchInput.vue';
  import FilterTabs from '~/components/common/FilterTabs.vue';
  import EmptyState from '~/components/common/EmptyState.vue';
  import Pagination from '~/components/common/Pagination.vue';
  import Modal from '~/components/ui/Modal.vue';
  import Drawer from '~/components/ui/Drawer.vue';
  import ProductCard from '~/components/products/ProductCard.vue';
  import ProductFilter from '~/components/products/ProductFilter.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const productStore = useProductStore();
  
  // UI State
  const viewMode = ref('grid');
  const currentPage = ref(1);
  const itemsPerPage = ref(12);
  const searchQuery = ref('');
  const productCategory = ref('');
  const productStatus = ref('');
  const sortBy = ref('created-desc');
  const isFilterDrawerOpen = ref(false);
  const showDeleteModal = ref(false);
  const productToDelete = ref(null);
  
  // Filter state
  const filters = ref({
    priceRange: [0, 1000],
    stockRange: [0, 1000],
    sizes: [],
    colors: [],
    locations: []
  });
  
  // Status options for filter tabs
  const statusOptions = [
    { value: '', label: 'All Products' },
    { value: 'active', label: 'Active' },
    { value: 'draft', label: 'Draft' },
    { value: 'inactive', label: 'Inactive' }
  ];
  
  // Status labels for display
  const statusLabels = {
    active: 'Active',
    draft: 'Draft',
    inactive: 'Inactive'
  };
  
  // Get filtered products
  const filteredProducts = computed(() => {
    let result = [...productStore.products];
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.sku.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (productCategory.value) {
      result = result.filter(product => product.categoryId === productCategory.value);
    }
    
    // Apply status filter
    if (productStatus.value) {
      result = result.filter(product => product.status === productStatus.value);
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= filters.value.priceRange[0] && 
      product.price <= filters.value.priceRange[1]
    );
    
    // Apply stock range filter
    result = result.filter(product => 
      product.stock >= filters.value.stockRange[0] && 
      product.stock <= filters.value.stockRange[1]
    );
    
    // Apply size filter
    if (filters.value.sizes.length > 0) {
      result = result.filter(product => 
        product.variants.some(variant => 
          filters.value.sizes.includes(variant.size)
        )
      );
    }
    
    // Apply color filter
    if (filters.value.colors.length > 0) {
      result = result.filter(product => 
        product.variants.some(variant => 
          filters.value.colors.includes(variant.color)
        )
      );
    }
    
    // Apply location filter
    if (filters.value.locations.length > 0) {
      result = result.filter(product => 
        filters.value.locations.includes(product.location)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'created-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'created-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    
    return result;
  });
  
  // Get paginated products
  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;
    return filteredProducts.value.slice(startIndex, endIndex);
  });
  
  // Helper function to get category name from ID
  const getCategoryName = (categoryId) => {
    const category = productStore.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Get CSS class for stock status
  const getStockStatusClass = (stock) => {
    if (stock <= 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    } else if (stock < 10) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    } else {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    }
  };
  
  // Navigation functions
  const navigateToAddProduct = () => {
    router.push('/products/add');
  };
  
  const navigateToProduct = (id) => {
    router.push(`/products/${id}`);
  };
  
  const navigateToEditProduct = (id) => {
    router.push(`/products/${id}/edit`);
  };
  
  // Filter functions
  const applyFilters = () => {
    isFilterDrawerOpen.value = false;
    // Filter is automatically applied through the computed property
  };
  
  const resetFilters = () => {
    filters.value = {
      priceRange: [0, 1000],
      stockRange: [0, 1000],
      sizes: [],
      colors: [],
      locations: []
    };
    searchQuery.value = '';
    productCategory.value = '';
    productStatus.value = '';
    sortBy.value = 'created-desc';
  };
  
  // Product status functions
  const toggleProductStatus = async (product) => {
    let newStatus;
    
    if (product.status === 'active') {
      newStatus = 'inactive';
    } else {
      newStatus = 'active';
    }
    
    try {
      await productStore.updateProductStatus(product.id, newStatus);
      useNuxtApp().$toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      useNuxtApp().$toast.error('Failed to update product status');
    }
  };
  
  // Delete product functions
  const confirmDeleteProduct = (product) => {
    productToDelete.value = product;
    showDeleteModal.value = true;
  };
  
  const deleteProduct = async () => {
    if (!productToDelete.value) return;
    
    try {
      await productStore.deleteProduct(productToDelete.value.id);
      useNuxtApp().$toast.success('Product deleted successfully');
      showDeleteModal.value = false;
      productToDelete.value = null;
    } catch (error) {
      useNuxtApp().$toast.error('Failed to delete product');
    }
  };
  
  // Reset page when filters change
  watch([searchQuery, productCategory, productStatus, filters, sortBy], () => {
    currentPage.value = 1;
  });
  
  // Fetch products on mount
  onMounted(async () => {
    if (productStore.products.length === 0) {
      await productStore.fetchProducts();
    }
    
    if (productStore.categories.length === 0) {
      await productStore.fetchCategories();
    }
  });
  </script>