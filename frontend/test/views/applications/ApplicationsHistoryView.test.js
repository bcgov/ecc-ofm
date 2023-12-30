import axios from 'axios'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useRouter } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth'
import ApplicationsHistoryView from '@/views/applications/ApplicationsHistoryView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })
vi.mock('axios')

describe('ApplicationsHistoryView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const authStore = useAuthStore()

  // useRouter.mockReturnValue({
  //   push: vi.fn(),
  // })

  // beforeEach(() => {
  //   useRouter().push.mockReset()
  // })

  /*
  ===============================================
    Data Setup
  ===============================================
  */
  authStore.userInfo = {
    facilities: [
      {
        facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
        facilityAccountNumber: 'Test-Facility-1',
        facilityName: 'Test OFM Facility #1',
        facilityType: 0,
        facilityStateCode: 0,
        facilityStatusCode: 1,
      },
      {
        facilityId: '6df8623a-447d-ee11-8179-000d3a09d499',
        facilityAccountNumber: 'Test-Facility-2',
        facilityName: 'Test OFM Facility #2',
        facilityType: 0,
        facilityStateCode: 0,
        facilityStatusCode: 1,
      },
    ],
  }

  const mockApplications = [
    {
      applicationId: '128b9ba9-be9e-ee11-a569-000d3a09d132',
      referenceNumber: 'APP-23000066',
      submittedDate: null,
      ministryLastUpdated: '2023-12-22T20:40:48Z',
      providerLastUpdated: '2023-12-22T20:35:45Z',
      facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
      facilityName: 'Test OFM Facility #1',
      statusCode: 1,
      stateCode: 0,
      status: 'Draft',
      latestActivity: '2023-12-22T20:40:48.000Z',
    },
    {
      applicationId: 'c8609cc5-0fa1-ee11-a569-000d3a09d499',
      referenceNumber: 'APP-23000070',
      submittedDate: null,
      ministryLastUpdated: null,
      providerLastUpdated: '2023-12-22T21:19:21Z',
      facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
      facilityName: 'Test OFM Facility #1',
      statusCode: 1,
      stateCode: 0,
      status: 'Draft',
      latestActivity: '2023-12-22T21:19:21.000Z',
    },
    {
      applicationId: 'b2b7f374-2995-ee11-be37-000d3a09d4d4',
      referenceNumber: 'APP-23000031',
      submittedDate: '2023-12-19T18:07:38Z',
      ministryLastUpdated: '2023-12-19T18:07:38Z',
      providerLastUpdated: null,
      facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
      facilityName: 'Test OFM Facility #1',
      statusCode: 3,
      stateCode: 0,
      status: 'Submitted',
      latestActivity: '2023-12-19T18:07:38.000Z',
    },
  ]

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('getApplications() requests are called', async () => {
    const wrapper = mount(ApplicationsHistoryView, global)
    console.log(wrapper.text())
    axios.get.mockResolvedValue({
      data: mockApplications,
    })

    // expect(axios.get).toHaveBeenCalledTimes(2)
    // expect(axios.get).toHaveBeenCalledWith('/api/get')
  })
})
