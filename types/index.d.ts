// types/index.d.ts

// Extend the Nuxt interface to include our custom plugins
declare module '#app' {
    interface NuxtApp {
      $toast: {
        toasts: Ref<{
          id: number;
          title: string;
          description: string;
          type: 'success' | 'error' | 'warning' | 'info';
          color: string;
          timeout: number;
        }[]>;
        success: (options: { title: string; description?: string }) => number;
        error: (options: { title: string; description?: string }) => number;
        warning: (options: { title: string; description?: string }) => number;
        info: (options: { title: string; description?: string }) => number;
        add: (options: { 
          title: string; 
          description?: string; 
          type?: 'success' | 'error' | 'warning' | 'info';
          color?: string;
          timeout?: number;
        }) => number;
        remove: (id: number) => void;
        clear: () => void;
      };
    }
  }
  
  export {}