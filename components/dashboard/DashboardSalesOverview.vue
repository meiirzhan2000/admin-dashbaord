<template>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">Sales Overview</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ timeRangeLabel }}</p>
        </div>
        
        <div class="mt-3 sm:mt-0 flex space-x-3">
          <select
            v-model="selectedTimeRange"
            class="appearance-none block w-full sm:w-auto h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="12m">Last 12 months</option>
          </select>
          
          <Button
            variant="outline"
            size="sm"
            left-icon="heroicons:arrow-down-tray"
            @click="downloadReport"
          >
            Export
          </Button>
        </div>
      </div>
      
      <div class="px-6 py-4">
        <!-- Statistics cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</p>
              </div>
              <div :class="`${getChangeColorClass(stat.change)} flex items-center`">
                <Icon 
                  :name="stat.change >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
                  class="h-5 w-5 mr-1"
                />
                <span>{{ formatPercentage(stat.change) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Chart -->
        <ClientOnly>
        <div v-if="loading" class="flex justify-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
        
    
          <div v-else class="h-80">
            <apexchart
              ref="chart"
              type="area"
              height="100%"
              :options="chartOptions"
              :series="series"
            />
          </div>
        </ClientOnly>
      </div>
      
      <!-- Legend & insights -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div class="flex flex-wrap items-center gap-6">
          <div v-for="(item, index) in series" :key="index" class="flex items-center">
            <span 
              class="h-3 w-3 rounded-full mr-2"
              :style="{ backgroundColor: chartOptions.colors[index] }"
            ></span>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ item.name }}</span>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-white dark:bg-gray-800 rounded-md text-sm border border-gray-200 dark:border-gray-600">
          <div class="flex">
            <Icon 
              name="heroicons:light-bulb" 
              class="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0"
            />
            <p class="text-gray-700 dark:text-gray-300">
              <span class="font-medium">Insight:</span> 
              {{ currentInsight }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import Button from '~/components/ui/Button.vue';
  
  // Props and emits
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    },
    dateRanges: {
      type: Object,
      default: () => ({
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        '12m': 'Last 12 months'
      })
    }
  });
  
  const emit = defineEmits(['export-report', 'change-time-range']);
  
  // State
  const selectedTimeRange = ref('30d');
  const chart = ref(null);
  
  // Sample data
  const stats = ref([
    { label: 'Total Revenue', value: '$12,426.00', change: 12.5 },
    { label: 'Orders', value: '356', change: 8.2 },
    { label: 'Avg. Order Value', value: '$34.90', change: 3.8 },
    { label: 'Conversion Rate', value: '3.2%', change: -1.5 }
  ]);
  
  const insights = [
    "Your sales have increased by 12.5% compared to the previous period. The 'Summer Collection' is your best-performing category.",
    "Tuesday and Wednesday are your highest-volume sales days. Consider scheduling promotions on slower days like Monday.",
    "Customers who use the search feature convert at 2.4x the rate of those who don't. Consider enhancing search visibility.",
    "Products with 4+ images sell 35% better than those with fewer images. Consider adding more product visuals."
  ];
  
  // Chart data
  const series = ref([
    { 
      name: 'Revenue',
      data: [4800, 5200, 7500, 6500, 10200, 9800, 12000]
    },
    {
      name: 'Orders',
      data: [120, 150, 170, 180, 220, 240, 300]
    }
  ]);
  
  const chartOptions = ref({
    chart: {
      type: 'area',
      height: '100%',
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    colors: ['#818cf8', '#34d399'], // indigo-400, emerald-400
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: {
        style: {
          colors: '#9ca3af' // gray-400
        }
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: [
      {
        title: {
          text: 'Revenue',
          style: {
            color: '#818cf8' // indigo-400
          }
        },
        labels: {
          formatter: function(value: number) {
            return '$' + value.toLocaleString();
          },
          style: {
            colors: '#9ca3af' // gray-400
          }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Orders',
          style: {
            color: '#34d399' // emerald-400
          }
        },
        labels: {
          style: {
            colors: '#9ca3af' // gray-400
          }
        }
      }
    ],
    grid: {
      borderColor: '#e5e7eb', // gray-200
      row: {
        colors: ['transparent']
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: function(value: number, { seriesIndex }: { seriesIndex: number }) {
          if (seriesIndex === 0) {
            return '$' + value.toLocaleString();
          }
          return value.toString();
        }
      }
    }
  });
  
  // Computed values
  const timeRangeLabel = computed(() => {
    return props.dateRanges[selectedTimeRange.value] || 'Custom period';
  });
  
  const currentInsight = computed(() => {
    const randomIndex = Math.floor(Math.random() * insights.length);
    return insights[randomIndex];
  });
  
  // Methods
  const formatPercentage = (value: number): string => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}${value}%`;
  };
  
  const getChangeColorClass = (change: number): string => {
    return change >= 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };
  
  const updateChartData = () => {
    // In a real app, you would fetch data based on selectedTimeRange
    const newData = {
      '7d': {
        revenue: [3800, 4200, 3900, 5100, 5800, 6200, 5900],
        orders: [90, 110, 95, 130, 150, 160, 145]
      },
      '30d': {
        revenue: [4800, 5200, 7500, 6500, 10200, 9800, 12000],
        orders: [120, 150, 170, 180, 220, 240, 300]
      },
      '90d': {
        revenue: [14800, 15200, 17500, 19500, 22000, 24800, 27000],
        orders: [320, 350, 370, 410, 450, 490, 520]
      },
      '12m': {
        revenue: [54800, 62000, 67500, 72000, 84000, 92000, 105000],
        orders: [1200, 1350, 1500, 1650, 1800, 1950, 2100]
      }
    };
    
    const data = newData[selectedTimeRange.value] || newData['30d'];
    
    series.value = [
      {
        name: 'Revenue',
        data: data.revenue
      },
      {
        name: 'Orders',
        data: data.orders
      }
    ];
  };
  
  const downloadReport = () => {
    emit('export-report', selectedTimeRange.value);
    
    useNuxtApp().$toast.info({
      title: 'Report Export',
      description: 'Your report is being generated and will download shortly.'
    });
  };
  
  // Watchers
  watch(selectedTimeRange, (newValue) => {
    emit('change-time-range', newValue);
    updateChartData();
  });
  </script>