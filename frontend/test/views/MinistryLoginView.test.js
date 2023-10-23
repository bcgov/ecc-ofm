import { describe, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import MinistryLoginView from '@/views/MinistryLoginView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('MinistryLoginView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  test('init', async () => {
    const wrapper = mount(MinistryLoginView, global)
    expect(wrapper.text()).toContain('IDIR')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('login', async () => {
    const wrapper = mount(MinistryLoginView, global)

    const loginButton = wrapper.get('#idir-login')
    expect(loginButton.attributes().href).toEqual('/api/auth/login-idir')
  })
})
