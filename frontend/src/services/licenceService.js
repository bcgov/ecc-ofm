import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getLicenceDetails(licenceId) {
    try {
      if (!licenceId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.LICENCES}/${licenceId}/licence-details`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the licences by facilityId - ${error}`)
      throw error
    }
  },
}
