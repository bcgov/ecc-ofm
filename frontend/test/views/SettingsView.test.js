import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { describe, test } from 'vitest'

import SettingsView from '@/views/SettingsView.vue'
import { createTestingPinia } from '@pinia/testing'
import { createVuetify } from 'vuetify'
import { mount } from '@vue/test-utils'
import { useAuthStore } from '@/stores/auth.js'

const vuetify = createVuetify({ components, directives })

describe('SettingsVuew', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()

  test('BceID User', async () => {
    authStore.userInfo = { organziationId: '6fbddbd7-5f8e-ee11-8179-000d3a09d699' }
    const wrapper = mount(SettingsView, global)
    console.log(wrapper.html())
  })

  /*  it('shows "Account Management" in the first row of the Role column', async () => {
    await flushPromises() // Ensure all rendering is completed
    const firstRow = wrapper.find('table tbody tr:first-child')
    const roleCell = firstRow.find('td:nth-child(5)')

    expect(roleCell.text()).toContain('Account Management')
  }) */
})
