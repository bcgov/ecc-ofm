import { describe, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import { useAuthStore } from '@/stores/auth.js'
import { createTestingPinia } from '@pinia/testing'
import { createWrapper, mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('OrganizationHeader', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()
  authStore.isAuthenticated = true
  authStore.currentFacility = { facilityName: 'UT Facility' }
  authStore.userInfo = {
    organizationName: 'UT Org',
  }
  test('init', async () => {
    const wrapper = mount(OrganizationHeader, global)
    expect(wrapper.text()).toContain('UT Org')
    expect(wrapper.text()).toContain('UT Facility')
    expect(wrapper.html()).toMatchSnapshot()
  })

  test('change facility', async () => {
    const wrapper = mount(OrganizationHeader, global)

    const changeFacilityButton = wrapper.get('#changeFacility')

    changeFacilityButton.trigger('click')
    // TODO (weskubo-cgi) Menu is rendered outside of the component
    //const menu = createWrapper(document.body).find('.v-menu__content')
    //console.log(menu)
    //expect(wrapper.find('.v-menu').isVisible()).toBe(false)
  })
})
