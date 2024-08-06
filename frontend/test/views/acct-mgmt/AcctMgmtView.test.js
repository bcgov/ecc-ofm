import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth.js'
import AccountMgmtView from '@/views/account-mgmt/AccountMgmtView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('Manage Users screen', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()

  test('Test Account Manager Links', async () => {
    authStore.userInfo = { userName: 'accountManager', role: 2 }
    const wrapper = mount(AccountMgmtView, global)
    expect(wrapper.text()).toContain('Manage Organization/Facilities')
    expect(wrapper.text()).toContain('Manage Users')

    expect(wrapper.html()).toMatchSnapshot()
  })

  test('Test Admin Links', async () => {
    authStore.userInfo = { userName: 'admin', role: 1 }
    const wrapper = mount(AccountMgmtView, global)
    expect(wrapper.text()).toContain('Manage Organization/Facilities')
    expect(wrapper.text()).not.toContain('Manage Users')

    expect(wrapper.html()).toMatchSnapshot()
  })
})
