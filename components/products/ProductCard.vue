<!-- components/products/ProductCard.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg group transition-all hover:shadow-md">
      <!-- Product Image -->
      <div class="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <img 
          v-if="product.images && product.images.length > 0"
          :src="product.images[0]" 
          :alt="product.name"
          class="h-full w-full object-cover object-center"
        />
        <div 
          v-else 
          class="h-full w-full flex items-center justify-center"
        >
          <Icon name="heroicons:photo" class="h-12 w-12 text-gray-400" />
        </div>
        
        <!-- Status Badge -->
        <div class="absolute top-2 left-2">
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
        </div>
        
        <!-- Quick Actions -->
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div class="flex space-x-2">
            <button 
              @click.stop="$emit('view', product)"
              class="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
              title="View Details"
            >
              <Icon name="heroicons:eye" class="h-5 w-5" />
            </button>
            <button 
              @click.stop="$emit('edit', product)"
              class="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
              title="Edit Product"
            >
              <Icon name="heroicons:pencil-square" class="h-5 w-5" />
            </button>
            <button 
              @click.stop="$emit('toggle-status', product)"
              class="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100"
              :title="product.status === 'active' ? 'Deactivate Product' : 'Activate Product'"
            >
              <Icon 
                :name="product.status === 'active' ? 'heroicons:pause' : 'heroicons:play'" 
                class="h-5 w-5" 
              />
            </button>
            <button 
              @click.stop="$emit('delete', product)"
              class="bg-white text-red-600 p-2 rounded-full hover:bg-gray-100"
              title="Delete Product"
            >
              <Icon name="heroicons:trash" class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="p-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1 truncate">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">SKU: {{ product.sku }}</p>
          </div>
          <div class="text-lg font-semibold text-gray-900 dark:text-white">${{ product.price.toFixed(2) }}</div>
        </div>
        
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center">
            <Icon name="heroicons:cube-transparent" class="h-5 w-5 text-gray-500 dark:text-gray-400 mr-1" />
            <span 
              :class="[
                'text-sm font-medium',
                getStockColorClass(product.stock)
              ]"
            >
              {{ product.stock }} in stock
            </span>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ getCategoryName(product.categoryId) }}
          </div>
        </div>
        
        <!-- Variant Preview -->
        <div class="mt-3 flex flex-wrap gap-1">
          <div 
            v-for="(color, index) in uniqueColors" 
            :key="color"
            v-show="index < 5"
            :style="{ backgroundColor: getColorHex(color) }"
            class="w-5 h-5 rounded-full border border-gray-200 dark:border-gray-700"
            :title="color"
          ></div>
          <div 
            v-if="uniqueColors.length > 5"
            class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs flex items-center justify-center text-gray-500 dark:text-gray-400"
            :title="`${uniqueColors.length - 5} more colors`"
          >
            +{{ uniqueColors.length - 5 }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useProductStore } from '~/stores/useProductStore';
  
  const props = defineProps({
    product: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['view', 'edit', 'toggle-status', 'delete']);
  
  const productStore = useProductStore();
  
  // Status labels for display
  const statusLabels = {
    active: 'Active',
    draft: 'Draft',
    inactive: 'Inactive'
  };
  
  // Get CSS class for stock status
  const getStockColorClass = (stock) => {
    if (stock <= 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (stock < 10) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  };
  
  // Helper function to get category name
  const getCategoryName = (categoryId) => {
    const category = productStore.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  // Extract unique colors from product variants
  const uniqueColors = computed(() => {
    const colors = new Set();
    if (props.product.variants) {
      props.product.variants.forEach(variant => {
        colors.add(variant.color);
      });
    }
    return Array.from(colors);
  });
  
  // Get color hex code for display
  const getColorHex = (colorName) => {
    const color = productStore.availableColors.find(c => c.name === colorName);
    return color ? color.hex : '#CCCCCC';
  };
  </script>