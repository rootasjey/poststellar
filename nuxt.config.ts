// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  hub: {
    blob: true,
    cache: true,
    database: true,
    kv: true,
    browser: true,
  },
  modules: [
    '@nuxt/image',
    '@una-ui/nuxt',
    '@nuxthub/core',
    '@pinia/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/color-mode',
  ],
  unocss: {
    preflight: true,
    icons: {
      scale: 1.0,
      extraProperties: {
        "display": "inline-block",
        "vertical-align": "middle",
      },
    },
    theme: {
      colors: {
        primary: {
          DEFAULT: '#687FE5',
          50: '#F4F5FF',
          100: '#E9EDFF',
          200: '#DDE2FF',
          300: '#CDD4FF',
          400: '#BCC7FF',
          500: '#687FE5',
          600: '#576ED3',
          700: '#4659B7',
          800: '#2E3E93',
          900: '#161F70',
        },
      },
    },
  },
  una: {
    prefix: "N",
    themeable: true,
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },
})