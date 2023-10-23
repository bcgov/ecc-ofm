import { describe, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth.js'
import HomeView from '@/views/HomeView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('HomeView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()
  authStore.isAuthenticated = true
  test('BceID User', async () => {
    authStore.userInfo = { userName: 'ofmqa01' }
    const wrapper = mount(HomeView, global)
    expect(wrapper.text()).toContain('Provider User')
    expect(wrapper.text()).toContain('Business BCeID')
    expect(wrapper.text()).toContain('ofmqa01')

    expect(wrapper.html()).toMatchSnapshot()
  })
  test('IDIR User', async () => {
    authStore.isMinistryUser = true
    authStore.userInfo = { userName: 'idiruser' }
    const wrapper = mount(HomeView, global)
    expect(wrapper.text()).toContain('Ministry User')
    expect(wrapper.text()).toContain('IDIR')
    expect(wrapper.text()).toContain('idiruser')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
