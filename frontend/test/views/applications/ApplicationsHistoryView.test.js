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
