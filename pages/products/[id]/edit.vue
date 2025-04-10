<!-- pages/products/[id]/edit.vue -->
<template>
    <div>
      <div class="flex items-center mb-6">
        <button 
          @click="router.back()" 
          class="mr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <Icon name="heroicons:arrow-left" class="h-5 w-5" />
        </button>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Edit Product: {{ product.name }}
        </h1>
      </div>
  
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin h-8 w-8 border-2 border-indigo-600 rounded-full border-t-transparent"></div>
      </div>
  
      <!-- Product form -->
      <ProductForm
        v-else
        :product="product"
        :is-submitting="isSubmitting"
        @submit="updateProduct"
        @cancel="router.back()"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useProductStore } from '~/stores/useProductStore';
  import ProductForm from '~/components/products/ProductForm.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const route = useRoute();
  const productStore = useProductStore();
  
  const isLoading = ref(true);
  const isSubmitting = ref(false);
  
  const productId = computed(() => route.params.id);
  
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
      location: ''
    };
  });
  
  // Update the product
  const updateProduct = async (productData) => {
    try {
      isSubmitting.value = true;
      await productStore.updateProduct(productId.value, productData);
      
      useNuxtApp().$toast.success('Product updated successfully');
      
      // Navigate to the product detail page
      router.push(`/products/${productId.value}`);
    } catch (error) {
      useNuxtApp().$toast.error('Failed to update product');
      console.error('Error updating product:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Fetch product data on mount
  onMounted(async () => {
    try {
      isLoading.value = true;
      
      // Fetch products if not already loaded
      if (productStore.products.length === 0) {
        await productStore.fetchProducts();
      }
      
      // Fetch categories if not already loaded
      if (productStore.categories.length === 0) {
        await productStore.fetchCategories();
      }
      
      // Check if the product exists
      if (!productStore.getProductById(productId.value)) {
        useNuxtApp().$toast.error('Product not found');
        router.push('/products');
      }
    } catch (error) {
      useNuxtApp().$toast.error('Failed to load product data');
      console.error('Error loading product data:', error);
    } finally {
      isLoading.value = false;
    }
  });
  </script>