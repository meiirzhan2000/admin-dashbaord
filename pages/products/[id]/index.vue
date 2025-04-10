<!-- pages/products/[id]/index.vue -->
<template>
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div class="flex items-center">
          <button 
            @click="router.back()" 
            class="mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <Icon name="heroicons:arrow-left" class="h-5 w-5" />
          </button>
          <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
            {{ product.name }}
          </h1>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center gap-2">
          <Button
            variant="outline"
            left-icon="heroicons:chart-bar"
            @click="activeTab = 'analytics'"
          >
            View Analytics
          </Button>
          <Button
            variant="outline"
            left-icon="heroicons:pencil-square"
            @click="navigateToEdit"
          >
            Edit Product
          </Button>
          <Button
            :variant="product.status === 'active' ? 'danger' : 'success'"
            :left-icon="product.status === 'active' ? 'heroicons:pause' : 'heroicons:play'"
            @click="toggleProductStatus"
          >
            {{ product.status === 'active' ? 'Deactivate' : 'Activate' }}
          </Button>
        </div>
      </div>
  
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <!-- Product Tabs -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600',
                'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm'
              ]"
              :aria-current="activeTab === tab.id ? 'page' : undefined"
            >
              <Icon 
                :name="tab.icon"
                :class="[
                  activeTab === tab.id 
                    ? 'text-indigo-500 dark:text-indigo-400' 
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400',
                  'h-5 w-5 mr-2'
                ]" 
                aria-hidden="true" 
              />
              {{ tab.label }}
            </button>
          </nav>
        </div>
  
        <!-- Product Details Tab Content -->
        <div v-if="activeTab === 'details'" class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Product Images -->
            <div class="lg:col-span-1">
              <div class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4 h-72 flex items-center justify-center">
                <img 
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]"
                  :alt="product.name"
                  class="max-h-full max-w-full object-contain"
                />
                <Icon v-else name="heroicons:photo" class="h-16 w-16 text-gray-400" />
              </div>
              
              <div class="grid grid-cols-4 gap-2">
                <div 
                  v-for="(image, index) in product.images" 
                  :key="index"
                  class="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden h-16 w-full flex items-center justify-center cursor-pointer"
                >
                  <img 
                    :src="image"
                    :alt="`${product.name} - image ${index + 1}`"
                    class="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
            
            <!-- Product Info -->
            <div class="lg:col-span-2 space-y-6">
              <div>
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ product.name }}</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400">SKU: {{ product.sku }}</p>
                  </div>
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">${{ product.price.toFixed(2) }}</div>
                </div>
                
                <div class="mt-4">
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
                  
                  <span class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300">
                    {{ getCategoryName(product.categoryId) }}
                  </span>
                </div>
                
                <div class="mt-4 prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-400">
                  <p>{{ product.description }}</p>
                </div>
              </div>
              
              <!-- Inventory Information -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Inventory Information</h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div class="text-sm text-gray-500 dark:text-gray-400">Total Stock</div>
                    <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{{ product.stock }}</div>
                  </div>
                  
                  <div class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <div class="text-sm text-gray-500 dark:text-gray-400">Location</div>
                    <div class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{{ product.location }}</div>
                  </div>
                </div>
              </div>
              
              <!-- Variants -->
              <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white">Variants</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    left-icon="heroicons:plus"
                    @click="showAddVariantModal = true"
                  >
                    Add Variant
                  </Button>
                </div>
                
                <div class="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg">
                  <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Size
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Color
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          SKU
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Stock
                        </th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      <tr v-for="variant in product.variants" :key="variant.id">
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {{ variant.size }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm">
                          <div class="flex items-center">
                            <div 
                              class="h-4 w-4 rounded-full mr-2" 
                              :style="{ backgroundColor: getColorHex(variant.color) }"
                            ></div>
                            <span class="text-gray-900 dark:text-white">{{ variant.color }}</span>
                          </div>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {{ variant.sku }}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {{ variant.stock }}
                        </td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button 
                            @click="editVariant(variant)" 
                            class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          >
                            Edit<span class="sr-only">, {{ variant.size }} {{ variant.color }}</span>
                          </button>
                          <button 
                            @click="deleteVariant(variant.id)" 
                            class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Product Analytics Tab Content -->
        <div v-if="activeTab === 'analytics'" class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Sales Summary -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Sales Summary</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="text-sm text-gray-500 dark:text-gray-400">Total Units Sold</div>
                    <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      {{ product.salesData?.monthlySales.reduce((sum, item) => sum + item.units, 0) || 0 }}
                    </div>
                  </div>
                  <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div class="text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
                    <div class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                      ${{ (product.salesData?.monthlySales.reduce((sum, item) => sum + item.revenue, 0) || 0).toLocaleString('en-US', { maximumFractionDigits: 2 }) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Top Performing Variants -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div class="p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Performing Variants</h3>
                <div class="space-y-4">
                  <div v-for="(variant, index) in topVariants" :key="index" class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <div class="h-6 w-6 rounded-full" :style="{ backgroundColor: getColorHex(variant.color) }"></div>
                    </div>
                    <div class="ml-4 flex-1">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ variant.size }} / {{ variant.color }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ variant.sales }} units sold</div>
                    </div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">${{ variant.revenue.toLocaleString('en-US', { maximumFractionDigits: 2 }) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Weekly Sales Chart -->
            <div class="lg:col-span-2">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly Sales</h3>
                <div class="h-72">
                  <WeeklySalesChart :data="product.salesData?.weeklySales || []" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add/Edit Variant Modal -->
      <Modal 
        v-model="showVariantModal" 
        :title="editingVariant ? 'Edit Variant' : 'Add Variant'"
        size="md"
      >
        <form @submit.prevent="saveVariant" class="space-y-4">
          <!-- Size -->
          <div>
            <label for="variant-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
            <select
              id="variant-size"
              v-model="variantForm.size"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            >
              <option disabled value="">Select a size</option>
              <option v-for="size in productStore.availableSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
          
          <!-- Color -->
          <div>
            <label for="variant-color" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Color</label>
            <select
              id="variant-color"
              v-model="variantForm.color"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            >
              <option disabled value="">Select a color</option>
              <option v-for="color in productStore.availableColors" :key="color.name" :value="color.name">{{ color.name }}</option>
            </select>
          </div>
          
          <!-- SKU -->
          <div>
            <label for="variant-sku" class="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
            <input
              id="variant-sku"
              v-model="variantForm.sku"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>
          
          <!-- Stock -->
          <div>
            <label for="variant-stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Stock</label>
            <input
              id="variant-stock"
              v-model.number="variantForm.stock"
              type="number"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              required
            />
          </div>
          
          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="secondary"
              @click="showVariantModal = false"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
            >
              {{ editingVariant ? 'Update' : 'Add' }} Variant
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useProductStore } from '~/stores/useProductStore';
  import Button from '~/components/ui/Button.vue';
  import Modal from '~/components/ui/Modal.vue';
  import WeeklySalesChart from '~/components/products/WeeklySalesChart.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const route = useRoute();
  const productStore = useProductStore();
  
  // State
  const productId = computed(() => route.params.id);
  const activeTab = ref('details');
  const showVariantModal = ref(false);
  const editingVariant = ref(null);
  const variantForm = ref({
    size: '',
    color: '',
    sku: '',
    stock: 0
  });
  
  // Tabs
  const tabs = [
    { id: 'details', label: 'Product Details', icon: 'heroicons:cube' },
    { id: 'analytics', label: 'Analytics', icon: 'heroicons:chart-bar' }
  ];
  
  // Status labels
  const statusLabels = {
    active: 'Active',
    draft: 'Draft',
    inactive: 'Inactive'
  };
  
  // Get the product
  const product = computed(() => {
    return productStore.getProductById(productId.value) || { 
      name: '', 
      description: '', 
      price: 0, 
      sku: '', 
      categoryId: '', 
      status: 'draft', 
      stock: 0, 
      images: [], 
      variants: [],
      location: '',
      salesData: { weeklySales: [], monthlySales: [] }
    };
  });
  
  // Top performing variants
  const topVariants = computed(() => {
    // In a real app, this would be actual sales data for variants
    // Here we're creating mock data based on the variants
    return product.value.variants.map(variant => ({
      ...variant,
      sales: Math.floor(Math.random() * 50 + 10),
      revenue: Math.floor(Math.random() * 1000 + 500)
    })).sort((a, b) => b.sales - a.sales).slice(0, 3);
  });
  
  // Helper function to get category name
  const getCategoryName = (categoryId) => {
    const category = productStore.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Get color hex code
  const getColorHex = (colorName) => {
    const color = productStore.availableColors.find(c => c.name === colorName);
    return color ? color.hex : '#CCCCCC';
  };
  
  // Navigation
  const navigateToEdit = () => {
    router.push(`/products/${productId.value}/edit`);
  };
  
  // Toggle product status
  const toggleProductStatus = async () => {
    try {
      const newStatus = product.value.status === 'active' ? 'inactive' : 'active';
      await productStore.updateProductStatus(productId.value, newStatus);
      useNuxtApp().$toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      useNuxtApp().$toast.error('Failed to update product status');
    }
  };
  
  // Variant functions
  const addVariant = () => {
    editingVariant.value = null;
    variantForm.value = {
      size: '',
      color: '',
      sku: `${product.value.sku}-`,
      stock: 0
    };
    showVariantModal.value = true;
  };
  
  const editVariant = (variant) => {
    editingVariant.value = variant;
    variantForm.value = {
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      stock: variant.stock
    };
    showVariantModal.value = true;
  };
  
  const saveVariant = async () => {
    try {
      if (editingVariant.value) {
        // Update existing variant
        await productStore.updateVariant(
          productId.value,
          editingVariant.value.id,
          variantForm.value
        );
        useNuxtApp().$toast.success('Variant updated successfully');
      } else {
        // Add new variant
        await productStore.addVariant(
          productId.value,
          variantForm.value
        );
        useNuxtApp().$toast.success('Variant added successfully');
      }
      showVariantModal.value = false;
    } catch (error) {
      useNuxtApp().$toast.error('Failed to save variant');
    }
  };
  
  const deleteVariant = async (variantId) => {
    if (confirm('Are you sure you want to delete this variant?')) {
      try {
        await productStore.deleteVariant(productId.value, variantId);
        useNuxtApp().$toast.success('Variant deleted successfully');
      } catch (error) {
        useNuxtApp().$toast.error('Failed to delete variant');
      }
    }
  };
  
  // Fetch product data on mount
  onMounted(async () => {
    if (productStore.products.length === 0) {
      await productStore.fetchProducts();
    }
    
    if (productStore.categories.length === 0) {
      await productStore.fetchCategories();
    }
  });
  </script>