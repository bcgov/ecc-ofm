import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify/dist/vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: '#003366',
  },
}

export default createVuetify({
  components,
  directives,
  display: {
    mobileBreakpoint: 'md',
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
})
