import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import TheHeader from '@/components/TheHeader.vue'
import { useAuthStore } from '@/stores/auth.js'
import { useNotificationsStore } from '@/stores/notifications'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })

describe('TheHeader', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()
  authStore.isAuthenticated = true
  authStore.currentFacility = { facilityName: 'UT Facility' }
  authStore.userInfo = {
    userName: 'ofmqa01',
    organizationName: 'UT Org',
  }
  const notificationsStore = useNotificationsStore()
  // Add 2 unread messages
  notificationsStore.notifications.push({ isRead: false }, { isRead: false })
  test('init', async () => {
    const wrapper = mount(TheHeader, global)
    expect(wrapper.text()).toContain('ofmqa01')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.html()).toMatchSnapshot()
  })

  // test('change facility', async () => {
  //   const wrapper = mount(OrganizationHeader, global)

  //   const changeFacilityButton = wrapper.get('#changeFacility')

  //   changeFacilityButton.trigger('click')
  //   // TODO (weskubo-cgi) Menu is rendered outside of the component
  //   //const menu = createWrapper(document.body).find('.v-menu__content')
  //   //console.log(menu)
  //   //expect(wrapper.find('.v-menu').isVisible()).toBe(false)
  // })
})
