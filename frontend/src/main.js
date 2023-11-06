import 'regenerator-runtime/runtime'
import '@bcgov/bc-sans/css/BCSans.css'
import '@/assets/css/main.css'
import '@/assets/css/reset.css'

import App from './App.vue'
import { VDataTable } from 'vuetify/lib/labs/components.mjs'
import { VDataTableVirtual } from 'vuetify/lib/labs/components.mjs'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import { createPinia } from 'pinia'
import moment from 'moment'
import router from './router'
import vuetify from '@/plugins/vuetify'

const app = createApp(App)

const pinia = createPinia()

app.component('VDataTable', VDataTable)
app.component('VDataTableVirtual', VDataTableVirtual)
app.provide('$moment', moment)
app
  .use(router)
  .use(createMetaManager())
  .use(pinia)
  .use(vuetify)
  .mount('#app')
