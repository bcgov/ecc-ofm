import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { describe, test } from 'vitest'

import MessagingView from '@/views/MessagingView.vue'
import { createTestingPinia } from '@pinia/testing'
import { createVuetify } from 'vuetify'
import { mount } from '@vue/test-utils'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'

const vuetify = createVuetify({ components, directives })

describe('MessagingView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const messagesStore = useMessagesStore()
  const notificationsStore = useNotificationsStore()

  messagesStore.assistanceRequests = [
    {
      assistanceRequestId: '1',
      categoryName: 'Funding Agreement',
      contactMethod: 2,
      description: 'Test #1',
      lastOpenedTime: null,
      lastConversationTime: '2023-11-16T06:15:13Z',
      isRead: false,
      phone: '1111111111',
      referenceNumber: 'REQ-000001',
      requestFacilities: Array[0],
      stateCode: 0,
      status: 'Open',
      statusCode: 2,
      subject: 'Test #1 - Funding Agreement',
    },
    {
      assistanceRequestId: '2',
      categoryName: 'Intake & Renewal',
      contactMethod: 1,
      description: 'Test #2',
      lastOpenedTime: null,
      lastConversationTime: '2023-11-14T06:15:13Z',
      isRead: false,
      phone: null,
      referenceNumber: 'REQ-000002',
      requestFacilities: Array[0],
      stateCode: 0,
      status: 'Open',
      statusCode: 2,
      subject: 'Test #2 - Funding Agreement',
    },
  ]

  notificationsStore.notifications = []

  test('Count of unread messages in the Messages tab ', async () => {
    const wrapper = mount(MessagingView, global)

    const messagesBadge = wrapper.get('#messages-tab-badge')
    expect(messagesBadge.attributes().content).toEqual('2')
  })
})
