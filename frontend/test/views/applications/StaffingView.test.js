import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useApplicationsStore } from '@/stores/applications'
import StaffingView from '@/views/applications/StaffingView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

import { getApplicationResponse } from '../../utils/mockResponses/applications'

const vuetify = createVuetify({ components, directives })

describe('Application - Staffing View', () => {
  const global = {
    global: {
      plugins: [createTestingPinia(), vuetify],
    },
  }
  const applicationsStore = useApplicationsStore()
  applicationsStore.currentApplication = getApplicationResponse

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('Verify page labels', async () => {
    const wrapper = mount(StaffingView, global)
    expect(wrapper.text()).toContain('Employee Category')
    expect(wrapper.text()).toContain('Full-Time Position')
    expect(wrapper.text()).toContain('Part-Time Position')
    expect(wrapper.text()).toContain('Infant/Toddler Early Childhood Educator')
    expect(wrapper.text()).toContain('Early Childhood Educator')
    expect(wrapper.text()).toContain('Early Childhood Educator Assistant')
    expect(wrapper.text()).toContain('Responsible Adult')
    expect(wrapper.text()).toContain('Total')
  })

  test('Verify total staff calculation', async () => {
    const wrapper = mount(StaffingView, global)
    const totalFullTimePosition =
      getApplicationResponse?.staffingInfantECEducatorFullTime +
      getApplicationResponse?.staffingECEducatorFullTime +
      getApplicationResponse?.staffingECEducatorAssistantFullTime +
      getApplicationResponse?.staffingResponsibleAdultFullTime
    const totalPartTimePosition =
      getApplicationResponse?.staffingInfantECEducatorPartTime +
      getApplicationResponse?.staffingECEducatorPartTime +
      getApplicationResponse?.staffingECEducatorAssistantPartTime +
      getApplicationResponse?.staffingResponsibleAdultPartTime
    expect(wrapper.text()).toContain(totalFullTimePosition)
    expect(wrapper.text()).toContain(totalPartTimePosition)
  })
})
