<!-- pages/index.vue -->
<template>
  <div>
    <!-- Page header with welcome message and date -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Welcome back, {{ authStore.user?.name || 'User' }}!</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Here's what's happening with your store today.</p>
      </div>
      <div class="mt-4 sm:mt-0 text-sm text-gray-500 dark:text-gray-400">
        {{ formattedCurrentDate }}
      </div>
    </div>
    
    <!-- Key stats overview -->
    <DashboardStats :stats="dashboardStats" class="mb-8" />
    
    <!-- Main dashboard grid layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Sales overview chart (takes 2/3 of space on large screens) -->
      <div class="lg:col-span-2">
        <DashboardSalesOverview 
          :loading="loadingCharts" 
          @export-report="exportSalesReport"
          @change-time-range="updateTimeRange"
        />
      </div>
      
      <!-- Quick actions panel (takes 1/3 of space on large screens) -->
      <div class="lg:col-span-1">
        <DashboardQuickActions 
          :actions="quickActions"
          :recent-tasks="recentTasks"
          @action-click="handleQuickAction"
          @view-task="viewTask"
          @view-all-tasks="viewAllTasks"
        />
      </div>
    </div>
    
    <!-- Second row with inventory and recent products -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Inventory status (takes 1/3 of space on large screens) -->
      <div class="lg:col-span-1">
        <DashboardInventoryStatus
          :loading="loadingInventory"
          :inventory-stats="inventoryStats"
          :alerts="inventoryAlerts"
          :categories="inventoryCategories"
          @view-inventory="viewInventory"
          @alert-action="handleAlertAction"
        />
      </div>
      
      <!-- Recent products (takes 2/3 of space on large screens) -->
      <div class="lg:col-span-2">
        <DashboardRecentProducts
          :products="recentProducts"
          :loading="loadingProducts"
          :loading-more="loadingMoreProducts"
          :has-more="hasMoreProducts"
          @view-all="viewAllProducts"
          @add-product="addNewProduct"
          @edit-product="editProduct"
          @view-product="viewProductDetails"
          @duplicate-product="duplicateProduct"
          @load-more="loadMoreProducts"
        />
      </div>
    </div>
    
    <!-- Recent activity and clients -->
    <div class="space-y-16 xl:space-y-20">
      <!-- Recent activity table -->
      <DashboardRecentActivity :days="days" :statuses="statuses" />
      
      <!-- Recent client list -->
      <DashboardRecentClients :clients="clients" :statuses="statuses" />
    </div>
    
    <!-- Product Modal -->
    <Modal
      v-if="selectedProduct"
      v-model="showProductModal"
      :title="productModalMode === 'edit' ? 'Edit Product' : 'Product Details'"
      size="lg"
    >
      <div v-if="productModalMode === 'view'" class="p-4">
        <div class="flex flex-col md:flex-row gap-6">
          <!-- Product image -->
          <div class="w-full md:w-1/3">
            <div class="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                v-if="selectedProduct.image"
                :src="selectedProduct.image"
                :alt="selectedProduct.name"
                class="w-full h-full object-cover object-center"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Icon name="heroicons:photo" class="h-16 w-16 text-gray-400" />
              </div>
            </div>
          </div>
          
          <!-- Product details -->
          <div class="w-full md:w-2/3">
            <h3 class="text-xl font-medium text-gray-900 dark:text-white">{{ selectedProduct.name }}</h3>
            
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Price</p>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ selectedProduct.price ? formatPrice(selectedProduct.price) : 'N/A' }}
                </p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Stock</p>
                <p class="text-lg font-medium" :class="[
                  selectedProduct.stock > 10 ? 'text-green-600 dark:text-green-400' : 
                  selectedProduct.stock > 0 ? 'text-amber-600 dark:text-amber-400' : 
                  'text-red-600 dark:text-red-400'
                ]">
                  {{ selectedProduct.stock }}
                </p>
              </div>
              
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Category</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedProduct.category }}</p>
              </div>
              
              <div v-if="selectedProduct.sku">
                <p class="text-sm text-gray-500 dark:text-gray-400">SKU</p>
                <p class="text-base text-gray-900 dark:text-white">{{ selectedProduct.sku }}</p>
              </div>
              
              <div class="md:col-span-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">Added</p>
                <p class="text-base text-gray-900 dark:text-white">
                  {{ formatDate(selectedProduct.createdAt) }}
                </p>
              </div>
            </div>
            
            <div class="flex justify-end mt-6 space-x-3">
              <Button
                variant="outline"
                @click="showProductModal = false"
              >
                Close
              </Button>
              
              <Button
                variant="primary"
                @click="editProduct(selectedProduct)"
              >
                Edit Product
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <form v-else-if="productModalMode === 'edit'" @submit.prevent="saveProduct" class="p-4 space-y-4">
        <!-- Product name -->
        <div>
          <label for="productName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Product Name
          </label>
          <input
            id="productName"
            v-model="productForm.name"
            type="text"
            required
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        
        <!-- Price and stock in same row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="productPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 dark:text-gray-400">$</span>
              </div>
              <input
                id="productPrice"
                v-model="productForm.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="appearance-none block w-full h-10 pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label for="productStock" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stock
            </label>
            <input
              id="productStock"
              v-model="productForm.stock"
              type="number"
              min="0"
              required
              class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
        
        <!-- Category and SKU in same row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="productCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="productCategory"
              v-model="productForm.category"
              required
              class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option v-for="category in productCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label for="productSku" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SKU (Optional)
            </label>
            <input
              id="productSku"
              v-model="productForm.sku"
              type="text"
              class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            />
          </div>
        </div>
        
        <!-- Image URL field -->
        <div>
          <label for="productImage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image URL (Optional)
          </label>
          <input
            id="productImage"
            v-model="productForm.image"
            type="text"
            class="appearance-none block w-full h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="https://example.com/image.jpg"
          />
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Enter a URL for the product image or leave blank for a placeholder
          </p>
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end pt-4 space-x-3">
          <Button
            type="button"
            variant="secondary"
            @click="showProductModal = false"
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            :disabled="savingProduct"
          >
            <Icon v-if="savingProduct" name="heroicons:arrow-path" class="animate-spin h-5 w-5 mr-1.5" />
            Save Product
          </Button>
        </div>
      </form>
    </Modal>
    
    <!-- Task Modal -->
    <Modal
      v-if="selectedTask"
      v-model="showTaskModal"
      title="Task Details"
      size="md"
    >
      <div class="p-4">
        <div class="mb-4">
          <div class="flex items-center">
            <div 
              class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
              :class="getTaskStatusColor(selectedTask.status)"
            >
              <Icon :name="getTaskStatusIcon(selectedTask.status)" class="h-4 w-4 text-white" />
            </div>
            
            <div class="ml-3">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ selectedTask.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ selectedTask.dueDate ? `Due ${selectedTask.dueDate}` : 'No due date' }}
              </p>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ selectedTask.description || 'No description provided.' }}
          </p>
        </div>
        
        <div class="flex justify-end space-x-3">
          <Button
            variant="outline"
            @click="showTaskModal = false"
          >
            Close
          </Button>
          
          <Button
            v-if="selectedTask.status !== 'completed'"
            variant="primary"
            @click="completeTask(selectedTask.id)"
          >
            Mark as Completed
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/useAuthStore';
import type { Task, Product, InventoryAlert } from '../types/dashboard';

// Import components
import DashboardStats from '~/components/dashboard/DashbaordStats.vue';
import DashboardRecentActivity from '~/components/dashboard/DashboarRecentActivity.vue';
import DashboardRecentClients from '~/components/dashboard/DashboardRecentClients.vue';
import DashboardSalesOverview from '~/components/dashboard/DashboardSalesOverview.vue';
import DashboardQuickActions from '~/components/dashboard/DashboardQuickActions.vue';
import DashboardInventoryStatus from '../components/dashboard/DashboardInventoryStatus.vue';
import DashboardRecentProducts from '~/components/dashboard/DashboardRecentProducts.vue';
import Modal from '~/components/ui/Modal.vue';
import Button from '~/components/ui/Button.vue';

// Page metadata
definePageMeta({
  middleware: ['auth']
});

// Initialize stores and router
const authStore = useAuthStore();
const router = useRouter();
const nuxtApp = useNuxtApp();

// State for data loading
const loadingCharts = ref(false);
const loadingInventory = ref(false);
const loadingProducts = ref(false);
const loadingMoreProducts = ref(false);
const hasMoreProducts = ref(true);
const savingProduct = ref(false);

// State for modals
const showProductModal = ref(false);
const showTaskModal = ref(false);
const productModalMode = ref<'view' | 'edit'>('view');
const selectedProduct = ref<Product | null>(null);
const selectedTask = ref<Task | null>(null);

// Product categories
const productCategories = [
  'T-Shirts',
  'Shirts',
  'Dresses',
  'Pants',
  'Jackets',
  'Accessories',
  'Shoes',
  'Hats'
];

// Form state
const productForm = ref({
  name: '',
  price: '',
  stock: '',
  category: '',
  sku: '',
  image: ''
});

// Computed properties
const formattedCurrentDate = computed(() => {
  return format(new Date(), 'EEEE, MMMM d, yyyy');
});

// Dashboard data
const dashboardStats = [
  { name: 'Total Revenue', value: '$405,091.00', change: '+4.75%', changeType: 'positive' },
  { name: 'Overdue invoices', value: '$12,787.00', change: '+54.02%', changeType: 'negative' },
  { name: 'Outstanding invoices', value: '$245,988.00', change: '-1.39%', changeType: 'positive' },
  { name: 'Expenses', value: '$30,156.00', change: '+10.18%', changeType: 'negative' },
];

// Status styles
const statuses = {
  Paid: 'text-green-700 bg-green-50 ring-green-600/20',
  Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
};

// Transactions by day
const days = [
  {
    date: 'Today',
    dateTime: '2023-03-22',
    transactions: [
      {
        id: 1,
        invoiceNumber: '00012',
        href: '#',
        amount: '$7,600.00 USD',
        tax: '$500.00',
        status: 'Paid',
        client: 'Reform',
        description: 'Website redesign',
        icon: 'heroicons:arrow-up-circle',
      },
      {
        id: 2,
        invoiceNumber: '00011',
        href: '#',
        amount: '$10,000.00 USD',
        status: 'Withdraw',
        client: 'Tom Cook',
        description: 'Salary',
        icon: 'heroicons:arrow-down-circle',
      },
      {
        id: 3,
        invoiceNumber: '00009',
        href: '#',
        amount: '$2,000.00 USD',
        tax: '$130.00',
        status: 'Overdue',
        client: 'Tuple',
        description: 'Logo design',
        icon: 'heroicons:arrow-path',
      },
    ],
  },
  {
    date: 'Yesterday',
    dateTime: '2023-03-21',
    transactions: [
      {
        id: 4,
        invoiceNumber: '00010',
        href: '#',
        amount: '$14,000.00 USD',
        tax: '$900.00',
        status: 'Paid',
        client: 'SavvyCal',
        description: 'Website redesign',
        icon: 'heroicons:arrow-up-circle',
      },
    ],
  },
];

// Client data
const clients = [
  {
    id: 1,
    name: 'Tuple',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    lastInvoice: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'Overdue' },
  },
  {
    id: 2,
    name: 'SavvyCal',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    lastInvoice: { date: 'January 22, 2023', dateTime: '2023-01-22', amount: '$14,000.00', status: 'Paid' },
  },
  {
    id: 3,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    lastInvoice: { date: 'January 23, 2023', dateTime: '2023-01-23', amount: '$7,600.00', status: 'Paid' },
  },
];

// Quick actions
const quickActions = ref([
  {
    id: 'add-product',
    label: 'Add Product',
    icon: 'heroicons:plus',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'update-inventory',
    label: 'Update Inventory',
    icon: 'heroicons:cube',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'view-orders',
    label: 'View Orders',
    icon: 'heroicons:shopping-bag',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'sales-report',
    label: 'Sales Report',
    icon: 'heroicons:chart-bar',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
]);

// Recent tasks - Fixed with proper status type
const recentTasks = ref<Task[]>([
  {
    id: 1,
    title: 'Update product photos for Summer Collection',
    status: 'in_progress',
    dueDate: 'Tomorrow',
    description: 'Replace all placeholder images with actual product photos for the new Summer Collection, including front, back, and detail views.'
  },
  {
    id: 2,
    title: 'Review inventory for restock',
    status: 'pending',
    dueDate: 'Apr 15, 2025',
    description: 'Identify products with low stock levels and prepare purchase orders for restocking.'
  },
  {
    id: 3,
    title: 'Finalize Spring sale discounts',
    status: 'completed',
    dueDate: 'Apr 5, 2025',
    description: 'Determine discount percentages for all products included in the Spring sale campaign.'
  }
]);

// Inventory data
const inventoryStats = ref([
  {
    label: 'Total Products',
    value: '356',
    icon: 'heroicons:cube',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    label: 'Low Stock',
    value: '24',
    icon: 'heroicons:exclamation-circle',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    label: 'Out of Stock',
    value: '12',
    icon: 'heroicons:x-circle',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400'
  }
]);

const inventoryAlerts = ref<InventoryAlert[]>([
  {
    id: 1,
    type: 'danger', // This was likely a string type before, now it matches the union type
    title: 'Critical Low Stock',
    description: '5 products have less than 5 units in stock and need immediate attention.',
    actions: [
      { id: 'view', label: 'View Products', variant: 'outline' },
      { id: 'restock', label: 'Restock Now', variant: 'primary' }
    ]
  },
  {
    id: 2,
    type: 'warning', // Make sure this is one of the allowed values
    title: 'Size Variants Missing',
    description: '3 products are missing size variants (M, L) which may affect sales.',
    actions: [
      { id: 'fix', label: 'Add Variants', variant: 'outline' }
    ]
  }
]);


const inventoryCategories = ref([
  { id: 1, name: 'T-Shirts', percentage: 32, color: 'bg-indigo-500' },
  { id: 2, name: 'Dresses', percentage: 21, color: 'bg-pink-500' },
  { id: 3, name: 'Accessories', percentage: 18, color: 'bg-amber-500' },
  { id: 4, name: 'Pants', percentage: 15, color: 'bg-green-500' },
  { id: 5, name: 'Others', percentage: 14, color: 'bg-blue-500' }
]);

// Recent products
const recentProducts = ref<Product[]>([
  {
    id: 1,
    name: 'Summer Floral Dress',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGZsb3JhbCUyMGRyZXNzfGVufDB8fDB8fHww',
    stock: 25,
    category: 'Dresses',
    sku: 'DRS-FLRL-01',
    createdAt: '2025-04-08T10:30:00Z',
    isNew: true
  },
  {
    id: 2,
    name: 'Classic White T-Shirt',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2hpdGUlMjB0c2hpcnR8ZW58MHx8MHx8fDA%3D',
    stock: 42,
    category: 'T-Shirts',
    sku: 'TS-WHT-01',
    createdAt: '2025-04-07T14:15:00Z',
    isNew: true
  },
  {
    id: 3,
    name: 'Denim Jacket',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVuaW0lMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D',
    stock: 18,
    category: 'Jackets',
    sku: 'JKT-DNM-01',
    createdAt: '2025-04-06T11:45:00Z',
    isNew: true
  },
  {
    id: 4,
    name: 'Leather Belt',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhdGhlciUyMGJlbHR8ZW58MHx8MHx8fDA%3D',
    stock: 32,
    category: 'Accessories',
    sku: 'ACC-BLT-01',
    createdAt: '2025-04-05T09:20:00Z',
    isNew: false
  }
]);

// Methods
onMounted(async () => {
  try {
    // Simulate loading data
    loadingCharts.value = true;
    loadingInventory.value = true;
    loadingProducts.value = true;
    
    await Promise.all([
      // Simulate API calls
      new Promise(resolve => setTimeout(resolve, 1000)),
      new Promise(resolve => setTimeout(resolve, 800)),
      new Promise(resolve => setTimeout(resolve, 1200))
    ]);
    
    loadingCharts.value = false;
    loadingInventory.value = false;
    loadingProducts.value = false;
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    loadingCharts.value = false;
    loadingInventory.value = false;
    loadingProducts.value = false;
  }
});

// Format helpers
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Task status helpers
const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-500 dark:bg-gray-600';
    case 'in_progress':
      return 'bg-blue-500 dark:bg-blue-600';
    case 'completed':
      return 'bg-green-500 dark:bg-green-600';
    case 'overdue':
      return 'bg-red-500 dark:bg-red-600';
    default:
      return 'bg-gray-500 dark:bg-gray-600';
  }
};

const getTaskStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return 'heroicons:clock';
    case 'in_progress':
      return 'heroicons:play';
    case 'completed':
      return 'heroicons:check';
    case 'overdue':
      return 'heroicons:exclamation-triangle';
    default:
      return 'heroicons:clock';
  }
};

// Event handlers
const handleQuickAction = (actionId: string) => {
  switch (actionId) {
    case 'add-product':
      addNewProduct();
      break;
    case 'update-inventory':
      viewInventory();
      break;
    case 'view-orders':
      navigateTo('/orders');
      break;
    case 'sales-report':
      exportSalesReport('30d');
      break;
  }
};

const exportSalesReport = (timeRange: string) => {
  // In a real app, this would trigger a file download
  nuxtApp.$toast.info({
    title: 'Generating Report',
    description: `Your ${timeRange} sales report is being prepared and will download shortly.`
  });
};

const updateTimeRange = (timeRange: string) => {
  console.log('Time range changed to:', timeRange);
  // In a real app, this would update the chart data
};

const viewInventory = () => {
  // Navigate to inventory page
  navigateTo('/inventory');
};

const handleAlertAction = ({ alertId, action }: { alertId: number, action: string }) => {
  // Handle inventory alert actions
  const alert = inventoryAlerts.value.find(a => a.id === alertId);
  
  if (!alert) return;
  
  if (action === 'restock') {
    nuxtApp.$toast.success({
      title: 'Restock Order Initiated',
      description: 'Purchase orders have been created for low stock items.'
    });
  } else if (action === 'view') {
    navigateTo('/inventory?filter=low-stock');
  } else if (action === 'fix') {
    navigateTo('/products?missing-variants=true');
  }
};

const viewAllProducts = () => {
  navigateTo('/products');
};

const addNewProduct = () => {
  productModalMode.value = 'edit';
  selectedProduct.value = {
    id: null,
    name: '',
    price: 0,
    image: '',
    stock: 0,
    category: productCategories[0],
    sku: '',
    createdAt: new Date().toISOString()
  };
  
  productForm.value = {
    name: '',
    price: '',
    stock: '',
    category: productCategories[0],
    sku: '',
    image: ''
  };
  
  showProductModal.value = true;
};

const editProduct = (product: Product) => {
  productModalMode.value = 'edit';
  selectedProduct.value = { ...product };
  
  productForm.value = {
    name: product.name,
    price: String(product.price),
    stock: String(product.stock),
    category: product.category,
    sku: product.sku || '',
    image: product.image || ''
  };
  
  showProductModal.value = true;
};

const viewProductDetails = (product: Product) => {
  productModalMode.value = 'view';
  selectedProduct.value = { ...product };
  showProductModal.value = true;
};

const duplicateProduct = (product: Product) => {
  const newProduct: Product = { 
    ...product,
    id: null,
    name: `${product.name} (Copy)`,
    createdAt: new Date().toISOString(),
    isNew: true
  };
  
  productModalMode.value = 'edit';
  selectedProduct.value = newProduct;
  
  productForm.value = {
    name: newProduct.name,
    price: String(newProduct.price),
    stock: String(newProduct.stock),
    category: newProduct.category,
    sku: `${newProduct.sku || ''}-COPY`,
    image: newProduct.image || ''
  };
  
  showProductModal.value = true;
  
  nuxtApp.$toast.info({
    title: 'Product Duplicated',
    description: 'Make your changes and save to create a new product.'
  });
};

const saveProduct = async () => {
  try {
    savingProduct.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const isNewProduct = !selectedProduct.value?.id;
    
    // In a real app, this would send data to the server
    if (isNewProduct) {
      const newProduct: Product = {
        id: recentProducts.value.length + 1,
        name: productForm.value.name,
        price: parseFloat(productForm.value.price),
        stock: parseInt(productForm.value.stock),
        category: productForm.value.category,
        sku: productForm.value.sku || null,
        createdAt: new Date().toISOString(),
        isNew: true,
        image: productForm.value.image || ''
      };
      
      // Add to the beginning of the list
      recentProducts.value.unshift(newProduct);
      
      nuxtApp.$toast.success({
        title: 'Product Added',
        description: `${newProduct.name} has been added to your inventory.`
      });
    } else {
      // Update existing product
      const index = recentProducts.value.findIndex(p => p.id === selectedProduct.value?.id);
      
      if (index !== -1) {
        recentProducts.value[index] = {
          ...recentProducts.value[index],
          name: productForm.value.name,
          price: parseFloat(productForm.value.price),
          stock: parseInt(productForm.value.stock),
          category: productForm.value.category,
          sku: productForm.value.sku || null,
          image: productForm.value.image || recentProducts.value[index].image || ''
        };
      }
      
      nuxtApp.$toast.success({
        title: 'Product Updated',
        description: `${productForm.value.name} has been updated.`
      });
    }
    
    showProductModal.value = false;
    savingProduct.value = false;
  } catch (error) {
    console.error('Error saving product:', error);
    nuxtApp.$toast.error({
      title: 'Error',
      description: 'There was an error saving the product. Please try again.'
    });
    savingProduct.value = false;
  }
};

const loadMoreProducts = async () => {
  try {
    loadingMoreProducts.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would fetch more products from the API
    // For this example, we'll just add some dummy products
    const additionalProducts: Product[] = [
      {
        id: 5,
        name: 'Cotton Chino Pants',
        price: 59.99,
        stock: 28,
        category: 'Pants',
        sku: 'PNT-CHN-01',
        createdAt: '2025-04-04T15:45:00Z',
        isNew: false,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGNoaW5vJTIwcGFudHN8ZW58MHx8MHx8fDA%3D'
      },
      {
        id: 6,
        name: 'Striped Polo Shirt',
        price: 39.99,
        stock: 36,
        category: 'Shirts',
        sku: 'SHT-POL-01',
        createdAt: '2025-04-03T12:30:00Z',
        isNew: false,
        image: 'https://images.unsplash.com/photo-1588361861040-ac9b1018f6d5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBvbG8lMjBzaGlydHxlbnwwfHwwfHx8MA%3D%3D'
      }
    ];
    
    recentProducts.value.push(...additionalProducts);
    
    // Disable "load more" button after loading additional products
    hasMoreProducts.value = false;
    
    loadingMoreProducts.value = false;
  } catch (error) {
    console.error('Error loading more products:', error);
    loadingMoreProducts.value = false;
  }
};

const viewTask = (taskId: number) => {
  selectedTask.value = recentTasks.value.find(task => task.id === taskId) || null;
  showTaskModal.value = true;
};

const viewAllTasks = () => {
  navigateTo('/tasks');
};

const completeTask = async (taskId: number) => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update task status in local state
    const taskIndex = recentTasks.value.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      recentTasks.value[taskIndex].status = 'completed';
    }
    
    // Show success message
    nuxtApp.$toast.success({
      title: 'Task Completed',
      description: 'The task has been marked as completed.'
    });
    
    // Close modal
    showTaskModal.value = false;
  } catch (error) {
    console.error('Error completing task:', error);
    
    nuxtApp.$toast.error({
      title: 'Error',
      description: 'There was an error updating the task. Please try again.'
    });
  }
};
</script>