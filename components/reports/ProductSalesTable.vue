<!-- components/reports/ProductSalesTable.vue -->
<template>
    <div>
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div class="w-full sm:w-64 mb-4 sm:mb-0">
          <SearchInput
            v-model="searchQuery"
            placeholder="Search products..."
            icon-name="heroicons:magnifying-glass"
          />
        </div>
        
        <div class="flex items-center">
          <label class="mr-2 text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
          <select 
            v-model="sortBy"
            class="form-select rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="sales">Sales (Units)</option>
            <option value="revenue">Revenue</option>
            <option value="growth">Growth</option>
            <option value="price">Price</option>
            <option value="stock">Stock Level</option>
          </select>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
      
      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sales (Units)
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Growth
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="product in filteredProducts" 
              :key="product.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <img 
                      v-if="product.image" 
                      :src="product.image" 
                      alt=""
                      class="h-full w-full object-cover"
                    />
                    <div v-else class="h-full w-full flex items-center justify-center">
                      <Icon name="heroicons:squares-2x2" class="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ product.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ product.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${{ product.price.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getStockStatusClass(product.stock)
                  ]"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ product.sales }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ product.revenue.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Icon 
                    :name="product.growth >= 0 ? 'heroicons:arrow-up' : 'heroicons:arrow-down'" 
                    :class="[
                      'h-4 w-4 mr-1',
                      product.growth >= 0 ? 'text-green-500' : 'text-red-500'
                    ]"
                  />
                  <span 
                    :class="[
                      'text-sm',
                      product.growth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    ]"
                  >
                    {{ Math.abs(product.growth) }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty state -->
        <div v-if="filteredProducts.length === 0" class="py-8 text-center">
          <Icon name="heroicons:magnifying-glass" class="h-12 w-12 mx-auto text-gray-400" />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No products match your search criteria</p>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="filteredProducts.length > 0" class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing <span class="font-medium">{{ filteredProducts.length }}</span> of <span class="font-medium">{{ products.length }}</span> products
        </div>
        
        <button
          class="bg-white dark:bg-gray-700 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          View All Products
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import SearchInput from '~/components/common/SearchInput.vue';
  
  const props = defineProps({
    products: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  // State
  const searchQuery = ref('');
  const sortBy = ref('sales');
  
  // Get filtered and sorted products
  const filteredProducts = computed(() => {
    let result = [...props.products];
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query)
      );
    }
    
    // Sort by selected field
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'sales':
          return b.sales - a.sales;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'growth':
          return b.growth - a.growth;
        case 'price':
          return b.price - a.price;
        case 'stock':
          return a.stock - b.stock;
        default:
          return b.sales - a.sales;
      }
    });
    
    return result;
  });
  
  // Get CSS class for stock status
  const getStockStatusClass = (stock) => {
    if (stock < 50) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    } else if (stock < 100) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    } else {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    }
  };
  </script>