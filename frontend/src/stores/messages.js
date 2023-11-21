import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'

function sortAssistanceRequests(assistanceRequests) {
  assistanceRequests?.sort(function (req1, req2) {
    let priorityOrder = req2.priority - req1.priority
    var dateOrder = new Date(req2.lastConversationTime) - new Date(req1.lastConversationTime)
    return priorityOrder || dateOrder
  })
}

export const useMessagesStore = defineStore('messages', {
  namespaced: true,
  state: () => ({
    assistanceRequests: null,
    assistanceRequestConversation: null,
  }),
  getters: {
    unreadMessageCount: (state) => (state.assistanceRequests ? state.assistanceRequests.filter((message) => !message.isRead).length : 0),
  },
  actions: {
    async createAssistanceRequest(payload) {
      try {
        const response = await ApiService.apiAxios.post(ApiRoutes.MESSAGES + '/newAssistanceRequest', payload)
        return response?.data
      } catch (error) {
        console.log(`Failed to create a new Assistance Request - ${error}`)
        throw error
      }
    },
    async getAssistanceRequests(contactId) {
      try {
        const response = await ApiService.apiAxios.get(ApiRoutes.MESSAGES + '/' + contactId)
        this.assistanceRequests = response.data
        sortAssistanceRequests(this.assistanceRequests)
      } catch (error) {
        console.log(`Failed to get the list of assistance requests - ${error}`)
        throw error
      }
    },
    async getAssistanceRequest(assistanceRequestId) {
      try {
        const response = await ApiService.apiAxios.get(ApiRoutes.MESSAGES + '/assistanceRequests/' + assistanceRequestId)
        return response.data
      } catch (error) {
        console.log(`Failed to get the details of an assistance request - ${error}`)
        throw error
      }
    },
    async updateAssistanceRequest(assistanceRequestId, payload) {
      try {
        if (assistanceRequestId && !isEmpty(payload)) {
          await ApiService.apiAxios.put(ApiRoutes.MESSAGES + '/' + assistanceRequestId, payload)
        }
      } catch (error) {
        console.log(`Failed to update existing assistance request - ${error}`)
        throw error
      }
    },
    async addNewAssistanceRequestToStore(assistanceRequestId) {
      const newAssistanceRequest = await this.getAssistanceRequest(assistanceRequestId)
      const foundAssistanceRequestWithSameID = this.assistanceRequests?.find((item) => item.assistanceRequestId === newAssistanceRequest?.assistanceRequestId)
      if (!foundAssistanceRequestWithSameID) {
        this.assistanceRequests?.push(newAssistanceRequest)
        sortAssistanceRequests(this.assistanceRequests)
      }
    },
    async updateAssistanceRequestInStore(assistanceRequestId) {
      const assistanceRequest = await this.getAssistanceRequest(assistanceRequestId)
      const assistanceRequestIndex = this.assistanceRequests?.findIndex((item) => item.assistanceRequestId === assistanceRequest?.assistanceRequestId)
      if (assistanceRequestIndex !== -1) {
        this.assistanceRequests[assistanceRequestIndex] = assistanceRequest
      }
    },
    async getAssistanceRequestConversation(assistanceRequestId) {
      try {
        const response = await ApiService.apiAxios.get(ApiRoutes.MESSAGES + '/conversations' + '/' + assistanceRequestId)
        this.assistanceRequestConversation = response.data
      } catch (error) {
        console.log(`Failed to get the list of assistance request messages - ${error}`)
        throw error
      }
    },
    async replyToAssistanceRequest(payload) {
      try {
        const response = await ApiService.apiAxios.post(ApiRoutes.MESSAGES + '/replyToAssistanceRequest', payload)
        return response?.data
      } catch (error) {
        console.log(`Failed to create a reply for the Assistance Request - ${error}`)
        throw error
      }
    },
  },
})
