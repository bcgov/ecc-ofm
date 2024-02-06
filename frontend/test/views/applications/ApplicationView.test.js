import { describe, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useAuthStore } from '@/stores/auth'
import ApplicationView from '@/views/applications/ApplicationView.vue'
import { createTestingPinia } from '@pinia/testing'
import { flushPromises, mount } from '@vue/test-utils'

import { getUserInfoResponse } from '../../utils/mockResponses/auth'

const vuetify = createVuetify({ components, directives })

describe('Application View', () => {
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
  const authStore = useAuthStore()
  authStore.userInfo = getUserInfoResponse

  /*
  ===============================================
    TESTS
  ===============================================
  */
  test('TO-DO', async () => {
    const wrapper = mount(ApplicationView, global)
    await flushPromises()
    console.log(wrapper.text())
  })
  // TO-DO
  // Vue Router (Navigation Bar): https://test-utils.vuejs.org/guide/advanced/vue-router.html
})
