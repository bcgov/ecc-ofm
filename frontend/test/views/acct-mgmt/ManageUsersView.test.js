import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth.js'
import ManageUsersView from '@/views/account-mgmt/ManageUsersView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('Manage Users screen', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()

  test('BceID User', async () => {
    authStore.userInfo = { organziationId: '6fbddbd7-5f8e-ee11-8179-000d3a09d699' }
    const wrapper = mount(ManageUsersView, global)
    console.log(wrapper.html())
    expect(wrapper.html()).toMatchSnapshot()
  })

  /*  it('shows "Account Management" in the first row of the Role column', async () => {
    await flushPromises() // Ensure all rendering is completed
    const firstRow = wrapper.find('table tbody tr:first-child')
    const roleCell = firstRow.find('td:nth-child(5)')

    expect(roleCell.text()).toContain('Account Management')
  }) */
})
