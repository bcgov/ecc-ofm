import { defineStore } from 'pinia'

import ApplicationService from '@/services/applicationService'

export const useApplicationsStore = defineStore('applications', {
  namespaced: true,
  state: () => ({
    currentApplication: undefined,
  }),
  actions: {
    async getApplication(applicationId) {
      try {
        this.currentApplication = await ApplicationService.getApplication(applicationId)
      } catch (error) {
        console.log(`Failed to get the application by application id - ${error}`)
        throw error
      }
    },
  },
})
