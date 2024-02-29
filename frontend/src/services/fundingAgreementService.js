import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getActiveFundingAgreementsByApplicationId(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?applicationId=${applicationId}&stateCode=0`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },
}
