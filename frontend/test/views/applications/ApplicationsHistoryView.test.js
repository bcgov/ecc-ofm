import moment from 'moment'
import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth'
import ApplicationsHistoryView from '@/views/applications/ApplicationsHistoryView.vue'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'

import { getApplicationsResponse } from '../../utils/mockResponses/applications'
import { getUserInfoResponse } from '../../utils/mockResponses/auth'

const vuetify = createVuetify({ components, directives })

describe('Applications History View', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify], stubs: ['router-link'] } }
  const authStore = useAuthStore()
  authStore.userInfo = getUserInfoResponse

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('Verify page labels', async () => {
    const wrapper = mount(ApplicationsHistoryView, global)
    await flushPromises()
    expect(wrapper.text()).toContain('Application ID')
    expect(wrapper.text()).toContain('Facility')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Actions')
    expect(wrapper.text()).toContain('Date submitted')
    expect(wrapper.text()).toContain('Latest activity')
    expect(wrapper.text()).toContain('Back to Home')
  })

  test('Verify applications history table after receiving GET applications response', async () => {
    const wrapper = mount(ApplicationsHistoryView, global)
    await flushPromises()
    getApplicationsResponse?.forEach((application) => {
      // const action = application?.status === 'Draft' ? 'Continue application' : 'View submission'
      const dateSubmitted = !application?.dateSubmitted ? '- - - -' : moment(application?.dateSubmitted).format('YYYY-MMM-DD')
      const latestActivity = !application?.latestActivity ? '- - - -' : moment(application?.latestActivity).format('YYYY-MMM-DD')
      expect(wrapper.text()).toContain(application.referenceNumber)
      expect(wrapper.text()).toContain(application.facilityName)
      expect(wrapper.text()).toContain(application.status)
      // expect(wrapper.text()).toContain(action)
      expect(wrapper.text()).toContain(dateSubmitted)
      expect(wrapper.text()).toContain(latestActivity)
    })
  })

  // TO-DO
  // Cancel Application button
  // Vue Router (Continue Application/View Submission/Back to Home): https://test-utils.vuejs.org/guide/advanced/vue-router.html
})
