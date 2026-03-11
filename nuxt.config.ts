// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/i18n'],
  i18n: {
    langDir: 'locales',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
    ],
    strategy: 'no_prefix',
    defaultLocale: 'en',
    vueI18n: './i18n.config.ts',
  },
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
