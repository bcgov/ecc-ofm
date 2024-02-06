import moment from 'moment'
import { describe, expect, test } from 'vitest'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'
import MessagingView from '@/views/MessagingView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'

import { getAssistanceRequestConversation, getAssistanceRequestsResponse } from '../utils/mockResponses/messages'
import { getNotificationsResponse } from '../utils/mockResponses/notifications'

const vuetify = createVuetify({ components, directives })

describe('Notifications Tab', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const notificationsStore = useNotificationsStore()

  notificationsStore.notifications = getNotificationsResponse

  test('Count of unread notifications in the Notifications tab ', async () => {
    const wrapper = mount(MessagingView, global)
    const actualUnreadNotificationsCount = wrapper.get('#unread-notifications-count')?.text()
    const expectedUnreadNotificationsCount = notificationsStore.notifications.filter((notification) => !notification.isRead)?.length
    expect(actualUnreadNotificationsCount).toEqual(`(${expectedUnreadNotificationsCount})`)
  })

  test('Open the Notifications tab, then verify Notifications table', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#notifications-tab').trigger('click')
    const notificationsTab = wrapper.text()
    expect(notificationsTab).toContain('Mark unread')
    expect(notificationsTab).toContain('Mark read')
    expect(notificationsTab).toContain('Back to Home')
    getNotificationsResponse.forEach((notification) => {
      expect(notificationsTab).toContain(notification.subject)
      expect(notificationsTab).toContain(moment(notification.dateReceived).format('YYYY-MMM-DD'))
    })
  })

  test('Open a notification to read details', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#notifications-tab').trigger('click')
    await wrapper.get('.v-data-table__tr').trigger('click')
    const notificationDetails = wrapper.get('#notification-details')?.text()
    expect(notificationDetails).toContain('This is a demo email #1')
  })
})

describe('Messages Tab', () => {
  const global = { global: { plugins: [createTestingPinia(), vuetify] } }
  const messagesStore = useMessagesStore()
  messagesStore.assistanceRequests = getAssistanceRequestsResponse
  messagesStore.assistanceRequestConversation = getAssistanceRequestConversation

  test('Count of unread messages in the Messages tab ', async () => {
    const wrapper = mount(MessagingView, global)
    const actualUnreadMessagesCount = wrapper.get('#unread-messages-count')?.text()
    const expectedUnreadMessagesCount = messagesStore.assistanceRequests.filter((message) => !message.isRead)?.length
    expect(actualUnreadMessagesCount).toEqual(`(${expectedUnreadMessagesCount})`)
  })

  test('Open the Messages tab, then verify Messages/Assistance Requests table', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#messages-tab').trigger('click')
    const messagesTab = wrapper.text()
    expect(messagesTab).toContain('New message')
    expect(messagesTab).toContain('Mark unread')
    expect(messagesTab).toContain('Mark read')
    expect(messagesTab).toContain('Back to Home')
    getAssistanceRequestsResponse.forEach((message) => {
      expect(messagesTab).toContain(message.status)
      expect(messagesTab).toContain(message.subject)
      expect(messagesTab).toContain(message.categoryName)
      expect(messagesTab).toContain(message.categoryName)
      expect(messagesTab).toContain(moment(message.lastConversationTime).format('YYYY-MMM-DD'))
    })
  })

  test('Open a message to read conversations', async () => {
    const wrapper = mount(MessagingView, global)
    await wrapper.get('#messages-tab').trigger('click')
    await wrapper.get('.v-data-table__tr').trigger('click')
    const conversation = wrapper.get('#request-conversations')?.text()
    expect(conversation).toContain('This is 1st message from Portal')
  })
})
