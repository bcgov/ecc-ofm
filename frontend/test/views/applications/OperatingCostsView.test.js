import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import OperatingCostsView from '@/views/applications/OperatingCostsView.vue'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'

import { getLookupInfoResponse } from '../../utils/mockResponses/app'
import { getApplicationResponse } from '../../utils/mockResponses/applications'

const vuetify = createVuetify({ components, directives })

describe('Application - Operating Costs View', () => {
  const global = {
    global: {
      plugins: [createTestingPinia(), vuetify],
      mocks: {
        $route: {
          params: {
            path: '/applications/b2b7f374-2995-ee11-be37-000d3a09d4d4/operating-costs',
          },
        },
      },
    },
  }

  const appStore = useAppStore()
  appStore.facilityTypes = getLookupInfoResponse.facilityTypes

  const applicationsStore = useApplicationsStore()
  applicationsStore.currentApplication = getApplicationResponse

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('Verify page labels', async () => {
    const wrapper = mount(OperatingCostsView, global)
    await flushPromises()
    expect(wrapper.text()).toContain('Please provide operating costs for the selected facility')
    expect(wrapper.text()).toContain('Facility Type')
    expect(wrapper.text()).toContain('Yearly Operating Cost')
    expect(wrapper.text()).toContain('Yearly Facility Cost')
  })

  test('Verify uploaded documents when facility type is Rent/Lease', async () => {
    const wrapper = mount(OperatingCostsView, global)
    await flushPromises()
    // console.log(wrapper.text())
    // TO-DO
    expect(wrapper.text()).toContain('Supporting Documents')
  })

  // TO-DO
  // Check Operating costs
  // Check page label when Facility Type is Rent/Lease or others
  // Check Uploaded Documents when Facility Type is Rent/Lease or others
  // Check if form is readonly when status != DRAFT
})
