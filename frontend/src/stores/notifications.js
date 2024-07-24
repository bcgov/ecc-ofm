import { isEmpty, orderBy } from 'lodash'

import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  namespaced: true,
  state: () => ({
    notifications: null,
  }),
  getters: {
    unreadNotificationCount: (state) => (state.notifications ? state.notifications.filter((notification) => !notification.isRead).length : 0),
  },
  actions: {
    async getNotifications(contactId) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to get Notifications data because you are not logged in')
        throw 'unable to get Notifications data because you are not logged in'
      }
      if (contactId) {
        try {
          // TODO Make this a service function
          const response = await ApiService.apiAxios.get(ApiRoutes.NOTIFICATIONS + '/contact/' + contactId)
          this.notifications = orderBy(response.data, 'dateReceived', 'desc')
        } catch (error) {
          console.log(`Failed to get notifications - ${error}`)
          throw error
        }
      } else {
        this.notifications = []
      }
    },
    async updateNotification(notificationId, payload) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to update Notification data because you are not logged in')
        throw 'unable to update Notification data because you are not logged in'
      }
      if (notificationId && !isEmpty(payload)) {
        try {
          // TODO Make this a service function
          await ApiService.apiAxios.put(ApiRoutes.NOTIFICATIONS + '/' + notificationId, payload)
        } catch (error) {
          console.log(`Failed to update existing Notice - ${error}`)
          throw error
        }
      }
    },
  },
})
