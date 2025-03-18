import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'

export default {
  async getTopUpFundingPDF(topUpFundingId) {
    try {
      if (!topUpFundingId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.TOP_UP_APPLICATIONS}/${topUpFundingId}/pdf`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the approved PDF by fundingGuid - ${error}`)
      throw error
    }
  },

  async getTopUpFundingById(topUpFundingId) {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.TOP_UP_APPLICATIONS}/${topUpFundingId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the Top-Up Funding application by ID - ${error}`)
      throw error
    }
  },
}
