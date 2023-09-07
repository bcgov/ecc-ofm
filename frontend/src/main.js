import 'regenerator-runtime/runtime'
import '@mdi/font/css/materialdesignicons.css'
import '@bcgov/bc-sans/css/BCSans.css'

import moment from 'moment'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify/dist/vuetify'
import * as labs from 'vuetify/labs/components'
import * as colors from 'vuetify/lib/util/colors'
import styles from 'vuetify/styles'

import webSocketService from '@/services/web-socket-service'

import App from './App.vue'
import router from './router'

/*TODO: uncomment when integrating with backend
import ApiService from '@/common/apiService';
*/

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#003366'
  }
}

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi'
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme
    }
  },
  components: {
    ...labs,
    ...components,
    ...directives,
    ...styles,
    ...colors
  }
})

const app = createApp(App)

const pinia = createPinia()

/*TODO: uncomment when integrating with backend
const config = await ApiService.getConfig();
*/

app.provide('$moment', moment)
app
  .use(router)
  .use(webSocketService, {
    app
    //TODO: uncomment when integrating with backend... url: config.data.WEB_SOCKET_URL || 'wss://'+window.location.hostname+'/api/socket'
  })
  .use(createMetaManager())
  .use(pinia)
  .use(vuetify)
  .mount('#app')
