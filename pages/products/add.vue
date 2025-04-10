<!-- pages/products/add.vue -->
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
          Add New Product
        </h1>
      </div>
  
      <ProductForm
        :is-submitting="isSubmitting"
        @submit="submitProduct"
        @cancel="router.back()"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProductStore } from '~/stores/useProductStore';
  import ProductForm from '~/components/products/ProductForm.vue';
  
  definePageMeta({
    middleware: ['auth']
  });
  
  const router = useRouter();
  const productStore = useProductStore();
  const isSubmitting = ref(false);
  
  // Submit the product
  const submitProduct = async (productData) => {
    try {
      isSubmitting.value = true;
      const newProduct = await productStore.addProduct(productData);
      
      useNuxtApp().$toast.success('Product created successfully');
      
      // Navigate to the product detail page
      router.push(`/products/${newProduct.id}`);
    } catch (error) {
      useNuxtApp().$toast.error('Failed to create product');
      console.error('Error creating product:', error);
    } finally {
      isSubmitting.value = false;
    }
  };
  
  // Fetch categories on mount if needed
  onMounted(async () => {
    if (productStore.categories.length === 0) {
      await productStore.fetchCategories();
    }
  });
  </script>