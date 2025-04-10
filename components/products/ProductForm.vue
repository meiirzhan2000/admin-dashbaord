<!-- components/products/ProductForm.vue -->
<template>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Basic Information</h2>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Product Name -->
            <div class="col-span-2">
              <label for="product-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Product Name *
              </label>
              <input
                id="product-name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Enter product name"
              />
            </div>
            
            <!-- SKU -->
            <div>
              <label for="product-sku" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SKU *
              </label>
              <input
                id="product-sku"
                v-model="form.sku"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Enter SKU"
              />
            </div>
            
            <!-- Category -->
            <div>
              <label for="product-category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                id="product-category"
                v-model="form.categoryId"
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in productStore.categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            
            <!-- Price -->
            <div>
              <label for="product-price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Price *
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                </div>
                <input
                  id="product-price"
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="pl-7 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <!-- Location -->
            <div>
              <label for="product-location" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location *
              </label>
              <select
                id="product-location"
                v-model="form.location"
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="" disabled>Select a location</option>
                <option v-for="location in productStore.availableLocations" :key="location" :value="location">
                  {{ location }}
                </option>
              </select>
            </div>
            
            <!-- Status -->
            <div>
              <label for="product-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status *
              </label>
              <select
                id="product-status"
                v-model="form.status"
                required
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <!-- Description -->
            <div class="col-span-2">
              <label for="product-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="product-description"
                v-model="form.description"
                rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Describe your product..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Product Images -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="p-6">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-6">Product Images</h2>
          
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <!-- Image Upload -->
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Images
              </label>
              <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <Icon name="heroicons:photo" class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="flex text-sm text-gray-600 dark:text-gray-400">
                    <label for="file-upload" class="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none">
                      <span>Upload images</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" multiple accept="image/*" />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Image Previews -->
            <div class="col-span-2" v-if="form.images.length > 0">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Previews
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div 
                  v-for="(image, index) in form.images" 
                  :key="index"
                  class="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 h-32"
                >
                  <img :src="image" :alt="`Preview ${index + 1}`" class="h-full w-full object-cover" />
                  <button 
                    @click.prevent="removeImage(index)" 
                    class="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                    title="Remove image"
                  >
                    <Icon name="heroicons:x-mark" class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Variants / Inventory -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Variants</h2>
            <Button
              variant="outline"
              size="sm"
              left-icon="heroicons:plus"
              @click="addVariant"
            >
              Add Variant
            </Button>
          </div>
          
          <div v-if="form.variants.length > 0" class="mb-6">
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
                  <tr v-for="(variant, index) in form.variants" :key="index">
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
                        @click.prevent="editVariant(index)" 
                        class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Edit<span class="sr-only">, {{ variant.size }} {{ variant.color }}</span>
                      </button>
                      <button 
                        @click.prevent="removeVariant(index)" 
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
          
          <div v-else class="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
            <Icon name="heroicons:squares-plus" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No variants</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by adding a variant for your product.
            </p>
            <div class="mt-6">
              <Button
                variant="primary"
                left-icon="heroicons:plus"
                @click="addVariant"
              >
                Add Variant
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Form Actions -->
      <div class="flex justify-end space-x-3">
        <Button
          variant="secondary"
          @click="$emit('cancel')"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          :disabled="isSubmitting"
        >
          <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-2" />
          {{ isEditMode ? 'Update' : 'Create' }} Product
        </Button>
      </div>
      
      <!-- Variant Modal -->
      <Modal
        v-model="showVariantModal"
        :title="editingVariantIndex !== null ? 'Edit Variant' : 'Add Variant'"
      >
        <div class="space-y-4">
          <!-- Size -->
          <div>
            <label for="variant-size" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Size</label>
            <select
              id="variant-size"
              v-model="variantForm.size"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="" disabled>Select a size</option>
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
            >
              <option value="" disabled>Select a color</option>
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
            />
          </div>
          
          <!-- Actions -->
          <div class="mt-6 flex justify-end space-x-3">
            <Button
              variant="secondary"
              @click="showVariantModal = false"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              @click="saveVariant"
            >
              {{ editingVariantIndex !== null ? 'Update' : 'Add' }} Variant
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import { useProductStore } from '~/stores/useProductStore';
  import Button from '~/components/ui/Button.vue';
  import Modal from '~/components/ui/Modal.vue';
  
  const props = defineProps({
    product: {
      type: Object,
      default: () => ({
        name: '',
        description: '',
        price: 0,
        sku: '',
        categoryId: '',
        status: 'draft',
        stock: 0,
        location: '',
        images: [],
        variants: []
      })
    },
    isSubmitting: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['submit', 'cancel']);
  
  const productStore = useProductStore();
  
  // Determine if we're in edit mode
  const isEditMode = computed(() => !!props.product.id);
  
  // Create a form object with the product data
  const form = ref({
    name: props.product.name,
    description: props.product.description,
    price: props.product.price,
    sku: props.product.sku,
    categoryId: props.product.categoryId,
    status: props.product.status,
    location: props.product.location,
    images: [...(props.product.images || [])],
    variants: [...(props.product.variants || [])]
  });
  
  // Watch for changes in the product prop
  watch(() => props.product, (newProduct) => {
    form.value = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      sku: newProduct.sku,
      categoryId: newProduct.categoryId,
      status: newProduct.status,
      location: newProduct.location,
      images: [...(newProduct.images || [])],
      variants: [...(newProduct.variants || [])]
    };
  }, { deep: true });
  
  // Variant management
  const showVariantModal = ref(false);
  const editingVariantIndex = ref(null);
  const variantForm = ref({
    size: '',
    color: '',
    sku: '',
    stock: 0
  });
  
  // Get color hex code
  const getColorHex = (colorName) => {
    const color = productStore.availableColors.find(c => c.name === colorName);
    return color ? color.hex : '#CCCCCC';
  };
  
  // Add/edit variant
  const addVariant = () => {
    editingVariantIndex.value = null;
    variantForm.value = {
      size: '',
      color: '',
      sku: `${form.value.sku}-`,
      stock: 0
    };
    showVariantModal.value = true;
  };
  
  const editVariant = (index) => {
    editingVariantIndex.value = index;
    const variant = form.value.variants[index];
    variantForm.value = { ...variant };
    showVariantModal.value = true;
  };
  
  const saveVariant = () => {
    // Validate the form
    if (!variantForm.value.size || !variantForm.value.color || !variantForm.value.sku) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Check for duplicate size/color combination
    const isDuplicate = form.value.variants.some((v, index) => {
      if (editingVariantIndex.value !== null && index === editingVariantIndex.value) {
        return false; // Skip the one we're editing
      }
      return v.size === variantForm.value.size && v.color === variantForm.value.color;
    });
    
    if (isDuplicate) {
      alert('A variant with this size and color already exists');
      return;
    }
    
    if (editingVariantIndex.value !== null) {
      // Update existing variant
      form.value.variants[editingVariantIndex.value] = { ...variantForm.value };
    } else {
      // Add new variant
      form.value.variants.push({ ...variantForm.value });
    }
    
    // Update total stock
    calculateTotalStock();
    
    // Close the modal
    showVariantModal.value = false;
  };
  
  const removeVariant = (index) => {
    if (confirm('Are you sure you want to remove this variant?')) {
      form.value.variants.splice(index, 1);
      calculateTotalStock();
    }
  };
  
  // Calculate total stock based on variants
  const calculateTotalStock = () => {
    form.value.stock = form.value.variants.reduce((total, variant) => total + variant.stock, 0);
  };
  
  // Image handling
  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files.length) return;
    
    // In a real app, you would upload these files to a server and get URLs back
    // For this example, we'll create temporary URL objects
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.value.images.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input
    event.target.value = null;
  };
  
  const removeImage = (index) => {
    form.value.images.splice(index, 1);
  };
  
  // Submit the form
  const submitForm = () => {
    // Validate the form
    if (!form.value.name || !form.value.sku || !form.value.categoryId || !form.value.location) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Emit the form data
    emit('submit', { ...form.value });
  };
  </script>