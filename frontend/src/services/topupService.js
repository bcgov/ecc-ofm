import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'

export default {
  async getTopUpFundingApplications(fundingApplicationId) {
    try {
      if (!fundingApplicationId) return
      let url = `${ApiRoutes.TOP_UP_APPLICATIONS}?topUpFundingId=${fundingApplicationId}`
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the Top-Up Funding by application id - ${error}`)
      throw error
    }
  },

  async getTopUpFundingPDF(fundingApplicationId) {
    try {
      if (!fundingApplicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.TOP_UP_APPLICATIONS}/${fundingApplicationId}/pdf`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the approved PDF by fundingGuid - ${error}`)
      throw error
    }
  },

  async getTopUpFundingById(fundingApplicationId) {
    try {
      let url = `${ApiRoutes.TOP_UP_APPLICATIONS}?topUpFundingId=${fundingApplicationId}`
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the Top-Up Funding application by ID - ${error}`)
      throw error
    }
  },
}
