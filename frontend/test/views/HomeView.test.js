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
    authStore.userInfo = { userName: 'ofmqa01', role: 2 }
    const wrapper = mount(HomeView, global)

    // BCeID User should see all options
    expect(wrapper.text()).toContain('Reporting')
    expect(wrapper.text()).toContain('Funding')
    expect(wrapper.text()).toContain('Documents')
    expect(wrapper.text()).toContain('View Applications')
    expect(wrapper.text()).toContain('New Application')
    expect(wrapper.text()).toContain('Resources')
    expect(wrapper.text()).toContain('Account Management')

    expect(wrapper.html()).toMatchSnapshot()
  })
  test('IDIR User', async () => {
    authStore.isMinistryUser = true
    authStore.userInfo = { userName: 'idiruser' }
    authStore.userInfo = { userName: 'idiruser', role: 2 }
    const wrapper = mount(HomeView, global)

    // IDIR User should see all options
    expect(wrapper.text()).toContain('Reporting')
    expect(wrapper.text()).toContain('Funding')
    expect(wrapper.text()).toContain('Documents')
    expect(wrapper.text()).toContain('View Applications')
    expect(wrapper.text()).toContain('New Application')
    expect(wrapper.text()).toContain('Resources')
    expect(wrapper.text()).toContain('Account Management')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
