import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messages', {
  namespaced: true,
  state: () => ({
    messages: null,
  }),
  getters: {
    unreadMessageCount: (state) => (state.messages ? state.messages.filter((message) => !message.isRead).length : 0),
  },
  actions: {
    async getMessages(contactId) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to get Messages data because you are not logged in')
        throw 'unable to get Messages data because you are not logged in'
      }
      if (contactId) {
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/contact/' + contactId)
          this.messages = response.data
        } catch (error) {
          console.log(`Failed to get messages - ${error}`)
          throw error
        }
      } else {
        this.messages = []
      }
    },
    async updateMessage(messageId, isRead) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to update Messages data because you are not logged in')
        throw 'unable to update Messages data because you are not logged in'
      }
      if (messageId) {
        try {
          let updatedMessage = {
            messageId: messageId,
            isRead: isRead,
          }
          this.updateMessageInMemory(updatedMessage)
          const payload = {
            lastopenedtime: isRead ? new Date().toISOString() : null,
          }
          await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + messageId, payload)
        } catch (error) {
          console.log(`Failed to update existing Message - ${error}`)
          throw error
        }
      }
    },
    updateMessageInMemory(updatedMessage) {
      try {
        if (this.messages) {
          this.messages.forEach((message) => {
            if (message.messageId === updatedMessage.messageId) message.isRead = updatedMessage.isRead
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async submitNewAssistanceRequest(payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.MESSAGE + '/newAssistanceRequest', payload)
        return response?.data
      } catch (error) {
        console.log(`Failed to create a new Assistance Request - ${error}`)
        throw error
      }
    },
  },
})
