import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth.js'
import ImpersonateView from '@/views/ImpersonateView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('ImpersonateView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()
  authStore.isAuthenticated = true
  authStore.userInfo = { displayName: 'UT User' }
  test('init', async () => {
    const wrapper = mount(ImpersonateView, global)
    expect(wrapper.text()).toContain('Welcome UT User')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('search', async () => {
    const wrapper = mount(ImpersonateView, global)
    await wrapper.setData({ businessBCeId: 'ofmqa01' })

    wrapper.get('#bceid-search').trigger('click')
    // TODO Validate button click
    // expect(authStore.impersonateId).toBe('ofmqa01')
  })
})
