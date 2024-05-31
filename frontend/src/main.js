import '@bcgov/bc-sans/css/BCSans.css'
import '@/assets/css/main.css'
import '@/assets/css/reset.css'

import HttpStatus from 'http-status-codes'
import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import { VDateInput } from 'vuetify/labs/VDateInput'

import vuetify from '@/plugins/vuetify'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

app.provide('$moment', moment)
app.use(createMetaManager()).use(pinia).use(vuetify)
app.component('VDateInput', VDateInput)

// Load lookinfo (with valid jwt) before App is mounted
// so that the lookupInfo is available in the router
loadLookupInfo().then(() => {
  app.use(router)
  app.mount('#app')
})

async function loadLookupInfo() {
  const app = useAppStore()
  const auth = useAuthStore()
  try {
    await auth.getJwtToken()
    await app.getLookupInfo()
  } catch (e) {
    // Flag errors that aren't 401 UNAUTHORIZED which is expected before the user is logged in
    if (!e.response || e.response.status !== HttpStatus.UNAUTHORIZED) {
      app.backendError = true
    }
  }
}
