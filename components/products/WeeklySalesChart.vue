<!-- components/products/WeeklySalesChart.vue -->
<template>
    <div class="relative h-full">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
  import Chart from 'chart.js/auto';
  
  const props = defineProps({
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  });
  
  // References
  const chartCanvas = ref(null);
  let chart = null;
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
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
      labels: props.data.map(item => formatDate(item.date)),
      datasets: [
        {
          label: 'Revenue',
          data: props.data.map(item => item.revenue),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          yAxisID: 'y-revenue',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Units Sold',
          data: props.data.map(item => item.units),
          borderColor: '#a855f7',
          backgroundColor: '#a855f7',
          yAxisID: 'y-units',
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
              text: 'Revenue ($)',
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            ticks: {
              callback: (value) => '$' + value.toLocaleString(),
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          'y-units': {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Units Sold',
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            grid: {
              drawOnChartArea: false,
            }
          },
          x: {
            ticks: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            },
            grid: {
              color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
            }
          },
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
  
  // Update chart when data changes
  const updateChart = () => {
    if (!chart) return;
    
    chart.data.labels = props.data.map(item => formatDate(item.date));
    chart.data.datasets[0].data = props.data.map(item => item.revenue);
    chart.data.datasets[1].data = props.data.map(item => item.units);
    
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
  
  // Watch for changes in the data
  watch(() => props.data, () => {
    if (chart) {
      updateChart();
    } else {
      initChart();
    }
  }, { deep: true });
  </script>