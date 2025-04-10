<!-- components/reports/SizeDistributionChart.vue -->
<template>
    <div>
      <div class="flex justify-between mb-4">
        <div class="flex space-x-2">
          <button 
            v-for="mode in ['Value', 'Percentage']" 
            :key="mode"
            @click="displayMode = mode"
            :class="[
              'px-2 py-1 text-xs font-medium rounded',
              displayMode === mode 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            {{ mode }}
          </button>
        </div>
      </div>
      
      <div class="h-56 relative">
        <canvas ref="chartCanvas"></canvas>
      </div>
      
      <div class="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        <div 
          v-for="item in data" 
          :key="item.size"
          class="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-700"
        >
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ item.size }}</span>
          <span class="text-gray-600 dark:text-gray-400">
            {{ displayMode === 'Percentage' 
                ? `${getPercentage(item.count)}%` 
                : item.count 
            }}
          </span>
        </div>
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
  const displayMode = ref('Value');
  
  // Get total count for percentage calculations
  const totalCount = computed(() => {
    return props.data.reduce((total, item) => total + item.count, 0);
  });
  
  // Calculate percentage for a count
  const getPercentage = (count) => {
    return Math.round((count / totalCount.value) * 100);
  };
  
  // Prepare chart data based on display mode
  const getChartData = () => {
    if (displayMode.value === 'Percentage') {
      return props.data.map(item => ({
        size: item.size,
        value: getPercentage(item.count)
      }));
    }
    return props.data.map(item => ({
      size: item.size,
      value: item.count
    }));
  };
  
  // Initialize the chart
  const initChart = () => {
    if (!chartCanvas.value) return;
    
    const ctx = chartCanvas.value.getContext('2d');
    const chartData = getChartData();
    
    // Create radar chart
    chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: chartData.map(item => item.size),
        datasets: [{
          label: displayMode.value === 'Percentage' ? 'Size Distribution (%)' : 'Size Distribution',
          data: chartData.map(item => item.value),
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: '#6366f1',
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6366f1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            ticks: {
              stepSize: displayMode.value === 'Percentage' ? 25 : Math.ceil(Math.max(...chartData.map(item => item.value)) / 4)
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw;
                if (displayMode.value === 'Percentage') {
                  return `${context.label}: ${value}%`;
                }
                return `${context.label}: ${value}`;
              }
            }
          }
        }
      }
    });
  };
  
  // Update chart when display mode changes
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
  
  // Watch for display mode changes
  watch(displayMode, () => {
    updateChart();
  });
  </script>