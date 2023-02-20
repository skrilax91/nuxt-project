import svgLoader from 'vite-svg-loader'

const spa = process.argv.includes('--spa')

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: !spa,

    typescript: {
        shim: false
    },

    /*
    ** Headers of the page
    */
    head: {
        title: 'Delyss',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Delyss resto menu' }
        ],
        script: []
    },

    /*
    ** Global CSS
    */
    css: [
        '~/assets/css/main.scss',
        'bootstrap/dist/css/bootstrap.css',
    ],


    vite: {
        plugins: [
            svgLoader(), // https://github.com/jpkleemans/vite-svg-loader#readme
        ],
    },


    modules: [
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'bootstrap-vue-3/nuxt',
        '@nuxtjs/ionic',
    ],

    i18n: {
        locales: [
            { code: 'fr', iso: 'fr-FR', file: 'fr.json' },
            { code: 'gb', iso: 'en-US', file: 'en.json' },
            { code: 'pt', iso: 'pt-BR', file: 'pt.json' },
        ],
        lazy: true,
        defaultLocale: 'fr',
        legacy: false,
        strategy: 'no_prefix',
        langDir: 'locales/',
        vueI18n: {
            fallbackLocale: 'fr',
        }
    },

    server: {
        host: process.env.NUXT_HOST,
        port: process.env.NUXT_PORT,
    },

    runtimeConfig: {
        public: {
            panelUrl: process.env.PANEL_URL || 'https://dev.delyss-menu.com',
            appVersion: "3.0.0",
        }
    }
})
