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
          let response = await ApiService.apiAxios.get(ApiRoutes.NOTICE + '/contact/' + contactId)
          this.notifications = response.data
        } catch (error) {
          console.log(`Failed to get notifications - ${error}`)
          throw error
        }
      } else {
        this.messages = []
      }
    },
    async updateNotification(notificationId, isRead) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to update Notification data because you are not logged in')
        throw 'unable to update Notification data because you are not logged in'
      }
      if (notificationId) {
        try {
          let updatedNotification = {
            notificationId: notificationId,
            isRead: isRead,
          }
          this.updateNotificationInMemory(updatedNotification)
          const payload = {
            lastopenedtime: isRead ? new Date().toISOString() : null,
          }
          await ApiService.apiAxios.put(ApiRoutes.NOTICE + '/' + notificationId, payload)
        } catch (error) {
          console.log(`Failed to update existing Message - ${error}`)
          throw error
        }
      }
    },
    updateNotificationInMemory(updatedNotification) {
      try {
        if (this.notifications) {
          this.notifications.forEach((notification) => {
            if (notification.notificationId === updatedNotification.notificationId) notification.isRead = updatedNotification.isRead
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})
