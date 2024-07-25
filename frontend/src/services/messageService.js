import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async createAssistanceRequest(payload) {
    try {
      if (isEmpty(payload)) return
      const response = await ApiService.apiAxios.post(`${ApiRoutes.MESSAGES}/`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create a new Assistance Request - ${error}`)
      throw error
    }
  },

  async getAssistanceRequestsByContactId(contactId) {
    try {
      if (!contactId) return null
      const response = await ApiService.apiAxios.get(`${ApiRoutes.MESSAGES}?contactId=${contactId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of assistance requests - ${error}`)
      throw error
    }
  },

  async getAssistanceRequest(assistanceRequestId) {
    try {
      if (!assistanceRequestId) return null
      const response = await ApiService.apiAxios.get(`${ApiRoutes.MESSAGES}/${assistanceRequestId}`)
      return response.data
    } catch (error) {
      console.log(`Failed to get the details of an assistance request - ${error}`)
      throw error
    }
  },

  async updateAssistanceRequest(assistanceRequestId, payload) {
    try {
      if (!assistanceRequestId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.MESSAGES}/${assistanceRequestId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update existing assistance request - ${error}`)
      throw error
    }
  },

  async getAssistanceRequestConversation(assistanceRequestId) {
    try {
      if (!assistanceRequestId) return null
      const response = await ApiService.apiAxios.get(`${ApiRoutes.MESSAGES}/conversations/${assistanceRequestId}`)
      return response.data
    } catch (error) {
      console.log(`Failed to get the list of assistance request messages - ${error}`)
      throw error
    }
  },

  async createAssistanceRequestConversation(payload) {
    try {
      const response = await ApiService.apiAxios.post(`${ApiRoutes.MESSAGES}/conversations/`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create Assistance Request's conversations - ${error}`)
      throw error
    }
  },
}
