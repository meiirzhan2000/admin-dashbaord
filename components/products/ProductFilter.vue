<!-- components/products/ProductFilter.vue -->
<template>
    <div class="p-4">
      <div class="space-y-6">
        <!-- Price Range Slider -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Price Range</h3>
          <div class="flex items-center space-x-3">
            <div class="relative mt-1 rounded-md shadow-sm w-full">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                v-model.number="localFilters.priceRange[0]"
                min="0"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-7 pr-3 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Min"
              />
            </div>
            <span class="text-gray-500 dark:text-gray-400">to</span>
            <div class="relative mt-1 rounded-md shadow-sm w-full">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                v-model.number="localFilters.priceRange[1]"
                min="0"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-7 pr-3 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        
        <!-- Stock Range Slider -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Stock Level</h3>
          <div class="flex items-center space-x-3">
            <div class="relative mt-1 rounded-md shadow-sm w-full">
              <input
                type="number"
                v-model.number="localFilters.stockRange[0]"
                min="0"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 px-3 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Min"
              />
            </div>
            <span class="text-gray-500 dark:text-gray-400">to</span>
            <div class="relative mt-1 rounded-md shadow-sm w-full">
              <input
                type="number"
                v-model.number="localFilters.stockRange[1]"
                min="0"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 px-3 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
        
        <!-- Size Selection -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Size</h3>
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="size in productStore.availableSizes" 
              :key="size"
              @click="toggleSize(size)"
              :class="[
                'flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium cursor-pointer',
                localFilters.sizes.includes(size)
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300'
                  : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ size }}
            </div>
          </div>
        </div>
        
        <!-- Color Selection -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Color</h3>
          <div class="grid grid-cols-5 gap-2">
            <div 
              v-for="color in productStore.availableColors" 
              :key="color.name"
              @click="toggleColor(color.name)"
              :class="[
                'flex flex-col items-center justify-center p-2 rounded-md cursor-pointer transition-all',
                localFilters.colors.includes(color.name)
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              <div 
                class="w-6 h-6 rounded-full mb-1" 
                :style="{ backgroundColor: color.hex }"
                :class="{'border border-gray-300 dark:border-gray-600': color.name === 'White'}"
              ></div>
              <span class="text-xs text-gray-700 dark:text-gray-300">{{ color.name }}</span>
            </div>
          </div>
        </div>
        
        <!-- Location Selection -->
        <div>
          <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Location</h3>
          <div class="space-y-2">
            <div 
              v-for="location in productStore.availableLocations" 
              :key="location"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :id="`location-${location}`"
                :value="location"
                v-model="localFilters.locations"
                class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
              />
              <label :for="`location-${location}`" class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ location }}
              </label>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            @click="resetAndEmit"
          >
            Reset
          </Button>
          <Button
            variant="primary"
            @click="applyFilters"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useProductStore } from '~/stores/useProductStore';
  import Button from '~/components/ui/Button.vue';
  
  const props = defineProps({
    modelValue: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'apply', 'reset']);
  
  const productStore = useProductStore();
  
  // Create a local copy of the filters
  const localFilters = ref({ ...props.modelValue });
  
  // Watch for external changes
  watch(() => props.modelValue, (newValue) => {
    localFilters.value = { ...newValue };
  }, { deep: true });
  
  // Size toggle
  const toggleSize = (size) => {
    const index = localFilters.value.sizes.indexOf(size);
    if (index === -1) {
      localFilters.value.sizes.push(size);
    } else {
      localFilters.value.sizes.splice(index, 1);
    }
  };
  
  // Color toggle
  const toggleColor = (color) => {
    const index = localFilters.value.colors.indexOf(color);
    if (index === -1) {
      localFilters.value.colors.push(color);
    } else {
      localFilters.value.colors.splice(index, 1);
    }
  };
  
  // Apply filters
  const applyFilters = () => {
    emit('update:modelValue', { ...localFilters.value });
    emit('apply');
  };
  
  // Reset filters
  const resetAndEmit = () => {
    localFilters.value = {
      priceRange: [0, 1000],
      stockRange: [0, 1000],
      sizes: [],
      colors: [],
      locations: []
    };
    
    emit('update:modelValue', { ...localFilters.value });
    emit('reset');
  };
  </script>