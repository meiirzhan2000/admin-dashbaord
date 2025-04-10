<!-- components/reports/CustomerDemographicsChart.vue -->
<template>
    <div>
      <div class="flex space-x-2 mb-4">
        <button 
          v-for="type in ['Bar', 'Line']" 
          :key="type"
          @click="chartType = type"
          :class="[
            'px-2 py-1 text-xs font-medium rounded',
            chartType === type 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          ]"
        >
          {{ type }}
        </button>
      </div>
      
      <div class="h-56 relative">
        <canvas ref="chartCanvas"></canvas>
      </div>
      
      <div class="mt-4">
        <div class="px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <div class="flex items-center">
            <Icon name="heroicons:information-circle" class="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <p class="text-sm text-indigo-800 dark:text-indigo-300">
              Demographics data is based on customer accounts and purchases over the last 30 days.
            </p>
          </div>
        </div>
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
  const chartType = ref('Bar');
  
  // Initialize chart
  const initChart = () => {
    if (!chartCanvas.value) return;
    
    const ctx = chartCanvas.value.getContext('2d');
    
    // Set up chart data
    const chartData = {
      labels: props.data.map(item => item.age),
      datasets: [
        {
          label: 'Male',
          data: props.data.map(item => item.male),
          backgroundColor: 'rgba(79, 70, 229, 0.7)',
          borderColor: '#4f46e5',
          borderWidth: 1
        },
        {
          label: 'Female',
          data: props.data.map(item => item.female),
          backgroundColor: 'rgba(232, 121, 249, 0.7)',
          borderColor: '#e879f9',
          borderWidth: 1
        }
      ]
    };
    
    // Chart configuration
    const config = {
      type: chartType.value.toLowerCase(),
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Customers',
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Age Group',
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: ${value}`;
              }
            }
          }
        }
      }
    };
    
    // Additional line chart specific options
    if (chartType.value === 'Line') {
      chartData.datasets.forEach(dataset => {
        dataset.tension = 0.3;
        dataset.pointRadius = 5;
        dataset.pointHoverRadius = 7;
        dataset.fill = false;
      });
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
  
  // Watch for chart type changes
  watch(chartType, () => {
    updateChart();
  });
  </script>