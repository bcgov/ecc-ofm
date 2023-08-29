import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify/dist/vuetify';
import { createMetaManager } from 'vue-meta';
import App from './App.vue'
import router from './router'
import moment from 'moment';
import 'regenerator-runtime/runtime';
import * as colors from 'vuetify/lib/util/colors';
import styles from 'vuetify/styles';
import * as labs from 'vuetify/labs/components';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

/*TODO: runtime issues resolving, possibly addition libs required in package.json
import '@mdi/font/css/materialdesignicons.css';
*/

/*TODO: uncomment when integrating with backend
import ApiService from '@/common/apiService';
*/
import webSocketService from '@/services/web-socket-service';

const myCustomLightTheme = {
    dark: false,
    colors: {
      primary: '#003366'
    }
  };
  
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi'
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
        myCustomLightTheme,
      }
    },
    components: {
      ...labs,
      ...components,
      ...directives,
      ...styles,
      ...colors
    },
  });

const pinia = createPinia();
const newApp = createApp(App);

/*TODO: uncomment when integrating with backend
const config = await ApiService.getConfig();
*/

newApp.provide('$moment', moment);
newApp.use(router).use(webSocketService, {
  newApp
  //TODO: uncomment when integrating with backend... url: config.data.WEB_SOCKET_URL || 'wss://'+window.location.hostname+'/api/socket'
}).use(createMetaManager()).use(pinia).use(vuetify).mount('#app');