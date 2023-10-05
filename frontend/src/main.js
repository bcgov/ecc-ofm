import 'regenerator-runtime/runtime'
import '@mdi/font/css/materialdesignicons.css'
import '@bcgov/bc-sans/css/BCSans.css'
import 'vuetify/styles'

import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify/dist/vuetify'

import webSocketService from '@/services/web-socket-service'

import App from './App.vue'
import router from './router'

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#003366',
  },
}

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
  components: {
    ...components,
    ...directives,
  },
})

const app = createApp(App)

const pinia = createPinia()

app.provide('$moment', moment)
app
  .use(router)
  .use(webSocketService, {
    app,
    //: uncomment when integrating with backend... url: config.data.WEB_SOCKET_URL || 'wss://'+window.location.hostname+'/api/socket'
  })
  .use(createMetaManager())
  .use(pinia)
  .use(vuetify)
  .mount('#app')
