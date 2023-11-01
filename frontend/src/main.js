import 'regenerator-runtime/runtime'
import '@bcgov/bc-sans/css/BCSans.css'
import '@/assets/css/main.css'
import '@/assets/css/reset.css'

import App from './App.vue'
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import { createPinia } from 'pinia'
import moment from 'moment'
import router from './router'
import vuetify from '@/plugins/vuetify'
import webSocketService from '@/services/web-socket-service'

const app = createApp(App)

const pinia = createPinia()

app.component('VDataTable', VDataTable)
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
