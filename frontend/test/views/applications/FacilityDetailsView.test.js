import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import FacilityDetailsView from '@/views/applications/FacilityDetailsView.vue'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'

import { getLookupInfoResponse } from '../../utils/mockResponses/app'
import { getApplicationResponse } from '../../utils/mockResponses/applications'
import { getContactsResponse, getFacilityResponse } from '../../utils/mockResponses/facilities'

const vuetify = createVuetify({ components, directives })

describe('Application - Facility Details View', () => {
  const global = {
    global: {
      plugins: [createTestingPinia(), vuetify],
      mocks: {
        $route: {
          params: {
            path: '/applications/b2b7f374-2995-ee11-be37-000d3a09d4d4/facility-details',
          },
        },
      },
    },
  }

  const appStore = useAppStore()
  appStore.userRoles = getLookupInfoResponse.userRoles

  const applicationsStore = useApplicationsStore()
  applicationsStore.currentApplication = getApplicationResponse

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('Verify page labels', async () => {
    const wrapper = mount(FacilityDetailsView, global)
    await flushPromises()
    expect(wrapper.text()).toContain('Your facility')
    expect(wrapper.text()).toContain('Facility Information')
    expect(wrapper.text()).toContain('Primary Contact')
    expect(wrapper.text()).toContain('Secondary Contact (Recommended)')
    expect(wrapper.text()).toContain('Select contact who to contact about your application')
    expect(wrapper.text()).toContain('Select contact')
  })

  test('Verify Facility Information details', async () => {
    const wrapper = mount(FacilityDetailsView, global)
    await flushPromises()
    expect(wrapper.text()).toContain(getFacilityResponse.name)
    expect(wrapper.text()).toContain(getFacilityResponse.phoneLandline)
    expect(wrapper.text()).toContain(getFacilityResponse.phoneCell)
    expect(wrapper.text()).toContain(getFacilityResponse.email)
    expect(wrapper.text()).toContain(getFacilityResponse.streetAddress1)
    expect(wrapper.text()).toContain(getFacilityResponse.streetAddress2)
    expect(wrapper.text()).toContain(getFacilityResponse.city)
    expect(wrapper.text()).toContain(getFacilityResponse.postalCode)
    expect(wrapper.text()).toContain(getFacilityResponse.province)
    expect(wrapper.text()).toContain(getFacilityResponse.mailingStreetAddress1)
    expect(wrapper.text()).toContain(getFacilityResponse.mailingStreetAddress2)
    expect(wrapper.text()).toContain(getFacilityResponse.mailingCity)
    expect(wrapper.text()).toContain(getFacilityResponse.mailingPostalCode)
    expect(wrapper.text()).toContain(getFacilityResponse.mailingProvince)
  })

  test('Verify selected Primary Contact in dropdown list', async () => {
    const wrapper = mount(FacilityDetailsView, global)
    await flushPromises()
    const primaryContact = getContactsResponse.find((contact) => getApplicationResponse.primaryContactId === contact.contactId)
    const primaryContactFullName = `${primaryContact.firstName} ${primaryContact.lastName}`
    expect(wrapper.get('#primary-contact').wrapperElement._value).toEqual(primaryContactFullName)
  })

  test('Verify Primary Contact Information details', async () => {
    const wrapper = mount(FacilityDetailsView, global)
    await flushPromises()
    const primaryContact = getContactsResponse.find((contact) => getApplicationResponse.primaryContactId === contact.contactId)
    const roleName = appStore.getRoleNameById(primaryContact?.role)
    expect(wrapper.text()).toContain(primaryContact?.firstName)
    expect(wrapper.text()).toContain(primaryContact?.lastName)
    expect(wrapper.text()).toContain(primaryContact?.email)
    expect(wrapper.text()).toContain(primaryContact?.phone)
    expect(wrapper.text()).toContain(primaryContact?.userName)
    expect(wrapper.text()).toContain(roleName)
  })

  test('Verify selected Secondary Contact in dropdown list', async () => {
    const wrapper = mount(FacilityDetailsView, global)
    await flushPromises()
    const secondaryContact = getContactsResponse.find((contact) => getApplicationResponse.secondaryContactId === contact.contactId)
    const secondaryContactFullName = `${secondaryContact?.firstName} ${secondaryContact?.lastName}`
    expect(wrapper.get('#secondary-contact').wrapperElement._value).toEqual(secondaryContactFullName)
  })

  test('Verify Secondary Contact Information details', async () => {
    const wrapper = mount(FacilityDetailsView, global)
    await flushPromises()
    const secondaryContact = getContactsResponse.find((contact) => getApplicationResponse.secondaryContactId === contact.contactId)
    const roleName = appStore.getRoleNameById(secondaryContact?.role)
    expect(wrapper.text()).toContain(secondaryContact?.firstName)
    expect(wrapper.text()).toContain(secondaryContact?.lastName)
    expect(wrapper.text()).toContain(secondaryContact?.email)
    expect(wrapper.text()).toContain(secondaryContact?.phone)
    expect(wrapper.text()).toContain(secondaryContact?.userName)
    expect(wrapper.text()).toContain(roleName)
  })
})
