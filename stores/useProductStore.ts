// stores/useProductStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';

// Product types
export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  categoryId: string;
  stock: number;
  status: 'active' | 'draft' | 'inactive';
  images: string[];
  variants: ProductVariant[];
  location: string;
  createdAt: string;
  updatedAt: string;
  salesData?: {
    weeklySales: SalesDataPoint[];
    monthlySales: SalesDataPoint[];
  };
}

export interface SalesDataPoint {
  date: string;
  units: number;
  revenue: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  image?: string;
  slug: string;
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    categories: [] as Category[],
    loading: false,
    error: null as string | null,
    
    // Common product attributes for filtering
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    availableColors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Green', hex: '#00FF00' },
      { name: 'Yellow', hex: '#FFFF00' },
      { name: 'Purple', hex: '#800080' },
      { name: 'Pink', hex: '#FFC0CB' },
      { name: 'Gray', hex: '#808080' },
      { name: 'Brown', hex: '#A52A2A' }
    ],
    availableLocations: ['Warehouse A', 'Warehouse B', 'Store Front', 'Online Only']
  }),
  
  getters: {
    getProductById: (state) => (id: string): Product | undefined => {
      return state.products.find(product => product.id === id);
    },
    
    getProductsByCategory: (state) => (categoryId: string): Product[] => {
      return state.products.filter(product => product.categoryId === categoryId);
    },
    
    getLowStockProducts: (state) => (threshold = 10): Product[] => {
      return state.products.filter(product => product.stock <= threshold);
    },
    
    getActiveProducts: (state) => (): Product[] => {
      return state.products.filter(product => product.status === 'active');
    },
    
    getCategoryById: (state) => (id: string): Category | undefined => {
      return state.categories.find(category => category.id === id);
    },
    
    getCategoryBySlug: (state) => (slug: string): Category | undefined => {
      return state.categories.find(category => category.slug === slug);
    },
    
    getSubcategories: (state) => (parentId: string): Category[] => {
      return state.categories.filter(category => category.parentId === parentId);
    }
  },
  
  actions: {
    // Helper function to generate weekly sales data
    generateWeeklySalesData(totalUnits: number, totalRevenue: number): SalesDataPoint[] {
      const data: SalesDataPoint[] = [];
      const today = new Date();
      
      // Generate data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Random distribution of sales
        const factor = Math.random() * 0.5 + 0.75; // Between 0.75 and 1.25
        const units = Math.round((totalUnits / 7) * factor);
        const revenue = Math.round(((totalRevenue / 7) * factor) * 100) / 100;
        
        data.push({
          date: date.toISOString().split('T')[0],
          units,
          revenue
        });
      }
      
      return data;
    },
    
    // Helper function to generate monthly sales data
    generateMonthlySalesData(totalUnits: number, totalRevenue: number): SalesDataPoint[] {
      const data: SalesDataPoint[] = [];
      const today = new Date();
      
      // Generate data for the last 30 days (grouped by week)
      for (let i = 3; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (i * 7));
        
        // Random distribution of sales
        const factor = Math.random() * 0.5 + 0.75; // Between 0.75 and 1.25
        const units = Math.round((totalUnits / 4) * factor);
        const revenue = Math.round(((totalRevenue / 4) * factor) * 100) / 100;
        
        data.push({
          date: date.toISOString().split('T')[0],
          units,
          revenue
        });
      }
      
      return data;
    },
    
    // Product CRUD operations
    async fetchProducts() {
      try {
        this.loading = true;
        this.error = null;
        
        // For demo, we're using mock data
        // In a real app, this would be an API call:
        // const response = await axios.get('/api/products');
        // this.products = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        this.products = [
          {
            id: '1',
            name: 'Premium Cotton T-Shirt',
            description: 'Soft, breathable cotton t-shirt perfect for everyday wear.',
            price: 29.99,
            sku: 'TS-COT-001',
            categoryId: '1',
            stock: 124,
            status: 'active',
            images: ['/images/products/t-shirt.jpg'],
            variants: [
              { id: '1-1', productId: '1', size: 'S', color: 'Black', stock: 20, sku: 'TS-COT-001-S-BLK' },
              { id: '1-2', productId: '1', size: 'M', color: 'Black', stock: 30, sku: 'TS-COT-001-M-BLK' },
              { id: '1-3', productId: '1', size: 'L', color: 'Black', stock: 25, sku: 'TS-COT-001-L-BLK' },
              { id: '1-4', productId: '1', size: 'S', color: 'White', stock: 15, sku: 'TS-COT-001-S-WHT' },
              { id: '1-5', productId: '1', size: 'M', color: 'White', stock: 20, sku: 'TS-COT-001-M-WHT' },
              { id: '1-6', productId: '1', size: 'L', color: 'White', stock: 14, sku: 'TS-COT-001-L-WHT' }
            ],
            location: 'Warehouse A',
            createdAt: '2023-01-15T12:00:00Z',
            updatedAt: '2023-03-20T15:30:00Z',
            salesData: {
              weeklySales: this.generateWeeklySalesData(328, 9836.72),
              monthlySales: this.generateMonthlySalesData(1250, 37485.50)
            }
          },
          {
            id: '2',
            name: 'Summer Floral Dress',
            description: 'Light and flowery summer dress with adjustable straps.',
            price: 59.99,
            sku: 'DR-SUM-002',
            categoryId: '2',
            stock: 86,
            status: 'active',
            images: ['/images/products/dress.jpg'],
            variants: [
              { id: '2-1', productId: '2', size: 'S', color: 'Blue', stock: 18, sku: 'DR-SUM-002-S-BLU' },
              { id: '2-2', productId: '2', size: 'M', color: 'Blue', stock: 22, sku: 'DR-SUM-002-M-BLU' },
              { id: '2-3', productId: '2', size: 'L', color: 'Blue', stock: 15, sku: 'DR-SUM-002-L-BLU' },
              { id: '2-4', productId: '2', size: 'S', color: 'Pink', stock: 10, sku: 'DR-SUM-002-S-PNK' },
              { id: '2-5', productId: '2', size: 'M', color: 'Pink', stock: 12, sku: 'DR-SUM-002-M-PNK' },
              { id: '2-6', productId: '2', size: 'L', color: 'Pink', stock: 9, sku: 'DR-SUM-002-L-PNK' }
            ],
            location: 'Store Front',
            createdAt: '2023-02-10T09:15:00Z',
            updatedAt: '2023-04-05T11:45:00Z',
            salesData: {
              weeklySales: this.generateWeeklySalesData(215, 12897.85),
              monthlySales: this.generateMonthlySalesData(820, 49195.80)
            }
          },
          {
            id: '3',
            name: 'Slim Fit Jeans',
            description: 'Classic slim fit jeans with stretch for comfort.',
            price: 49.99,
            sku: 'JN-SLM-003',
            categoryId: '3',
            stock: 152,
            status: 'active',
            images: ['/images/products/jeans.jpg'],
            variants: [
              { id: '3-1', productId: '3', size: '30', color: 'Blue', stock: 28, sku: 'JN-SLM-003-30-BLU' },
              { id: '3-2', productId: '3', size: '32', color: 'Blue', stock: 35, sku: 'JN-SLM-003-32-BLU' },
              { id: '3-3', productId: '3', size: '34', color: 'Blue', stock: 30, sku: 'JN-SLM-003-34-BLU' },
              { id: '3-4', productId: '3', size: '36', color: 'Blue', stock: 25, sku: 'JN-SLM-003-36-BLU' },
              { id: '3-5', productId: '3', size: '30', color: 'Black', stock: 18, sku: 'JN-SLM-003-30-BLK' },
              { id: '3-6', productId: '3', size: '32', color: 'Black', stock: 16, sku: 'JN-SLM-003-32-BLK' }
            ],
            location: 'Warehouse A',
            createdAt: '2023-01-25T14:20:00Z',
            updatedAt: '2023-03-15T10:10:00Z',
            salesData: {
              weeklySales: this.generateWeeklySalesData(187, 9348.13),
              monthlySales: this.generateMonthlySalesData(720, 35994.80)
            }
          },
          {
            id: '4',
            name: 'Waterproof Winter Jacket',
            description: 'Insulated waterproof jacket perfect for cold weather.',
            price: 89.99,
            sku: 'JK-WNT-004',
            categoryId: '4',
            stock: 65,
            status: 'active',
            images: ['/images/products/jacket.jpg'],
            variants: [
              { id: '4-1', productId: '4', size: 'M', color: 'Black', stock: 12, sku: 'JK-WNT-004-M-BLK' },
              { id: '4-2', productId: '4', size: 'L', color: 'Black', stock: 18, sku: 'JK-WNT-004-L-BLK' },
              { id: '4-3', productId: '4', size: 'XL', color: 'Black', stock: 15, sku: 'JK-WNT-004-XL-BLK' },
              { id: '4-4', productId: '4', size: 'M', color: 'Green', stock: 5, sku: 'JK-WNT-004-M-GRN' },
              { id: '4-5', productId: '4', size: 'L', color: 'Green', stock: 8, sku: 'JK-WNT-004-L-GRN' },
              { id: '4-6', productId: '4', size: 'XL', color: 'Green', stock: 7, sku: 'JK-WNT-004-XL-GRN' }
            ],
            location: 'Warehouse B',
            createdAt: '2023-03-05T11:30:00Z',
            updatedAt: '2023-04-10T16:45:00Z',
            salesData: {
              weeklySales: this.generateWeeklySalesData(120, 10798.80),
              monthlySales: this.generateMonthlySalesData(480, 43195.20)
            }
          },
          {
            id: '5',
            name: 'Pullover Hoodie',
            description: 'Comfortable pullover hoodie with kangaroo pocket.',
            price: 39.99,
            sku: 'HD-PUL-005',
            categoryId: '5',
            stock: 94,
            status: 'active',
            images: ['/images/products/hoodie.jpg'],
            variants: [
              { id: '5-1', productId: '5', size: 'S', color: 'Gray', stock: 14, sku: 'HD-PUL-005-S-GRY' },
              { id: '5-2', productId: '5', size: 'M', color: 'Gray', stock: 22, sku: 'HD-PUL-005-M-GRY' },
              { id: '5-3', productId: '5', size: 'L', color: 'Gray', stock: 18, sku: 'HD-PUL-005-L-GRY' },
              { id: '5-4', productId: '5', size: 'S', color: 'Black', stock: 12, sku: 'HD-PUL-005-S-BLK' },
              { id: '5-5', productId: '5', size: 'M', color: 'Black', stock: 16, sku: 'HD-PUL-005-M-BLK' },
              { id: '5-6', productId: '5', size: 'L', color: 'Black', stock: 12, sku: 'HD-PUL-005-L-BLK' }
            ],
            location: 'Warehouse A',
            createdAt: '2023-02-18T13:40:00Z',
            updatedAt: '2023-04-02T09:15:00Z',
            salesData: {
              weeklySales: this.generateWeeklySalesData(156, 6238.44),
              monthlySales: this.generateMonthlySalesData(620, 24793.80)
            }
          }
        ];
        
      } catch (error) {
        this.error = 'Failed to fetch products';
        console.error('Error fetching products:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCategories() {
      try {
        this.loading = true;
        this.error = null;
        
        // For demo, we're using mock data
        // In a real app, this would be an API call:
        // const response = await axios.get('/api/categories');
        // this.categories = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.categories = [
          {
            id: '1',
            name: 'T-shirts',
            description: 'Casual t-shirts for all occasions',
            slug: 't-shirts',
            image: '/images/categories/t-shirts.jpg'
          },
          {
            id: '2',
            name: 'Dresses',
            description: 'Elegant dresses for women',
            slug: 'dresses',
            image: '/images/categories/dresses.jpg'
          },
          {
            id: '3',
            name: 'Jeans',
            description: 'Denim jeans for men and women',
            slug: 'jeans',
            image: '/images/categories/jeans.jpg'
          },
          {
            id: '4',
            name: 'Jackets',
            description: 'Stylish jackets for all seasons',
            slug: 'jackets',
            image: '/images/categories/jackets.jpg'
          },
          {
            id: '5',
            name: 'Hoodies',
            description: 'Comfortable hoodies and sweatshirts',
            slug: 'hoodies',
            image: '/images/categories/hoodies.jpg'
          },
          {
            id: '6',
            name: 'Shirts',
            description: 'Formal and casual shirts',
            parentId: '1',
            slug: 'shirts',
            image: '/images/categories/shirts.jpg'
          },
          {
            id: '7',
            name: 'Sweaters',
            description: 'Warm and cozy sweaters',
            slug: 'sweaters',
            image: '/images/categories/sweaters.jpg'
          }
        ];
        
      } catch (error) {
        this.error = 'Failed to fetch categories';
        console.error('Error fetching categories:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // const response = await axios.post('/api/products', product);
        // const newProduct = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new product with generated ID and timestamps
        const newProduct: Product = {
          ...product,
          id: (this.products.length + 1).toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Add to the products array
        this.products.push(newProduct);
        
        return newProduct;
        
      } catch (error) {
        this.error = 'Failed to add product';
        console.error('Error adding product:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProduct(id: string, updates: Partial<Product>) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // const response = await axios.put(`/api/products/${id}`, updates);
        // const updatedProduct = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the product to update
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
          throw new Error('Product not found');
        }
        
        // Update the product
        const updatedProduct = {
          ...this.products[productIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        
        // Replace in the products array
        this.products[productIndex] = updatedProduct;
        
        return updatedProduct;
        
      } catch (error) {
        this.error = 'Failed to update product';
        console.error('Error updating product:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProductStatus(id: string, status: 'active' | 'draft' | 'inactive') {
      try {
        return await this.updateProduct(id, { status });
      } catch (error) {
        throw error;
      }
    },
    
    async deleteProduct(id: string) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // await axios.delete(`/api/products/${id}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Remove from the products array
        this.products = this.products.filter(product => product.id !== id);
        
      } catch (error) {
        this.error = 'Failed to delete product';
        console.error('Error deleting product:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async addCategory(category: Omit<Category, 'id'>) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // const response = await axios.post('/api/categories', category);
        // const newCategory = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create a new category with generated ID
        const newCategory: Category = {
          ...category,
          id: (this.categories.length + 1).toString()
        };
        
        // Add to the categories array
        this.categories.push(newCategory);
        
        return newCategory;
        
      } catch (error) {
        this.error = 'Failed to add category';
        console.error('Error adding category:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateCategory(id: string, updates: Partial<Category>) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // const response = await axios.put(`/api/categories/${id}`, updates);
        // const updatedCategory = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the category to update
        const categoryIndex = this.categories.findIndex(category => category.id === id);
        if (categoryIndex === -1) {
          throw new Error('Category not found');
        }
        
        // Update the category
        const updatedCategory = {
          ...this.categories[categoryIndex],
          ...updates
        };
        
        // Replace in the categories array
        this.categories[categoryIndex] = updatedCategory;
        
        return updatedCategory;
        
      } catch (error) {
        this.error = 'Failed to update category';
        console.error('Error updating category:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteCategory(id: string) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // await axios.delete(`/api/categories/${id}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if any products use this category
        const productsUsingCategory = this.products.some(product => product.categoryId === id);
        if (productsUsingCategory) {
          throw new Error('Cannot delete category that is in use by products');
        }
        
        // Remove from the categories array
        this.categories = this.categories.filter(category => category.id !== id);
        
      } catch (error) {
        this.error = 'Failed to delete category';
        console.error('Error deleting category:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // Product variant functions
    async addVariant(productId: string, variant: Omit<ProductVariant, 'id' | 'productId'>) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // const response = await axios.post(`/api/products/${productId}/variants`, variant);
        // const newVariant = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the product
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
          throw new Error('Product not found');
        }
        
        // Create a new variant with generated ID
        const newVariant: ProductVariant = {
          ...variant,
          id: `${productId}-${this.products[productIndex].variants.length + 1}`,
          productId
        };
        
        // Add to the product's variants array
        this.products[productIndex].variants.push(newVariant);
        
        // Update the product's total stock
        const totalStock = this.products[productIndex].variants.reduce((sum, variant) => sum + variant.stock, 0);
        this.products[productIndex].stock = totalStock;
        
        return newVariant;
        
      } catch (error) {
        this.error = 'Failed to add variant';
        console.error('Error adding variant:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateVariant(productId: string, variantId: string, updates: Partial<ProductVariant>) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // const response = await axios.put(`/api/products/${productId}/variants/${variantId}`, updates);
        // const updatedVariant = response.data;
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the product
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
          throw new Error('Product not found');
        }
        
        // Find the variant
        const variantIndex = this.products[productIndex].variants.findIndex(variant => variant.id === variantId);
        if (variantIndex === -1) {
          throw new Error('Variant not found');
        }
        
        // Update the variant
        const updatedVariant = {
          ...this.products[productIndex].variants[variantIndex],
          ...updates
        };
        
        // Replace in the variants array
        this.products[productIndex].variants[variantIndex] = updatedVariant;
        
        // Update the product's total stock
        const totalStock = this.products[productIndex].variants.reduce((sum, variant) => sum + variant.stock, 0);
        this.products[productIndex].stock = totalStock;
        
        return updatedVariant;
        
      } catch (error) {
        this.error = 'Failed to update variant';
        console.error('Error updating variant:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteVariant(productId: string, variantId: string) {
      try {
        this.loading = true;
        this.error = null;
        
        // In a real app, this would be an API call:
        // await axios.delete(`/api/products/${productId}/variants/${variantId}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Find the product
        const productIndex = this.products.findIndex(product => product.id === productId);
        if (productIndex === -1) {
          throw new Error('Product not found');
        }
        
        // Remove the variant
        this.products[productIndex].variants = this.products[productIndex].variants.filter(variant => variant.id !== variantId);
        
        // Update the product's total stock
        const totalStock = this.products[productIndex].variants.reduce((sum, variant) => sum + variant.stock, 0);
        this.products[productIndex].stock = totalStock;
        
      } catch (error) {
        this.error = 'Failed to delete variant';
        console.error('Error deleting variant:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});