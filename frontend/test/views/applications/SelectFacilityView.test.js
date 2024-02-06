import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth'
import SelectFacilityView from '@/views/applications/SelectFacilityView.vue'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'

import { getUserInfoResponse } from '../../utils/mockResponses/auth'
import { getOrganizationResponse } from '../../utils/mockResponses/organizations'

const vuetify = createVuetify({ components, directives })

describe('Application - Select Facility View', () => {
  const global = {
    global: {
      plugins: [createTestingPinia(), vuetify],
    },
  }

  const authStore = useAuthStore()
  authStore.userInfo = getUserInfoResponse

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('Verify page labels', async () => {
    const wrapper = mount(SelectFacilityView, global)
    await flushPromises()
    expect(wrapper.text()).toContain('Begin an Operating Funding Model application')
    expect(wrapper.text()).toContain('Organization information')
    expect(wrapper.text()).toContain("Please review the following pre-populated information for correctness and contact your organization's account manager to make updates if required.")
    expect(wrapper.text()).toContain('I confirm that Organization information is correct.')
    expect(wrapper.text()).toContain('To start your application, select a facility')
    expect(wrapper.text()).toContain('If your facility is not listed, contact your Account Manager.')
    expect(wrapper.text()).toContain('Select your facility:')
  })

  test('Verify Organization Information details', async () => {
    const wrapper = mount(SelectFacilityView, global)
    await flushPromises()
    expect(wrapper.text()).toContain(getOrganizationResponse.name)
    expect(wrapper.text()).toContain(getOrganizationResponse.businessType)
    expect(wrapper.text()).toContain(getOrganizationResponse.email)
    expect(wrapper.text()).toContain(getOrganizationResponse.phoneCell)
    expect(wrapper.text()).toContain(getOrganizationResponse.phoneLandline)
    expect(wrapper.text()).toContain(getOrganizationResponse.streetAddress1)
    expect(wrapper.text()).toContain(getOrganizationResponse.streetAddress2)
    expect(wrapper.text()).toContain(getOrganizationResponse.city)
    expect(wrapper.text()).toContain(getOrganizationResponse.postalCode)
    expect(wrapper.text()).toContain(getOrganizationResponse.province)
    expect(wrapper.text()).toContain(getOrganizationResponse.mailingStreetAddress1)
    expect(wrapper.text()).toContain(getOrganizationResponse.mailingStreetAddress2)
    expect(wrapper.text()).toContain(getOrganizationResponse.mailingCity)
    expect(wrapper.text()).toContain(getOrganizationResponse.mailingPostalCode)
    expect(wrapper.text()).toContain(getOrganizationResponse.mailingProvince)
    expect(wrapper.text()).toContain(getOrganizationResponse.mailingStreetAddress2)
  })

  // TO-DO
  // Select facility from dropdown list
  // Check if form is readonly when status != DRAFT
})
