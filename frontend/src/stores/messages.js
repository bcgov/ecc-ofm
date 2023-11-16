import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', {
  namespaced: true,
  state: () => ({
    assistanceRequests: null,
    assistanceRequestMessages: null,
  }),
  getters: {
    unreadMessageCount: (state) => (state.assistanceRequests ? state.assistanceRequests.filter((message) => !message.lastOpenedTime).length : 0),
  },
  actions: {
    async createNewAssistanceRequest(payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.MESSAGE + '/newAssistanceRequest', payload)
        return response?.data
      } catch (error) {
        console.log(`Failed to create a new Assistance Request - ${error}`)
        throw error
      }
    },
    async getAssistanceRequests(contactId) {
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/' + contactId)
        this.assistanceRequests = response.data
      } catch (error) {
        console.log(`Failed to get the list of assistance requests - ${error}`)
        throw error
      }
    },
    async updateAssistanceRequest(assistanceRequestId, payload) {
      try {
        await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + assistanceRequestId, payload)
      } catch (error) {
        console.log(`Failed to update existing assistance request - ${error}`)
        throw error
      }
    },
    async getAssistanceRequestMessages(assistanceRequestId) {
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/conversations' + '/' + assistanceRequestId)
        this.assistanceRequestMessages = response.data
      } catch (error) {
        console.log(`Failed to get the list of assistance request messages - ${error}`)
        throw error
      }
    },
    async replyToAssistanceRequest(payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.MESSAGE + '/replyToAssistanceRequest', payload)
        return response?.data
      } catch (error) {
        console.log(`Failed to create a reply for the Assistance Request - ${error}`)
        throw error
      }
    },
  },
})
