import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getFacilityReports(facilityId) {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/${facilityId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get facilities reporting activity for facility - ${error}`)
      throw error
    }
  },
}
