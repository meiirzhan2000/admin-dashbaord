<!-- pages/reports.vue -->
<template>
  <div>
    <PageHeader title="Sales Reports">
      <template #actions>
        <div class="flex items-center gap-3">
          <DateRangePicker v-model="reportStore.dateRange" />
          <Button
            variant="outline"
            left-icon="heroicons:arrow-down-tray"
            @click="handleExport"
            :disabled="reportStore.loading"
          >
            Export
          </Button>
        </div>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <MetricCard
        v-for="metric in reportStore.metrics"
        :key="metric.id"
        :title="metric.title"
        :value="metric.value"
        :change="metric.change"
        :icon="metric.icon"
        :trend="metric.trend"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <ReportCard title="Revenue Overview">
        <RevenueChart :data="reportStore.revenueData" />
      </ReportCard>
      <ReportCard title="Top Selling Categories">
        <CategoryChart :data="reportStore.categoryData" />
      </ReportCard>
    </div>

    <div class="grid grid-cols-1 gap-6 mb-6">
      <ReportCard title="Sales by Product">
        <FilterTabs
          v-model="productView"
          :options="['Top Sellers', 'Low Stock', 'No Sales', 'New Items']"
        />
        <ProductSalesTable 
          :products="reportStore.getFilteredProducts" 
          :loading="reportStore.loading" 
        />
      </ReportCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ReportCard title="Size Distribution">
        <SizeDistributionChart :data="reportStore.sizeData" />
      </ReportCard>
      <ReportCard title="Color Popularity">
        <ColorPopularityChart :data="reportStore.colorData" />
      </ReportCard>
      <ReportCard title="Customer Demographics">
        <CustomerDemographicsChart :data="reportStore.demographicData" />
      </ReportCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useReportStore } from '~/stores/useReportStore';
import PageHeader from '~/components/common/PageHeader.vue';
import Button from '~/components/ui/Button.vue';
import FilterTabs from '~/components/common/FilterTabs.vue';
import DateRangePicker from '~/components/reports/DateRangePicker.vue';
import MetricCard from '~/components/reports/MetricCard.vue';
import ReportCard from '~/components/reports/ReportCard.vue';
import RevenueChart from '~/components/reports/RevenueChart.vue';
import CategoryChart from '~/components/reports/CategoryChart.vue';
import SizeDistributionChart from '~/components/reports/SizeDistributionChart.vue';
import ColorPopularityChart from '~/components/reports/ColorPopularityChart.vue';
import CustomerDemographicsChart from '~/components/reports/CustomerDemographicsChart.vue';
import ProductSalesTable from '~/components/reports/ProductSalesTable.vue';

definePageMeta({
  middleware: ['auth']
});

// Initialize store
const reportStore = useReportStore();

// Local state for UI controls
const productView = ref('Top Sellers');

// Watch for product view changes and update store accordingly
watch(productView, (newView) => {
  reportStore.setProductView(newView);
});

// Methods
const handleExport = () => {
  reportStore.exportReport();
};

// Fetch data on mount
onMounted(() => {
  reportStore.fetchReportData();
});
</script>