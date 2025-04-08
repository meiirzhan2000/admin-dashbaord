// plugins/toast.client.ts
import { ref } from 'vue';

interface ToastOptions {
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  color?: string;
  timeout?: number;
}

interface Toast extends Required<Omit<ToastOptions, 'type' | 'color'>> {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  color: string;
}

export default defineNuxtPlugin(() => {
  // Define reactive array for toast storage
  const toasts = ref<Toast[]>([]);
  
  // Toast service
  const toast = {
    // Get all toasts
    toasts,
    
    // Success toast
    success(options: ToastOptions) {
      return this.add({
        ...options,
        type: 'success',
        color: 'green'
      });
    },
    
    // Error toast
    error(options: ToastOptions) {
      return this.add({
        ...options,
        type: 'error',
        color: 'red'
      });
    },
    
    // Warning toast
    warning(options: ToastOptions) {
      return this.add({
        ...options,
        type: 'warning',
        color: 'yellow'
      });
    },
    
    // Info toast
    info(options: ToastOptions) {
      return this.add({
        ...options,
        type: 'info',
        color: 'blue'
      });
    },
    
    // Add a toast
    add(options: ToastOptions): number {
      const id = Date.now();
      
      const newToast: Toast = {
        id,
        title: options.title,
        description: options.description ?? '',
        type: options.type ?? 'info',
        color: options.color ?? 'blue',
        timeout: options.timeout ?? 5000,
      };
      
      toasts.value.push(newToast);
      
      // Auto-remove toast after timeout
      setTimeout(() => {
        this.remove(id);
      }, newToast.timeout);
      
      return id;
    },
    
    // Remove a toast by ID
    remove(id: number): void {
      toasts.value = toasts.value.filter(t => t.id !== id);
    },
    
    // Clear all toasts
    clear(): void {
      toasts.value = [];
    }
  };
  
  return {
    provide: {
      toast
    }
  };
});