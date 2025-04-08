// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: false },
  
  typescript: {
    strict: false,
    typeCheck: false,
  },
  
  // Configure modules
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxt/icon', // Add the icon module
  ],
  
  devServer: {
    port: 5173
  },
  // Configure server options
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://gaya-web-service.onrender.com',
        changeOrigin: true
      }
    }
  },
  
  // Global CSS
  css: ['~/assets/css/main.css'],
  
  // Configure color mode
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classPrefix: '',
    classSuffix: '',
  },
  
  // Runtime config
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'https://gaya-web-service.onrender.com',
    },
  },
  
  // Plugins
  plugins: [
    '~/plugins/auth.ts',
    '~/plugins/toast.client.ts'
  ],
  
  // Auto-import components
  components: {
    dirs: [
      '~/components'
    ],
    global: true
  },
  
  compatibilityDate: '2025-04-02',
})