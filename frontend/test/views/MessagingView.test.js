import { beforeEach, describe, expect, test, vi } from 'vitest'
import { useRouter } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'
import MessagingView from '@/views/MessagingView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

const vuetify = createVuetify({ components, directives })
vi.mock('vue-router')

describe('MessagingView', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const messagesStore = useMessagesStore()
  const notificationsStore = useNotificationsStore()
  useRouter.mockReturnValue({
    push: vi.fn(),
  })

  beforeEach(() => {
    useRouter().push.mockReset()
  })

  /*
  ===============================================
    Data Setup
  ===============================================
  */
  messagesStore.assistanceRequests = [
    {
      assistanceRequestId: '2c1c29c7-c984-ee11-8179-000d3a09d4d4',
      subject: 'Test Message #1',
      referenceNumber: 'REQ-23000076',
      statusCode: 6,
      stateCode: 1,
      categoryName: 'Reporting',
      lastUpdatedTime: '2023-12-13T18:17:33Z',
      isRead: false,
      status: 'Open',
      priority: 1,
      requestFacilities: [
        {
          facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
          facilityName: 'Viet OFM Active Facility Number 1',
        },
      ],
      lastConversationTime: '2023-11-16T21:47:56Z',
    },
    {
      assistanceRequestId: 'c54ff934-9a93-ee11-be37-000d3a09d4d4',
      subject: 'Test Message #2',
      referenceNumber: 'REQ-23000272',
      statusCode: 2,
      stateCode: 0,
      categoryName: 'Account Maintenance',
      lastUpdatedTime: '2023-12-12T21:32:29Z',
      isRead: false,
      status: 'Open',
      priority: 2,
      requestFacilities: [
        {
          facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
          facilityName: 'Viet OFM Active Facility Number 1',
        },
      ],
      lastConversationTime: '2023-12-05T18:17:41Z',
    },
    {
      assistanceRequestId: 'af0c869f-5f95-ee11-be37-000d3a09d699',
      subject: 'Test Message #3',
      referenceNumber: 'REQ-23000277',
      statusCode: 3,
      stateCode: 0,
      categoryName: 'Reporting',
      lastUpdatedTime: '2023-12-13T18:15:53Z',
      isRead: true,
      status: 'Action required',
      priority: 3,
      requestFacilities: [
        {
          facilityId: 'c9ecef6c-437d-ee11-8179-000d3a09d132',
          facilityName: 'Viet OFM Active Facility Number 1',
        },
      ],
      lastConversationTime: '2023-12-12T20:47:51Z',
    },
    {
      assistanceRequestId: '2d2ca51e-9a88-ee11-8179-000d3af4865d',
      subject: 'Test Message #4',
      referenceNumber: 'REQ-23000116',
      statusCode: 5,
      stateCode: 1,
      categoryName: 'Intake & Renewal',
      lastUpdatedTime: '2023-12-13T18:17:33Z',
      isRead: true,
      status: 'Closed',
      priority: 1,
      requestFacilities: [
        {
          facilityId: '064effc8-437d-ee11-8179-000d3a09d132',
          facilityName: 'Viet OFM This is Active Facility #2',
        },
      ],
      lastConversationTime: '2023-11-21T18:17:14Z',
    },
  ]

  messagesStore.assistanceRequestConversation = [
    {
      conversationId: '3cc21980-4784-ee11-8179-000d3af4865d',
      subject: 'MSG-23000051',
      from: 'd8ea4465-1777-ed11-81ac-000d3af4fa76',
      sentDate: '2023-11-16T06:15:13Z',
      message: 'Final 3rd message from CRM',
      ofmSourceSystem: false,
      requestValue: 'f9293b70-1584-ee11-8179-000d3a09d699',
      statusCode: 1,
    },
    {
      conversationId: '29626e3e-4784-ee11-8179-000d3af4865d',
      subject: 'MSG-23000050',
      from: 'd8ea4465-1777-ed11-81ac-000d3af4fa76',
      sentDate: '2023-11-16T06:13:27Z',
      message: 'This is 2nd message from CRM',
      ofmSourceSystem: false,
      requestValue: 'f9293b70-1584-ee11-8179-000d3a09d699',
      statusCode: 1,
    },
    {
      conversationId: 'f0e7fe8c-1b84-ee11-8179-000d3af4865d',
      subject: 'MSG-23000041',
      from: 'd8ea4465-1777-ed11-81ac-000d3af4fa76',
      sentDate: '2023-11-16T01:00:42Z',
      message: 'This is 1st message from Portal',
      ofmSourceSystem: false,
      requestValue: 'f9293b70-1584-ee11-8179-000d3a09d699',
      statusCode: 1,
    },
  ]

  notificationsStore.notifications = [
    {
      notificationId: 'ef908c0e-8c94-ee11-be37-000d3a09d699',
      subject: 'Test notification #1',
      dateReceived: '2023-12-06T23:06:20Z',
      notificationContent: '<div data-wrapper="true" dir="ltr" style="font-size:9pt;font-family:\'Segoe UI\',\'Helvetica Neue\',sans-serif;"><div>This is a demo email #1</div></div>',
      lastOpenedTime: '2023-12-13T18:14:50Z',
      isRead: false,
    },
    {
      notificationId: 'd108df71-8c94-ee11-be37-000d3a09d699',
      subject: 'Test notification #2',
      dateReceived: '2023-12-06T23:09:03Z',
      notificationContent:
        '<div data-wrapper="true" dir="ltr" style="font-family:\'Segoe UI\',\'Helvetica Neue\',sans-serif; font-size:9pt"><div>This is another demo email #2</div>\n<div>Updating the notes</div></div>',
      lastOpenedTime: '2023-12-13T18:14:49Z',
      isRead: false,
    },
    {
      notificationId: 'f333cd71-8c94-ee11-be37-000d3a09d999',
      subject: 'Test notification #3',
      dateReceived: '2023-12-07T23:09:03Z',
      notificationContent:
        '<div data-wrapper="true" dir="ltr" style="font-family:\'Segoe UI\',\'Helvetica Neue\',sans-serif; font-size:9pt"><div>This is another demo email #3</div>\n<div>Updating the notes</div></div>',
      lastOpenedTime: '2023-12-13T18:14:49Z',
      isRead: true,
    },
    {
      notificationId: 'd108df71-8c94-ee11-be37-333f1b02d222',
      subject: 'Test notification #4',
      dateReceived: '2023-12-09T23:09:03Z',
      notificationContent:
        '<div data-wrapper="true" dir="ltr" style="font-family:\'Segoe UI\',\'Helvetica Neue\',sans-serif; font-size:9pt"><div>This is another demo email</div>\n<div>Updating the notes</div></div>',
      lastOpenedTime: '2023-12-13T18:14:49Z',
      isRead: false,
    },
  ]

  /*
  ===============================================
    Notifications Tab
  ===============================================
  */
  test('Count of unread notifications in the Notifications tab ', async () => {
    const wrapper = mount(MessagingView, global)
    const actualUnreadNotificationsCount = wrapper.get('#unread-notifications-count')?.text()
    const expectedUnreadNotificationsCount = notificationsStore.notifications.filter((notification) => !notification.isRead)?.length
    expect(actualUnreadNotificationsCount).toEqual(`(${expectedUnreadNotificationsCount})`)
  })

  test('Open the Notifications tab', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#notifications-tab').trigger('click')
    const notificationsTab = wrapper.text()
    expect(notificationsTab).toContain('Mark unread')
    expect(notificationsTab).toContain('Mark read')
    expect(notificationsTab).toContain('Test notification #1')
    expect(notificationsTab).toContain('2023-Dec-06')
  })

  test('Open a notification', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#notifications-tab').trigger('click')
    await wrapper.get('.v-data-table__tr').trigger('click')
    const notificationDetails = wrapper.get('#notification-details')?.text()
    expect(notificationDetails).toContain('This is a demo email #1')
  })

  /* 
  ===============================================
    Messages Tab
  ===============================================
  */
  test('Count of unread messages in the Messages tab ', async () => {
    const wrapper = mount(MessagingView, global)
    const actualUnreadMessagesCount = wrapper.get('#unread-messages-count')?.text()
    const expectedUnreadMessagesCount = messagesStore.assistanceRequests.filter((message) => !message.isRead)?.length
    expect(actualUnreadMessagesCount).toEqual(`(${expectedUnreadMessagesCount})`)
  })

  test('Open the Messages tab', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#messages-tab').trigger('click')
    const messagesTab = wrapper.text()
    expect(messagesTab).toContain('New message')
    expect(messagesTab).toContain('Mark unread')
    expect(messagesTab).toContain('Mark read')
    expect(messagesTab).toContain('Test Message #1')
    expect(messagesTab).toContain('Action required')
  })

  test('Open a message', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#messages-tab').trigger('click')
    await wrapper.get('.v-data-table__tr').trigger('click')
    const conversation = wrapper.get('#request-conversations')?.text()
    expect(conversation).toContain('This is 1st message from Portal')
  })
})
