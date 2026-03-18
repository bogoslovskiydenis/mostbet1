// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  devServer: {
    host: '127.0.0.1',
    port: 3000,
  },
  watchers: {
    chokidar: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/.nuxt/**', '**/.output/**'],
      usePolling: true,
      interval: 300,
    },
  },
  vite: {
    server: {
      watch: {
        ignored: ['**/node_modules/**', '**/.git/**', '**/.nuxt/**', '**/.output/**'],
        usePolling: true,
        interval: 300,
      },
    },
  },
})
