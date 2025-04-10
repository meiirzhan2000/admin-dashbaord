export default defineNuxtPlugin((nuxtApp) => {
    if (process.client) {
      import('vue3-apexcharts').then((VueApexCharts) => {
        nuxtApp.vueApp.use(VueApexCharts.default)
      })
    }
  })