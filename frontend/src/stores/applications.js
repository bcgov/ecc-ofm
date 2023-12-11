import { defineStore } from 'pinia'

import ApiService from '@/common/apiService'
import { useAuthStore } from '@/stores/auth'
import { ApiRoutes } from '@/utils/constants'
import { APPLICATION_STATUS_CODES, CRM_STATE_CODES } from '@/utils/constants'

function sortApplications(applications) {
  applications?.sort((app1, app2) => {
    return new Date(app2.latestActivity) - new Date(app1.latestActivity)
  })
}

export const useApplicationsStore = defineStore('applications', {
  namespaced: true,
  state: () => ({
    applications: undefined,
    currentApplication: undefined,
  }),
  actions: {
    async getApplicationsByFacilityId(facilityId) {
      try {
        const response = await ApiService.apiAxios.get(ApiRoutes.APPLICATIONS + '/facility/' + facilityId)
        return response?.data
      } catch (error) {
        console.log(`Failed to get the list of applications by facility id - ${error}`)
        throw error
      }
    },

    async getApplications() {
      try {
        const authStore = useAuthStore()
        const facilities = authStore?.userInfo?.facilities
        this.applications = []
        await Promise.all(
          facilities?.map(async (facility) => {
            const response = await this.getApplicationsByFacilityId(facility.facilityId)
            this.applications = this.applications?.concat(response)
          }),
        )
        sortApplications(this.applications)
      } catch (error) {
        console.log(`Failed to get the applications - ${error}`)
        throw error
      }
    },

    async getApplication(applicationId) {
      try {
        const response = await ApiService.apiAxios.get(ApiRoutes.APPLICATIONS + '/' + applicationId)
        this.currentApplication = response?.data
      } catch (error) {
        console.log(`Failed to get the application by application id - ${error}`)
        throw error
      }
    },

    removeApplicationFromStore(applicationId) {
      const index = this.applications?.findIndex((item) => item.applicationId === applicationId)
      if (index > -1) {
        this.applications.splice(index, 1)
      }
    },

    async cancelApplication(applicationId) {
      try {
        const payload = {
          statusCode: APPLICATION_STATUS_CODES.CANCELLED,
          stateCode: CRM_STATE_CODES.INACTIVE,
        }
        const response = await ApiService.apiAxios.put(ApiRoutes.APPLICATIONS + '/' + applicationId, payload)
        this.removeApplicationFromStore(applicationId)
        return response
      } catch (error) {
        console.log(`Failed to update the application - ${error}`)
        throw error
      }
    },
  },
})
