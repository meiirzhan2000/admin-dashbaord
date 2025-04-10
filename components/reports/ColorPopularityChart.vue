<!-- components/reports/ColorPopularityChart.vue -->
<template>
    <div>
      <div class="flex space-x-2 mb-4">
        <button 
          v-for="type in ['Chart', 'Table']" 
          :key="type"
          @click="viewType = type"
          :class="[
            'px-2 py-1 text-xs font-medium rounded',
            viewType === type 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          ]"
        >
          {{ type }}
        </button>
      </div>
      
      <!-- Pie Chart View -->
      <div v-if="viewType === 'Chart'" class="h-56 relative">
        <canvas ref="chartCanvas"></canvas>
      </div>
      
      <!-- Table View -->
      <div v-else class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Color
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Sales
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="item in sortedData" 
              :key="item.color"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="w-4 h-4 mr-2 rounded-full" 
                    :style="{ backgroundColor: item.hex }"
                    :class="isDarkColor(item.hex) ? 'border border-gray-300 dark:border-gray-600' : ''"
                  ></div>
                  <span class="text-sm text-gray-900 dark:text-white">{{ item.color }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ item.value }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ calculatePercentage(item.value) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    data: {
      type: Array,
      required: true
    }
  });
  
  // References
  const chartCanvas = ref(null);
  let chart = null;
  
  // State
  const viewType = ref('Chart');
  
  // Calculate total value
  const total = computed(() => {
    return props.data.reduce((sum, item) => sum + item.value, 0);
  });
  
  // Calculate percentage for an item
  const calculatePercentage = (value) => {
    return Math.round((value / total.value) * 100);
  };
  
  // Sort data by value for table view
  const sortedData = computed(() => {
    return [...props.data].sort((a, b) => b.value - a.value);
  });
  
  // Initialize the chart
  const initChart = () => {
    if (!chartCanvas.value) return;
    
    const ctx = chartCanvas.value.getContext('2d');
    
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: props.data.map(item => item.color),
        datasets: [{
          data: props.data.map(item => item.value),
          backgroundColor: props.data.map(item => item.hex),
          borderColor: props.data.map(item => isDarkColor(item.hex) ? '#ffffff' : '#000000'),
          borderWidth: 0.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15,
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                const percentage = Math.round((value / total.value) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };
  
  // Check if a color is dark (for contrast purposes)
  const isDarkColor = (hex) => {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return true if dark
    return brightness < 128;
  };
  
  // Initialize chart on mount
  onMounted(() => {
    if (viewType.value === 'Chart') {
      initChart();
    }
  });
  
  // Clean up on unmount
  onBeforeUnmount(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });
  
  // Watch for view type changes
  watch(viewType, (newType) => {
    if (newType === 'Chart') {
      // Use nextTick to ensure DOM is updated
      nextTick(() => {
        initChart();
      });
    } else {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    }
  });
  </script>