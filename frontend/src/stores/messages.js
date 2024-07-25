import { defineStore } from 'pinia'

import MessageService from '@/services/messageService'

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
    async getAssistanceRequests(contactId) {
      try {
        this.assistanceRequests = await MessageService.getAssistanceRequestsByContactId(contactId)
        this.sortAssistanceRequests(this.assistanceRequests)
      } catch (error) {
        console.log(`Failed to get the list of assistance requests - ${error}`)
        throw error
      }
    },

    async addNewAssistanceRequestToStore(assistanceRequestId) {
      const newAssistanceRequest = await MessageService.getAssistanceRequest(assistanceRequestId)
      const foundAssistanceRequestWithSameID = this.assistanceRequests?.find((item) => item.assistanceRequestId === newAssistanceRequest?.assistanceRequestId)
      if (!foundAssistanceRequestWithSameID) {
        this.assistanceRequests?.push(newAssistanceRequest)
        this.sortAssistanceRequests(this.assistanceRequests)
      }
    },

    async updateAssistanceRequestInStore(assistanceRequestId) {
      const assistanceRequest = await MessageService.getAssistanceRequest(assistanceRequestId)
      const assistanceRequestIndex = this.assistanceRequests?.findIndex((item) => item.assistanceRequestId === assistanceRequest?.assistanceRequestId)
      if (assistanceRequestIndex !== -1) {
        this.assistanceRequests[assistanceRequestIndex] = assistanceRequest
      }
      this.sortAssistanceRequests(this.assistanceRequests)
    },

    sortAssistanceRequests(assistanceRequests) {
      assistanceRequests?.sort(function (req1, req2) {
        let priorityOrder = req2.priority - req1.priority
        var dateOrder = new Date(req2.lastConversationTime) - new Date(req1.lastConversationTime)
        return priorityOrder || dateOrder
      })
    },

    async getAssistanceRequestConversation(assistanceRequestId) {
      try {
        this.assistanceRequestConversation = await MessageService.getAssistanceRequestConversation(assistanceRequestId)
      } catch (error) {
        console.log(`Failed to get the list of assistance request conversations - ${error}`)
        throw error
      }
    },
  },
})
