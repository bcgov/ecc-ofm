import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getNotificationsByContactId(contactId) {
    try {
      if (!contactId) return null
      const response = await ApiService.apiAxios.get(`${ApiRoutes.NOTIFICATIONS}?contactId=${contactId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get notifications - ${error}`)
      throw error
    }
  },

  async updateNotification(notificationId, payload) {
    try {
      if (!notificationId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.NOTIFICATIONS}/${notificationId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update existing Notification - ${error}`)
      throw error
    }
  },
}
