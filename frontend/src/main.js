import 'regenerator-runtime/runtime'
import '@bcgov/bc-sans/css/BCSans.css'
import '@/assets/css/main.css'
import '@/assets/css/reset.css'

import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'

import vuetify from '@/plugins/vuetify'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

app.provide('$moment', moment)
app.use(router).use(createMetaManager()).use(pinia).use(vuetify).mount('#app')
