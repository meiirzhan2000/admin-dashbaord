<!-- components/dashboard/DashboardRecentClients.vue -->
<template>
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold leading-7 text-gray-900 dark:text-white">Recent clients</h2>
          <a href="#" class="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
            View all<span class="sr-only">, clients</span>
          </a>
        </div>
        
        <ul role="list" class="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
          <li 
            v-for="client in clients" 
            :key="client.id" 
            class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-center gap-x-4 border-b border-gray-900/5 dark:border-gray-100/5 bg-gray-50 dark:bg-gray-800 p-6">
              <img 
                :src="client.imageUrl" 
                :alt="client.name" 
                class="h-12 w-12 flex-none rounded-lg bg-white dark:bg-gray-700 object-cover ring-1 ring-gray-900/10 dark:ring-white/10" 
              />
              <div class="text-sm font-medium leading-6 text-gray-900 dark:text-white">{{ client.name }}</div>
              
              <Menu as="div" class="relative ml-auto">
                <MenuButton class="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                  <span class="sr-only">Open options</span>
                  <Icon name="heroicons:ellipsis-horizontal" class="h-5 w-5" aria-hidden="true" />
                </MenuButton>
                
                <transition 
                  enter-active-class="transition ease-out duration-100" 
                  enter-from-class="transform opacity-0 scale-95" 
                  enter-to-class="transform opacity-100 scale-100" 
                  leave-active-class="transition ease-in duration-75" 
                  leave-from-class="transform opacity-100 scale-100" 
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-800 py-2 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/5 focus:outline-none">
                    <MenuItem v-slot="{ active }">
                      <a 
                        href="#" 
                        :class="[
                          active ? 'bg-gray-50 dark:bg-gray-700' : '', 
                          'block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white'
                        ]"
                      >
                        View<span class="sr-only">, {{ client.name }}</span>
                      </a>
                    </MenuItem>
                    
                    <MenuItem v-slot="{ active }">
                      <a 
                        href="#" 
                        :class="[
                          active ? 'bg-gray-50 dark:bg-gray-700' : '', 
                          'block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-white'
                        ]"
                      >
                        Edit<span class="sr-only">, {{ client.name }}</span>
                      </a>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
            
            <dl class="-my-3 divide-y divide-gray-100 dark:divide-gray-700 px-6 py-4 text-sm leading-6">
              <div class="flex justify-between gap-x-4 py-3">
                <dt class="text-gray-500 dark:text-gray-400">Last invoice</dt>
                <dd class="text-gray-700 dark:text-gray-300">
                  <time :datetime="client.lastInvoice.dateTime">{{ client.lastInvoice.date }}</time>
                </dd>
              </div>
              
              <div class="flex justify-between gap-x-4 py-3">
                <dt class="text-gray-500 dark:text-gray-400">Amount</dt>
                <dd class="flex items-start gap-x-2">
                  <div class="font-medium text-gray-900 dark:text-white">{{ client.lastInvoice.amount }}</div>
                  <div 
                    :class="[
                      statuses[client.lastInvoice.status], 
                      'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                    ]"
                  >
                    {{ client.lastInvoice.status }}
                  </div>
                </dd>
              </div>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
  
  defineProps({
    clients: {
      type: Array,
      required: true
    },
    statuses: {
      type: Object,
      required: true
    }
  });
  </script>