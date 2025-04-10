// stores/useReportStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

interface DateRange {
  start: Date;
  end: Date;
}

interface MetricItem {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: string;
  trend: 'up' | 'down';
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

interface CategoryDataPoint {
  category: string;
  value: number;
}

interface SizeDataPoint {
  size: string;
  count: number;
}

interface ColorDataPoint {
  color: string;
  value: number;
  hex: string;
}

interface DemographicDataPoint {
  age: string;
  male: number;
  female: number;
}

interface Product {
  id: number;
  image?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  revenue: number;
  growth: number;
}

export const useReportStore = defineStore('report', {
  state: () => ({
    loading: false,
    error: null as string | null,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      end: new Date()
    } as DateRange,
    metrics: [
      {
        id: 1,
        title: 'Total Revenue',
        value: '$24,567.89',
        change: '+12.5%',
        icon: 'heroicons:currency-dollar',
        trend: 'up'
      },
      {
        id: 2,
        title: 'Items Sold',
        value: '1,234',
        change: '+8.3%',
        icon: 'heroicons:shopping-bag',
        trend: 'up'
      },
      {
        id: 3,
        title: 'Average Order',
        value: '$87.45',
        change: '+2.1%',
        icon: 'heroicons:receipt-percent',
        trend: 'up'
      },
      {
        id: 4,
        title: 'Return Rate',
        value: '3.2%',
        change: '-0.5%',
        icon: 'heroicons:arrow-path',
        trend: 'down' // down is good for return rate
      }
    ] as MetricItem[],
    revenueData: [
      { date: '2025-03-01', revenue: 1450, orders: 24 },
      { date: '2025-03-02', revenue: 1200, orders: 18 },
      { date: '2025-03-03', revenue: 1600, orders: 26 },
      { date: '2025-03-04', revenue: 1800, orders: 30 },
      { date: '2025-03-05', revenue: 1950, orders: 32 },
      { date: '2025-03-06', revenue: 2100, orders: 35 },
      { date: '2025-03-07', revenue: 1800, orders: 30 },
      { date: '2025-03-08', revenue: 1650, orders: 28 },
      { date: '2025-03-09', revenue: 1500, orders: 25 },
      { date: '2025-03-10', revenue: 1700, orders: 29 },
      { date: '2025-03-11', revenue: 1850, orders: 31 },
      { date: '2025-03-12', revenue: 2050, orders: 34 },
      { date: '2025-03-13', revenue: 2200, orders: 36 },
      { date: '2025-03-14', revenue: 2100, orders: 35 },
      { date: '2025-03-15', revenue: 1900, orders: 32 },
      { date: '2025-03-16', revenue: 1750, orders: 29 },
      { date: '2025-03-17', revenue: 1600, orders: 27 },
      { date: '2025-03-18', revenue: 1800, orders: 30 },
      { date: '2025-03-19', revenue: 2000, orders: 33 },
      { date: '2025-03-20', revenue: 2150, orders: 36 },
      { date: '2025-03-21', revenue: 2050, orders: 34 },
      { date: '2025-03-22', revenue: 1900, orders: 31 },
      { date: '2025-03-23', revenue: 1750, orders: 29 },
      { date: '2025-03-24', revenue: 1850, orders: 30 },
      { date: '2025-03-25', revenue: 2000, orders: 33 },
      { date: '2025-03-26', revenue: 2200, orders: 36 },
      { date: '2025-03-27', revenue: 2300, orders: 38 },
      { date: '2025-03-28', revenue: 2150, orders: 35 },
      { date: '2025-03-29', revenue: 2000, orders: 33 },
      { date: '2025-03-30', revenue: 1850, orders: 30 },
    ] as RevenueDataPoint[],
    categoryData: [
      { category: 'T-shirts', value: 32 },
      { category: 'Dresses', value: 24 },
      { category: 'Jeans', value: 18 },
      { category: 'Jackets', value: 12 },
      { category: 'Hoodies', value: 9 },
      { category: 'Shorts', value: 5 },
    ] as CategoryDataPoint[],
    sizeData: [
      { size: 'XS', count: 132 },
      { size: 'S', count: 302 },
      { size: 'M', count: 487 },
      { size: 'L', count: 346 },
      { size: 'XL', count: 218 },
      { size: 'XXL', count: 97 },
    ] as SizeDataPoint[],
    colorData: [
      { color: 'Black', value: 28, hex: '#000000' },
      { color: 'White', value: 22, hex: '#FFFFFF' },
      { color: 'Blue', value: 16, hex: '#0000FF' },
      { color: 'Red', value: 12, hex: '#FF0000' },
      { color: 'Green', value: 10, hex: '#00FF00' },
      { color: 'Grey', value: 8, hex: '#808080' },
      { color: 'Pink', value: 4, hex: '#FFC0CB' },
    ] as ColorDataPoint[],
    demographicData: [
      { age: '18-24', male: 15, female: 22 },
      { age: '25-34', male: 25, female: 26 },
      { age: '35-44', male: 16, female: 18 },
      { age: '45-54', male: 8, female: 10 },
      { age: '55+', male: 5, female: 6 },
    ] as DemographicDataPoint[],
    products: [
      {
        id: 1,
        image: '/images/products/t-shirt.jpg',
        name: 'Premium Cotton T-Shirt',
        category: 'T-shirts',
        price: 29.99,
        stock: 124,
        sales: 328,
        revenue: 9836.72,
        growth: 15.2
      },
      {
        id: 2,
        image: '/images/products/dress.jpg',
        name: 'Summer Floral Dress',
        category: 'Dresses',
        price: 59.99,
        stock: 86,
        sales: 215,
        revenue: 12897.85,
        growth: 8.7
      },
      {
        id: 3,
        image: '/images/products/jeans.jpg',
        name: 'Slim Fit Jeans',
        category: 'Jeans',
        price: 49.99,
        stock: 152,
        sales: 187,
        revenue: 9348.13,
        growth: 5.4
      },
      {
        id: 4,
        image: '/images/products/jacket.jpg',
        name: 'Waterproof Winter Jacket',
        category: 'Jackets',
        price: 89.99,
        stock: 65,
        sales: 120,
        revenue: 10798.80,
        growth: 12.9
      },
      {
        id: 5,
        image: '/images/products/hoodie.jpg',
        name: 'Pullover Hoodie',
        category: 'Hoodies',
        price: 39.99,
        stock: 94,
        sales: 156,
        revenue: 6238.44,
        growth: 9.3
      },
      {
        id: 6,
        image: '/images/products/shirt.jpg',
        name: 'Button Down Shirt',
        category: 'Shirts',
        price: 44.99,
        stock: 112,
        sales: 143,
        revenue: 6433.57,
        growth: 3.8
      },
      {
        id: 7,
        image: '/images/products/shorts.jpg',
        name: 'Athletic Shorts',
        category: 'Shorts',
        price: 24.99,
        stock: 78,
        sales: 98,
        revenue: 2449.02,
        growth: -2.5
      },
      {
        id: 8,
        image: '/images/products/sweater.jpg',
        name: 'Knit Sweater',
        category: 'Sweaters',
        price: 54.99,
        stock: 45,
        sales: 87,
        revenue: 4784.13,
        growth: 7.6
      },
      {
        id: 9,
        image: '/images/products/coat.jpg',
        name: 'Winter Trench Coat',
        category: 'Coats',
        price: 129.99,
        stock: 32,
        sales: 68,
        revenue: 8839.32,
        growth: 18.4
      },
      {
        id: 10,
        image: '/images/products/skirt.jpg',
        name: 'A-Line Skirt',
        category: 'Skirts',
        price: 34.99,
        stock: 56,
        sales: 74,
        revenue: 2589.26,
        growth: 1.3
      }
    ] as Product[],
    productView: 'Top Sellers' as string
  }),

  getters: {
    getFilteredProducts: (state) => {
      switch (state.productView) {
        case 'Top Sellers':
          return [...state.products].sort((a, b) => b.sales - a.sales);
        case 'Low Stock':
          return [...state.products].sort((a, b) => a.stock - b.stock);
        case 'No Sales':
          return [...state.products].filter(p => p.sales < 100);
        case 'New Items':
          return [...state.products].sort((a, b) => b.id - a.id);
        default:
          return state.products;
      }
    },
    
    getTotalRevenue: (state) => {
      return state.products.reduce((total, product) => total + product.revenue, 0);
    },
    
    getTotalSales: (state) => {
      return state.products.reduce((total, product) => total + product.sales, 0);
    },
    
    getAverageGrowth: (state) => {
      const totalGrowth = state.products.reduce((total, product) => total + product.growth, 0);
      return totalGrowth / state.products.length;
    }
  },

  actions: {
    setDateRange(range: DateRange) {
      this.dateRange = range;
      this.fetchReportData();
    },
    
    setProductView(view: string) {
      this.productView = view;
    },
    
    async fetchReportData() {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call with the date range
        // For example:
        // const startDate = this.dateRange.start.toISOString().split('T')[0];
        // const endDate = this.dateRange.end.toISOString().split('T')[0];
        // const response = await axios.get(`/api/reports/data?start=${startDate}&end=${endDate}`);
        // this.metrics = response.data.metrics;
        // this.revenueData = response.data.revenueData;
        // etc...
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For now, just using the mock data already defined in state
        
      } catch (error) {
        this.error = 'Failed to fetch report data';
        console.error('Error fetching report data:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async exportReport() {
      try {
        this.loading = true;
        
        // In a real app, this would make an API call to generate the export
        // For example:
        // const response = await axios.post('/api/reports/export', {
        //   dateRange: this.dateRange,
        //   format: 'csv' // or 'pdf', etc.
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Show success notification
        const nuxtApp = useNuxtApp();
        nuxtApp.$toast.success({
          title: 'Export Complete',
          description: 'Your report has been exported and sent to your email.'
        });
        
      } catch (error) {
        // Show error notification
        const nuxtApp = useNuxtApp();
        nuxtApp.$toast.error({
          title: 'Export Failed',
          description: 'There was an error exporting your report. Please try again.'
        });
        
        console.error('Error exporting report:', error);
      } finally {
        this.loading = false;
      }
    }
  }
});