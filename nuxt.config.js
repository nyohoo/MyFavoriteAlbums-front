require('dotenv').config()
import colors from 'vuetify/es5/util/colors'

export default {
  // Railsと被らないようにポート番号を設定
  server: {
    port: process.env.PORT || 8080
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'MyFavoriteAlbums - %s',
    title: 'front',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    BASE_URL: process.env.BASE_URL,
    CALL_BACK: process.env.CALL_BACK,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/cookie',
    { src: '@/plugins/infiniteloading' },
    { src: "@/plugins/localStorage", ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
    "@nuxtjs/google-gtag"
  ],

  "google-gtag": {
    id: "G-XJ7BXT5V60",
    debug: true
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // '@nuxtjs/auth',
    'cookie-universal-nuxt',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000/api/v1/'
   },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
            background: "#202225",
            primary: "#1DB954",
            secondary: "#8bc34a",
            accent: "#cddc39",
            error: "#E53935",
            warning: "#ffc107",
            info: colors.blue.darken1,
            success: "#795548"
        },
        light: {
          primary: "#1DB954",
          accent: colors.grey.darken3,
          secondary: "#8bc34a",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        options: {
          customProperties: true
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
