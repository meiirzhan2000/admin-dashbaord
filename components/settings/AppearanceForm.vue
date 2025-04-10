<!-- components/settings/AppearanceForm.vue -->
<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Customize how the dashboard looks and feels
        </p>
      </div>
      
      <form @submit.prevent="$emit('submit', settings)" class="p-6 space-y-6">
        <!-- Theme -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h4>
          
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="theme in themes"
              :key="theme.value"
              class="cursor-pointer"
              @click="settings.theme = theme.value"
            >
              <div 
                class="relative border-2 rounded-lg overflow-hidden h-24"
                :class="settings.theme === theme.value ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-700'"
              >
                <div class="flex h-full">
                  <div 
                    class="w-1/4 h-full"
                    :class="theme.value === 'dark' ? 'bg-gray-800' : theme.value === 'light' ? 'bg-gray-200' : 'bg-gradient-to-r from-gray-200 to-gray-800'"
                  ></div>
                  <div 
                    class="flex-1 p-2"
                    :class="theme.value === 'dark' ? 'bg-gray-900 text-white' : theme.value === 'light' ? 'bg-white text-black' : ''"
                  >
                    <div class="h-2 w-16 mb-2 rounded" :class="theme.value === 'dark' ? 'bg-gray-700' : 'bg-gray-300'"></div>
                    <div class="h-2 w-10 mb-2 rounded" :class="theme.value === 'dark' ? 'bg-gray-700' : 'bg-gray-300'"></div>
                    <div class="h-2 w-12 rounded" :class="theme.value === 'dark' ? 'bg-gray-700' : 'bg-gray-300'"></div>
                  </div>
                </div>
                
                <div v-if="settings.theme === theme.value" class="absolute top-1 right-1 bg-indigo-500 text-white rounded-full p-1 shadow-md">
                  <Icon name="heroicons:check" class="h-3 w-3" />
                </div>
              </div>
              <div class="mt-2 text-sm font-medium text-center text-gray-900 dark:text-white">
                {{ theme.label }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Color scheme -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Primary Color</h4>
          
          <div class="grid grid-cols-6 gap-3">
            <div
              v-for="color in colorSchemes"
              :key="color.value"
              class="cursor-pointer"
              @click="settings.colorScheme = color.value"
            >
              <div 
                class="relative h-12 rounded-lg shadow-sm border-2"
                :style="{ backgroundColor: color.hex }"
                :class="settings.colorScheme === color.value ? 'border-gray-700 dark:border-white ring-2 ring-offset-2 ring-gray-500' : 'border-transparent'"
              >
                <div v-if="settings.colorScheme === color.value" class="absolute inset-0 flex items-center justify-center text-white">
                  <Icon name="heroicons:check" class="h-6 w-6 drop-shadow-md" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Typography -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Font Size</h4>
          
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-indigo-600 h-2.5 rounded-full"
              :style="{ width: `${((fontSizeIndex + 1) / fontSizes.length) * 100}%` }"
            ></div>
          </div>
          
          <div class="mt-6 flex items-center justify-between">
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              :disabled="fontSizeIndex === 0"
              @click="decreaseFontSize"
            >
              <Icon name="heroicons:minus" class="h-3.5 w-3.5 mr-1" />
              Smaller
            </button>
            
            <div class="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {{ fontSizes[fontSizeIndex].label }}
            </div>
            
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
              :disabled="fontSizeIndex === fontSizes.length - 1"
              @click="increaseFontSize"
            >
              <Icon name="heroicons:plus" class="h-3.5 w-3.5 mr-1" />
              Larger
            </button>
          </div>
          
          <div
            class="mt-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            :class="fontSizes[fontSizeIndex].class"
          >
            <p class="text-gray-900 dark:text-white mb-2 font-bold">
              Font Preview ({{ fontSizes[fontSizeIndex].value }})
            </p>
            <p class="text-gray-700 dark:text-gray-300">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>
        </div>
        
        <!-- Layout Density -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Layout Density</h4>
            <div class="flex items-center">
              <span class="text-xs text-gray-500 dark:text-gray-400 mr-2">Comfortable</span>
              <button
                type="button"
                @click="toggleDensity"
                :class="[
                  settings.compactMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
                ]"
              >
                <span
                  :class="[
                    settings.compactMode ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  ]"
                ></span>
              </button>
              <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">Compact</span>
            </div>
          </div>
          
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ settings.compactMode ? 'Compact mode optimizes space by reducing padding and margins.' : 'Comfortable mode provides more space between elements.' }}
          </p>
        </div>
        
        <!-- Animation settings -->
        <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Reduced Motion</h4>
            <div>
              <button
                type="button"
                @click="toggleReducedMotion"
                :class="[
                  settings.reducedMotion ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700',
                  'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800'
                ]"
              >
                <span
                  :class="[
                    settings.reducedMotion ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                  ]"
                ></span>
              </button>
            </div>
          </div>
          
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ settings.reducedMotion ? 'Reduced motion is enabled. Animations and transitions are minimized.' : 'Standard animations and transitions are enabled.' }}
          </p>
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            @click="resetSettings"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            :disabled="isSubmitting"
          >
            <Icon v-if="isSubmitting" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, toRefs } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  interface ThemeOption {
    value: 'light' | 'dark' | 'system';
    label: string;
  }
  
  interface ColorScheme {
    value: string;
    label: string;
    hex: string;
  }
  
  interface FontSize {
    value: string;
    label: string;
    class: string;
  }
  
  interface AppearanceSettings {
    theme: 'light' | 'dark' | 'system';
    colorScheme: string;
    fontSize: string;
    compactMode: boolean;
    reducedMotion: boolean;
  }
  
  const props = defineProps<{
    initialSettings: AppearanceSettings;
    isSubmitting: boolean;
  }>();
  
  const emit = defineEmits<{
    (e: 'submit', data: AppearanceSettings): void;
    (e: 'reset'): void;
  }>();
  
  const { initialSettings } = toRefs(props);
  
  // Create a copy of the settings to avoid modifying props directly
  const settings = ref<AppearanceSettings>({ ...initialSettings.value });
  
  // Theme options
  const themes: ThemeOption[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' }
  ];
  
  // Color scheme options
  const colorSchemes: ColorScheme[] = [
    { value: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { value: 'purple', label: 'Purple', hex: '#9333EA' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'green', label: 'Green', hex: '#10B981' },
    { value: 'amber', label: 'Amber', hex: '#F59E0B' },
    { value: 'red', label: 'Red', hex: '#EF4444' }
  ];
  
  // Font size options
  const fontSizes: FontSize[] = [
    { value: 'xs', label: 'Extra Small', class: 'text-xs' },
    { value: 'sm', label: 'Small', class: 'text-sm' },
    { value: 'md', label: 'Medium', class: 'text-base' },
    { value: 'lg', label: 'Large', class: 'text-lg' },
    { value: 'xl', label: 'Extra Large', class: 'text-xl' }
  ];
  
  const fontSizeIndex = computed(() => {
    return fontSizes.findIndex(size => size.value === settings.value.fontSize);
  });
  
  // Methods
  const resetSettings = () => {
    settings.value = { ...initialSettings.value };
    emit('reset');
  };
  
  const increaseFontSize = () => {
    if (fontSizeIndex.value < fontSizes.length - 1) {
      settings.value.fontSize = fontSizes[fontSizeIndex.value + 1].value;
    }
  };
  
  const decreaseFontSize = () => {
    if (fontSizeIndex.value > 0) {
      settings.value.fontSize = fontSizes[fontSizeIndex.value - 1].value;
    }
  };
  
  const toggleDensity = () => {
    settings.value.compactMode = !settings.value.compactMode;
  };
  
  const toggleReducedMotion = () => {
    settings.value.reducedMotion = !settings.value.reducedMotion;
  };
  </script>