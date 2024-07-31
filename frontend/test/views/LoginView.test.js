import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import LoginView from '@/views/LoginView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('LoginView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  test('init', async () => {
    const wrapper = mount(LoginView, global)
    expect(wrapper.text()).toContain('BCeID')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('login', async () => {
    const wrapper = mount(LoginView, global)

    const loginButton = wrapper.get('#bceid-login')
    expect(loginButton.attributes().href).toEqual('/api/auth/login')
  })
})
