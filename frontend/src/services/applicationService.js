import ApiService from '@/common/apiService'
import { useAuthStore } from '@/stores/auth'
import { ApiRoutes } from '@/utils/constants'

function sortApplications(applications) {
  applications?.sort((app1, app2) => {
    return new Date(app2.latestActivity) - new Date(app1.latestActivity)
  })
}

export default {
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
      let applications = []
      await Promise.all(
        facilities?.map(async (facility) => {
          const response = await this.getApplicationsByFacilityId(facility.facilityId)
          applications = applications?.concat(response)
        }),
      )
      sortApplications(applications)
      return applications
    } catch (error) {
      console.log(`Failed to get the applications - ${error}`)
      throw error
    }
  },

  async getApplication(applicationId) {
    try {
      const response = await ApiService.apiAxios.get(ApiRoutes.APPLICATIONS + '/' + applicationId)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the application by application id - ${error}`)
      throw error
    }
  },

  async updateApplication(applicationId, payload) {
    try {
      const response = await ApiService.apiAxios.put(ApiRoutes.APPLICATIONS + '/' + applicationId, payload)
      return response
    } catch (error) {
      console.log(`Failed to update the application - ${error}`)
      throw error
    }
  },
}
