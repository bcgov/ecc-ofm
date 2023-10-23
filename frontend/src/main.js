import 'regenerator-runtime/runtime'
import '@bcgov/bc-sans/css/BCSans.css'
import '@/assets/css/main.css'
import '@/assets/css/reset.css'

import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'

import vuetify from '@/plugins/vuetify'
import webSocketService from '@/services/web-socket-service'

import App from './App.vue'
import router from './router'

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
