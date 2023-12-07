import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'

export default {
  sortApplications(applications) {
    applications?.sort((app1, app2) => {
      const latestActivityDateOrder = new Date(app2.latestActivity) - new Date(app1.latestActivity)
      return latestActivityDateOrder
    })
  },

  async getApplicationsByFacilityId(facilityId) {
    try {
      const response = await ApiService.apiAxios.get(ApiRoutes.APPLICATIONS + '/facility/' + facilityId)
      let applications = response?.data
      return applications
    } catch (error) {
      console.log(`Failed to get the list of applications by facility id - ${error}`)
      throw error
    }
  },
}
