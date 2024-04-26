import 'regenerator-runtime/runtime'
import '@bcgov/bc-sans/css/BCSans.css'
import '@/assets/css/main.css'
import '@/assets/css/reset.css'

import HttpStatus from 'http-status-codes'
import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'

import vuetify from '@/plugins/vuetify'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()

app.provide('$moment', moment)
app.use(router).use(createMetaManager()).use(pinia).use(vuetify)

// Load lookinfo (with valid jwt) before App is mounted
// so that the lookupInfo is available in the router
loadLookupInfo().then(() => {
  app.mount('#app')
})

async function loadLookupInfo() {
  const app = useAppStore()
  const auth = useAuthStore()
  try {
    await auth.getJwtToken()
    await app.getLookupInfo()
  } catch (e) {
    if (!e.response || e.response.status !== HttpStatus.UNAUTHORIZED) {
      // this.logout()
      // TODO (weskubo-cgi) this.$router isn't available in main.js
      // Instead set a flag and redirect in route
      this.$router.replace({
        name: 'error',
        query: { message: `500_${e.data || 'ServerError'}` },
      })
    }
  }
}
