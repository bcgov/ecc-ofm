import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@fortawesome/fontawesome-free/css/all.css'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { aliases, mdi } from 'vuetify/iconsets/mdi'

import { createVuetify } from 'vuetify/dist/vuetify'
import { fa } from 'vuetify/iconsets/fa'

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
      fa,
    },
  },
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
})
