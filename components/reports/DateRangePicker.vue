<!-- components/reports/DateRangePicker.vue -->
<template>
    <div class="relative">
      <Button
        variant="outline"
        @click="isOpen = !isOpen"
        class="whitespace-nowrap"
      >
        <Icon name="heroicons:calendar" class="h-5 w-5 mr-2" />
        {{ formattedDateRange }}
        <Icon :name="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" class="h-5 w-5 ml-2" />
      </Button>
  
      <div 
        v-if="isOpen" 
        class="absolute z-10 mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-72 p-4"
      >
        <div class="flex flex-col space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              v-model="startDate"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              v-model="endDate"
              :min="startDate"
              class="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
  
          <div class="flex flex-wrap gap-2">
            <button
              v-for="preset in presets"
              :key="preset.label"
              @click="applyPreset(preset.days)"
              class="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {{ preset.label }}
            </button>
          </div>
          
          <div class="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              @click="cancelSelection"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              @click="applySelection"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({
        start: new Date(),
        end: new Date()
      })
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const isOpen = ref(false);
  const startDate = ref('');
  const endDate = ref('');
  
  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'This month', days: 'month' },
    { label: 'Last month', days: 'lastMonth' }
  ];
  
  // Format date as YYYY-MM-DD for input fields
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Format dates for display
  const formattedDateRange = computed(() => {
    const start = new Date(props.modelValue.start);
    const end = new Date(props.modelValue.end);
    
    const formatOptions = { month: 'short', day: 'numeric' };
    if (start.getFullYear() !== end.getFullYear()) {
      formatOptions.year = 'numeric';
    }
    
    const formattedStart = start.toLocaleDateString('en-US', formatOptions);
    const formattedEnd = end.toLocaleDateString('en-US', formatOptions);
    
    return `${formattedStart} - ${formattedEnd}`;
  });
  
  // Initialize date inputs when the picker is opened
  watch(isOpen, (newValue) => {
    if (newValue) {
      startDate.value = formatDateForInput(props.modelValue.start);
      endDate.value = formatDateForInput(props.modelValue.end);
    }
  });
  
  // Apply preset time ranges
  const applyPreset = (days) => {
    const end = new Date();
    let start;
  
    if (days === 'month') {
      // This month
      start = new Date(end.getFullYear(), end.getMonth(), 1);
    } else if (days === 'lastMonth') {
      // Last month
      start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
      end.setDate(0); // Last day of previous month
    } else {
      // X days ago
      start = new Date();
      start.setDate(end.getDate() - days);
    }
  
    startDate.value = formatDateForInput(start);
    endDate.value = formatDateForInput(end);
  };
  
  const applySelection = () => {
    emit('update:modelValue', {
      start: new Date(startDate.value),
      end: new Date(endDate.value)
    });
    isOpen.value = false;
  };
  
  const cancelSelection = () => {
    isOpen.value = false;
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = (event) => {
    if (isOpen.value && !event.target.closest('.relative')) {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>