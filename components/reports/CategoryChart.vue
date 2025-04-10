<!-- components/reports/CategoryChart.vue -->
<template>
    <div>
      <div class="flex flex-col sm:flex-row justify-between mb-4">
        <div class="mb-2 sm:mb-0">
          <select 
            v-model="chartType"
            class="form-select rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
          >
            <option value="pie">Pie Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            v-for="view in ['Revenue', 'Units']" 
            :key="view"
            @click="activeView = view"
            :class="[
              'px-2 py-1 text-xs font-medium rounded',
              activeView === view 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            {{ view }}
          </button>
        </div>
      </div>
      
      <div class="h-64 relative">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
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
  const chartType = ref('pie');
  const activeView = ref('Units');
  
  // Colors for chart
  const COLORS = [
    '#6366F1', // Indigo
    '#A855F7', // Purple
    '#EC4899', // Pink
    '#F43F5E', // Rose
    '#F97316', // Orange
    '#FBBF24', // Amber
    '#84CC16', // Lime
    '#10B981'  // Emerald
  ];
  
  // Create the chart
  const initChart = () => {
    if (!chartCanvas.value) return;
    
    const ctx = chartCanvas.value.getContext('2d');
    
    // Prepare chart data
    const labels = props.data.map(item => item.category);
    const values = props.data.map(item => item.value);
    
    const config = {
      type: chartType.value,
      data: {
        labels: labels,
        datasets: [{
          label: activeView.value,
          data: values,
          backgroundColor: props.data.map((_, index) => COLORS[index % COLORS.length]),
          borderColor: props.data.map((_, index) => COLORS[index % COLORS.length]),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              padding: 15
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw;
                const percentage = Math.round((value / values.reduce((a, b) => a + b, 0)) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };
    
    // Add specific options for bar charts
    if (chartType.value === 'bar') {
      config.options.indexAxis = 'y';
      config.options.scales = {
        y: {
          beginAtZero: true
        }
      };
    }
    
    // Create chart
    chart = new Chart(ctx, config);
  };
  
  // Update chart when type changes
  const updateChart = () => {
    if (chart) {
      chart.destroy();
    }
    initChart();
  };
  
  // Initialize chart on mount
  onMounted(() => {
    initChart();
  });
  
  // Clean up on unmount
  onBeforeUnmount(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });
  
  // Watch for changes to update chart
  watch([chartType, activeView], () => {
    updateChart();
  });
  </script>