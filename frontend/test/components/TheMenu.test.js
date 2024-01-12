import { describe, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import TheMenu from '@/components/TheMenu.vue'
import { useAuthStore } from '@/stores/auth.js'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('TheMenu', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()
  authStore.isAuthenticated = true
  authStore.currentFacility = { facilityName: 'UT Facility' }

  // Tests that all Menu Items display for a user with all roles
  test('all menu items visible', async () => {
    authStore.userInfo = {
      organizationName: 'UT Org',
      role: 2,
    }
    const wrapper = mount(TheMenu, global)
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Messaging')
    expect(wrapper.text()).toContain('Reporting')
    expect(wrapper.text()).toContain('Funding')
    expect(wrapper.text()).toContain('Documents')
    expect(wrapper.text()).toContain('Applications')
    expect(wrapper.text()).toContain('Resources')
    expect(wrapper.text()).toContain('Settings')
    expect(wrapper.html()).toMatchSnapshot()
  })

  // Tests that the Settings Menu Item isn't displayed
  // for a user without 2 = 'Account Management'
  test('Settings menu item hidden', async () => {
    authStore.userInfo = {
      organizationName: 'UT Org',
      role: 1,
    }
    const wrapper = mount(TheMenu, global)
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Messaging')
    expect(wrapper.text()).toContain('Reporting')
    expect(wrapper.text()).toContain('Funding')
    expect(wrapper.text()).toContain('Documents')
    expect(wrapper.text()).toContain('Applications')
    expect(wrapper.text()).toContain('Resources')
    expect(wrapper.text()).not.toContain('Settings')
  })
})
