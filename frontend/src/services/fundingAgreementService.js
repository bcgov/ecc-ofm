import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

//There is only ever one active funding agreement - so this function returns it
export default {
  async getActiveFundingAgreementByApplicationId(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?applicationId=${applicationId}&stateCode=0`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },

  async updateFundingAgreement(fundingAgreementId, payload) {
    console.log('called')
    try {
      if (!fundingAgreementId) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },

  //TODO: other screens may require a table of all previous funding agreements. Add an endpoint and function here to support that functionality.
}
