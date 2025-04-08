<!-- components/navigation/TopNav.vue -->
<template>
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="flex items-center justify-between h-16 px-4 md:px-6">
        <!-- Mobile menu button -->
        <button 
          type="button" 
          class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="sr-only">Open main menu</span>
          <!-- Icon when menu is closed -->
          <Icon 
            v-if="!isMobileMenuOpen" 
            name="heroicons:bars-3" 
            class="h-6 w-6" 
            aria-hidden="true"
          />
          <!-- Icon when menu is open -->
          <Icon 
            v-else 
            name="heroicons:x-mark" 
            class="h-6 w-6" 
            aria-hidden="true"
          />
        </button>
        
        <!-- Page title -->
        <h1 class="text-lg font-medium text-gray-800 dark:text-white md:hidden">{{ pageTitle }}</h1>
        
        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Theme toggle -->
          <button 
            @click="toggleColorMode" 
            class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <span class="sr-only">Toggle theme</span>
            <!-- Sun icon for dark mode -->
            <Icon 
              v-if="isDark" 
              name="heroicons:sun" 
              class="h-5 w-5"
            />
            <!-- Moon icon for light mode -->
            <Icon 
              v-else 
              name="heroicons:moon"
              class="h-5 w-5"
            />
          </button>
          
          <!-- Notifications button -->
          <button class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
            <span class="sr-only">View notifications</span>
            <Icon name="heroicons:bell" class="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <!-- Mobile menu, show/hide based on menu state -->
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="bg-gray-50 dark:bg-gray-900 shadow-inner">
          <nav class="px-2 pt-2 pb-3 space-y-1">
            <NuxtLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="flex items-center px-3 py-2 text-base font-medium rounded-md"
              :class="[
                route.path === item.href
                  ? 'bg-purple-800 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              ]"
              @click="isMobileMenuOpen = false"
            >
              <span class="mr-3 h-6 w-6 flex items-center justify-center">
                <Icon :name="item.icon" class="h-5 w-5" aria-hidden="true" />
              </span>
              {{ item.name }}
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const isMobileMenuOpen = ref(false);
  const colorMode = useColorMode();
  
  const isDark = computed(() => colorMode.value === 'dark');
  
  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'heroicons:home' },
    { name: 'Products', href: '/products', icon: 'heroicons:cube' },
  ];
  
  // Compute current page title
  const pageTitle = computed(() => {
    const currentRoute = navigation.find(item => item.href === route.path);
    return currentRoute ? currentRoute.name : 'Dashboard';
  });
  
  // Toggle color mode
  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  };
  </script>