<!-- components/dashboard/DashboardStats.vue -->
<template>
    <div class="border-b border-b-gray-900/10 dark:border-b-gray-100/10 lg:border-t lg:border-t-gray-900/5 dark:lg:border-t-gray-100/5">
      <dl class="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:px-2 xl:px-0">
        <div 
          v-for="(stat, statIdx) in stats" 
          :key="stat.name" 
          :class="[
            statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '', 
            'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-gray-900/5 dark:border-gray-100/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8',
            'dark:border-gray-700'
          ]"
        >
          <dt class="text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">{{ stat.name }}</dt>
          <dd 
            :class="[
              stat.changeType === 'negative' ? 'text-rose-600 dark:text-rose-400' : 'text-green-600 dark:text-green-400', 
              'text-xs font-medium'
            ]"
          >
            {{ stat.change }}
          </dd>
          <dd class="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 dark:text-white">
            {{ stat.value }}
          </dd>
        </div>
      </dl>
    </div>
  
    <!-- Decorative background elements -->
    <div 
      class="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50" 
      aria-hidden="true"
    >
      <div 
        class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]" 
        style="clip-path: polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)" 
      />
    </div>
  </template>
  
  <script setup>
  defineProps({
    stats: {
      type: Array,
      required: true
    }
  });
  </script>