<!-- components/dashboard/DashboardRecentProducts.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Recently Added Products</h3>
        <Button
          variant="link"
          size="sm"
          @click="$emit('view-all')"
        >
          View all
        </Button>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        
        <EmptyState
          v-else-if="products.length === 0"
          icon="heroicons:cube"
          message="No products found"
          action-label="Add Product"
          action-icon="heroicons:plus"
          @action="$emit('add-product')"
        />
        
        <div 
          v-else
          v-for="product in products"
          :key="product.id"
          class="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <!-- Product image -->
          <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover object-center"
            />
            <div 
              v-else
              class="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
            >
              <Icon name="heroicons:photo" class="h-8 w-8" />
            </div>
          </div>
          
          <!-- Product info -->
          <div class="ml-4 flex-1">
            <div class="flex justify-between">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</h4>
              <p v-if="product.price" class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatPrice(product.price) }}
              </p>
            </div>
            
            <div class="mt-1 flex items-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Added {{ formatDate(product.createdAt) }}
              </p>
              <span 
                v-if="product.isNew" 
                class="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300"
              >
                New
              </span>
            </div>
            
            <div class="mt-1 flex space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <!-- Stock status -->
              <span :class="[
                product.stock > 10 ? 'text-green-700 dark:text-green-400' : 
                product.stock > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-red-700 dark:text-red-400'
              ]">
                {{ 
                  product.stock > 10 ? 'In Stock' : 
                  product.stock > 0 ? `Low Stock (${product.stock})` : 'Out of Stock'
                }}
              </span>
              
              <!-- Category -->
              <span class="before:content-['•'] before:mx-1">{{ product.category }}</span>
              
              <!-- SKU -->
              <span v-if="product.sku" class="before:content-['•'] before:mx-1">SKU: {{ product.sku }}</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="ml-4">
            <Menu as="div" class="relative inline-block text-left">
              <MenuButton class="flex items-center text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <span class="sr-only">Open options</span>
                <Icon name="heroicons:ellipsis-vertical" class="h-5 w-5" />
              </MenuButton>
              
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="$emit('edit-product', product)"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        Edit
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="$emit('view-product', product)"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        View details
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="$emit('duplicate-product', product)"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        Duplicate
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
      
      <div v-if="products.length > 0 && hasMore" class="px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          full-width
          :disabled="loadingMore"
          @click="$emit('load-more')"
        >
          <Icon v-if="loadingMore" name="heroicons:arrow-path" class="h-4 w-4 mr-2 animate-spin" />
          {{ loadingMore ? 'Loading more...' : 'Load more products' }}
        </Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { format, formatDistanceToNow, parseISO } from 'date-fns';
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  import EmptyState from '~/components/common/EmptyState.vue';
  import Button from '~/components/ui/Button.vue';
  
  interface Product {
    id: number;
    name: string;
    price?: number;
    image?: string;
    stock: number;
    category: string;
    sku?: string;
    createdAt: string;
    isNew?: boolean;
  }
  
  const props = defineProps<{
    products: Product[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
  }>();
  
  defineEmits(['view-all', 'add-product', 'edit-product', 'view-product', 'duplicate-product', 'load-more']);
  
  // Helper functions
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const formatDate = (dateString: string): string => {
    try {
      return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  </script>