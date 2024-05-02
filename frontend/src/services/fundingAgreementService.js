import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

//There is only ever one active funding agreement - so this function returns it
export default {
  async getActiveFundingAgreementByApplicationId(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?applicationId=${applicationId}&stateCode=0`)
      //CRM confirmed that there will only ever be one Funding Agreement per ApplicationID. However response returns an array. If index 0 contains data, return it
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },

  //TODO: other screens may require a table of all previous funding agreements. Add an endpoint and function here to support that functionality.
  // A facility can have only 1 Active funding agreement
  async getActiveFundingAgreementByFacilityId(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?facilityId=${facilityId}&stateCode=0`)
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },
}
