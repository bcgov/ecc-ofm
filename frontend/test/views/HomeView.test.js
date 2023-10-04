import { describe, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import HomeView from '@/views/HomeView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('HomeView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  test('init', async () => {
    const wrapper = mount(HomeView, global)
    expect(wrapper.text()).toContain('OFM')
    expect(wrapper.text()).toContain('Temp Home Screen')
    expect(wrapper.html()).toMatchSnapshot()
  })
})
