// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'NPHTM CMS',
        },
        // keepalive: true,
    },
    ssr: false,
    runtimeConfig: {
        public: {
            API_KEY: process.env.API_KEY,
            AUTH_DOMAIN: process.env.AUTH_DOMAIN,
            PROJECT_ID: process.env.PROJECT_ID,
            STORAGE_BUCKET: process.env.STORAGE_BUCKET,
            MESSAGING_SENDER_ID: process.env.MESSAGING_SENDER_ID,
            APP_ID: process.env.APP_ID,
            MEASUREMENT_ID: process.env.MEASUREMENT_ID
        }
    },
    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    modules: [
        // ... other modules
        'nuxt-vuefire',
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
    ],
    piniaPersistedstate: {
        cookieOptions: {
            sameSite: 'strict',
        },
        storage: 'localStorage'
    },
    pinia: {
        autoImports: [
            // automatically imports `defineStore`
            'defineStore', // import { defineStore } from 'pinia'
            ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ],
    },

    vuefire: {
        auth: true,
        config: {
            apiKey: process.env.API_KEY,
            authDomain: process.env.AUTH_DOMAIN,
            projectId: process.env.PROJECT_ID,
            storageBucket: process.env.STORAGE_BUCKET,
            messagingSenderId: process.env.MESSAGING_SENDER_ID,
            appId: process.env.APP_ID,
            measurementId: process.env.MEASUREMENT_ID
        },
    },
})