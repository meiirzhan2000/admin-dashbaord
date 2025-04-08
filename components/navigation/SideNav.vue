<!-- components/navigation/SideNav.vue -->
<template>
    <aside class="fixed inset-y-0 left-0 bg-gray-800 dark:bg-gray-950 w-64 hidden md:block shadow-lg">
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="h-16 flex items-center justify-center px-4 bg-gray-900 dark:bg-black">
          <h1 class="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 mt-6 px-2 space-y-1">
          <NuxtLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg"
            :class="[
              route.path === item.href
                ? 'bg-purple-800 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]"
          >
            <span class="mr-3 h-6 w-6 flex items-center justify-center">
              <Icon :name="item.icon" class="h-5 w-5" aria-hidden="true" />
            </span>
            {{ item.name }}
          </NuxtLink>
        </nav>
        
        <!-- User profile -->
        <div class="p-4 border-t border-gray-700 dark:border-gray-800">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                {{ userInitials }}
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-white">{{ authStore.user?.name || 'User' }}</p>
              <p class="text-xs font-medium text-gray-400">{{ authStore.user?.role || 'User' }}</p>
            </div>
          </div>
          <button
            @click="authStore.logout"
            class="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-700 hover:bg-purple-800"
          >
            <Icon name="heroicons:arrow-right-on-rectangle" class="h-4 w-4 mr-2" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuthStore } from '~/stores/useAuthStore';
  
  const route = useRoute();
  const authStore = useAuthStore();
  
  // Navigation items
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'heroicons:home' },
    { name: 'Products', href: '/products', icon: 'heroicons:cube' },
  ];
  
  // Compute user initials for avatar
  const userInitials = computed(() => {
    if (!authStore.user?.name) return '';
    
    const names = authStore.user.name.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  });
  </script>