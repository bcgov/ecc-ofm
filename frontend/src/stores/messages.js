import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'

export const useMessagesStore = defineStore('messages', {
  namespaced: true,
  state: () => ({
    assistanceRequests: null,
  }),
  getters: {
    unreadMessageCount: (state) => (state.assistanceRequests ? state.assistanceRequests.filter((message) => !message.isRead).length : 0),
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
        this.sortAssistanceRequests()
      } catch (error) {
        console.log(`Failed to get the list of assistance requests - ${error}`)
        throw error
      }
    },
    async getAssistanceRequest(assistanceRequestId) {
      try {
        let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/assistanceRequests/' + assistanceRequestId)
        return response.data
      } catch (error) {
        console.log(`Failed to get the list of assistance requests - ${error}`)
        throw error
      }
    },
    async updateAssistanceRequest(assistanceRequestId, payload) {
      try {
        if (assistanceRequestId && !isEmpty(payload)) {
          await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + assistanceRequestId, payload)
        }
      } catch (error) {
        console.log(`Failed to update existing assistance request - ${error}`)
        throw error
      }
    },
    async addNewAssistanceRequestToStore(assistanceRequestId) {
      let newAssistanceRequest = await this.getAssistanceRequest(assistanceRequestId)
      let foundAssistanceRequestWithSameID = this.assistanceRequests?.find((item) => item.assistanceRequestId === newAssistanceRequest?.assistanceRequestId)
      if (!foundAssistanceRequestWithSameID) {
        this.assistanceRequests?.push(newAssistanceRequest)
        this.sortAssistanceRequests()
      }
    },
    sortAssistanceRequests() {
      this.assistanceRequests?.sort(function (req1, req2) {
        let priorityOrder = req2.priority - req1.priority
        var dateOrder = new Date(req2.lastConversationTime) - new Date(req1.lastConversationTime)
        return priorityOrder || dateOrder
      })
    },
  },
})
