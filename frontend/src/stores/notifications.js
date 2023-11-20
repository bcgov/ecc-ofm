import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  namespaced: true,
  state: () => ({
    notifications: [],
  }),
  getters: {
    unreadNotificationCount: (state) => (state.notifications ? state.notifications.filter((notification) => !notification.isRead).length : 0),
  },
  actions: {
    async getNotifications(contactId) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to get Messages data because you are not logged in')
        throw 'unable to get Messages data because you are not logged in'
      }
      if (contactId) {
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.NOTIFICATIONS + '/contact/' + contactId)
          this.notifications = response.data
        } catch (error) {
          console.log(`Failed to get notifications - ${error}`)
          throw error
        }
      } else {
        this.messages = []
      }
    },
    async updateNotification(notification) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to update Notification data because you are not logged in')
        throw 'unable to update Notification data because you are not logged in'
      }
      if (notification.notificationId) {
        try {
          const payload = {
            lastopenedtime: notification.isRead ? new Date().toISOString() : null,
          }
          await ApiService.apiAxios.put(ApiRoutes.NOTIFICATIONS + '/' + notification.notificationId, payload)
        } catch (error) {
          console.log(`Failed to update existing Notice - ${error}`)
          throw error
        }
      }
    },
  },
})
