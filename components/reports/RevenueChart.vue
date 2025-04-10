<!-- components/reports/RevenueChart.vue -->
<template>
    <div>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-indigo-500 mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
          </div>
          <div class="flex items-center">
            <div class="h-3 w-3 rounded-full bg-purple-300 mr-2"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Orders</span>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            v-for="period in ['7D', '30D', '3M', 'YTD']" 
            :key="period"
            @click="activePeriod = period"
            :class="[
              'px-2 py-1 text-xs font-medium rounded',
              activePeriod === period 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]"
          >
            {{ period }}
          </button>
        </div>
      </div>
      
      <div class="h-72 relative">
        <canvas ref="chartCanvas"></canvas>
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
  const activePeriod = ref('30D');
  
  // Filter data based on active period
  const filteredData = computed(() => {
    const today = new Date();
    let daysToShow;
    
    switch (activePeriod.value) {
      case '7D':
        daysToShow = 7;
        break;
      case '30D':
        daysToShow = 30;
        break;
      case '3M':
        daysToShow = 90;
        break;
      case 'YTD':
        // Year to date
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        daysToShow = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
        break;
      default:
        daysToShow = 30;
    }
    
    // Return subset of data based on days to show
    return props.data.slice(-daysToShow);
  });
  
  // Format dates for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Create and update chart
  const initChart = () => {
    if (!chartCanvas.value) return;
    
    const ctx = chartCanvas.value.getContext('2d');
    
    // Process data for chart
    const chartData = {
      labels: filteredData.value.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'Revenue',
          data: filteredData.value.map(item => item.revenue),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          yAxisID: 'y-revenue',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Orders',
          data: filteredData.value.map(item => item.orders),
          borderColor: '#a855f7',
          backgroundColor: '#a855f7',
          yAxisID: 'y-orders',
          type: 'bar',
          barThickness: 6,
          borderRadius: {
            topLeft: 10,
            topRight: 10
          }
        }
      ]
    };
    
    // Chart configuration
    const config = {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          'y-revenue': {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Revenue ($)'
            },
            ticks: {
              callback: (value) => '$' + value.toLocaleString()
            }
          },
          'y-orders': {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Orders'
            },
            grid: {
              drawOnChartArea: false,
            }
          },
          x: {
            grid: {
              drawOnChartArea: false
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                if (label === 'Revenue') {
                  return `${label}: $${context.parsed.y.toLocaleString()}`;
                } else {
                  return `${label}: ${context.parsed.y}`;
                }
              }
            }
          }
        }
      }
    };
    
    // Create the chart
    chart = new Chart(ctx, config);
  };
  
  // Update chart when data or period changes
  const updateChart = () => {
    if (!chart) return;
    
    chart.data.labels = filteredData.value.map(item => formatDate(item.date));
    chart.data.datasets[0].data = filteredData.value.map(item => item.revenue);
    chart.data.datasets[1].data = filteredData.value.map(item => item.orders);
    
    chart.update();
  };
  
  // Initialize chart on component mount
  onMounted(() => {
    initChart();
  });
  
  // Clean up chart on component unmount
  onBeforeUnmount(() => {
    if (chart) {
      chart.destroy();
      chart = null;
    }
  });
  
  // Watch for period changes to update the chart
  watch(activePeriod, () => {
    updateChart();
  });
  </script>