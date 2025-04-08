<!-- components/dashboard/DashboardRecentActivity.vue -->
<template>
    <div>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 dark:text-white lg:mx-0 lg:max-w-none">
          Recent activity
        </h2>
      </div>
      
      <div class="mt-6 overflow-hidden border-t border-gray-100 dark:border-gray-800">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <table class="w-full text-left">
              <thead class="sr-only">
                <tr>
                  <th>Amount</th>
                  <th class="hidden sm:table-cell">Client</th>
                  <th>More details</th>
                </tr>
              </thead>
              
              <tbody>
                <template v-for="day in days" :key="day.dateTime">
                  <tr class="text-sm leading-6 text-gray-900 dark:text-white">
                    <th scope="colgroup" colspan="3" class="relative isolate py-2 font-semibold">
                      <time :datetime="day.dateTime">{{ day.date }}</time>
                      <div class="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                      <div class="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                    </th>
                  </tr>
                  
                  <tr v-for="transaction in day.transactions" :key="transaction.id" class="dark:text-gray-300">
                    <td class="relative py-5 pr-6">
                      <div class="flex gap-x-6">
                        <Icon 
                          :name="transaction.icon" 
                          class="hidden h-6 w-5 flex-none text-gray-400 dark:text-gray-500 sm:block" 
                          aria-hidden="true" 
                        />
                        
                        <div class="flex-auto">
                          <div class="flex items-start gap-x-3">
                            <div class="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                              {{ transaction.amount }}
                            </div>
                            <div 
                              :class="[
                                statuses[transaction.status], 
                                'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'
                              ]"
                            >
                              {{ transaction.status }}
                            </div>
                          </div>
                          
                          <div 
                            v-if="transaction.tax" 
                            class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400"
                          >
                            {{ transaction.tax }} tax
                          </div>
                        </div>
                      </div>
                      
                      <div class="absolute bottom-0 right-full h-px w-screen bg-gray-100 dark:bg-gray-700" />
                      <div class="absolute bottom-0 left-0 h-px w-screen bg-gray-100 dark:bg-gray-700" />
                    </td>
                    
                    <td class="hidden py-5 pr-6 sm:table-cell">
                      <div class="text-sm leading-6 text-gray-900 dark:text-white">
                        {{ transaction.client }}
                      </div>
                      <div class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        {{ transaction.description }}
                      </div>
                    </td>
                    
                    <td class="py-5 text-right">
                      <div class="flex justify-end">
                        <a 
                          :href="transaction.href" 
                          class="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          View<span class="hidden sm:inline"> transaction</span>
                          <span class="sr-only">, invoice #{{ transaction.invoiceNumber }}, {{ transaction.client }}</span>
                        </a>
                      </div>
                      
                      <div class="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        Invoice <span class="text-gray-900 dark:text-white">#{{ transaction.invoiceNumber }}</span>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    days: {
      type: Array,
      required: true
    },
    statuses: {
      type: Object,
      required: true
    }
  });
  </script>