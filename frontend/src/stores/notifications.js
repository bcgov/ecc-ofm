import { orderBy } from 'lodash'
import { defineStore } from 'pinia'

import NotificationService from '@/services/notificationService'

export const useNotificationsStore = defineStore('notifications', {
  namespaced: true,
  state: () => ({
    notifications: null
  }),
  getters: {
    unreadNotificationCount: (state) =>
      state.notifications ? state.notifications.filter((notification) => !notification.isRead).length : 0
  },
  actions: {
    async getNotifications(contactId) {
      try {
        const notifications = await NotificationService.getNotificationsByContactId(contactId)
        this.notifications = orderBy(notifications, 'dateReceived', 'desc')
      } catch (error) {
        console.log(`Failed to get notifications - ${error}`)
        throw error
      }
    }
  }
})
