import ApiService from '@/common/apiService'
import { ApiRoutes, CRM_STATE_CODES } from '@/utils/constants'

export default {
  async getActiveFundingAgreementByApplicationId(applicationId, ignoreMODAgreements = false) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?applicationId=${applicationId}&stateCode=${CRM_STATE_CODES.ACTIVE}`)

      //Backend will order FA's so newest one (newest MOD agreement) will always be first
      //in the case of Supp Apps - we will need the start date of the ORIGINAL funding agreement - so take the last FA in the list
      if (ignoreMODAgreements) {
        return response?.data[response.data.length - 1]
      }
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the active funding agreement by application id - ${error}`)
      throw error
    }
  },

  async getFundingAgreementById(fundingAgreementId) {
    try {
      if (!fundingAgreementId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },

  async getFundingPDFById(fundingAgreementId) {
    try {
      if (!fundingAgreementId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}/pdf`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the funding PDF by funding id - ${error}`)
      throw error
    }
  },

  async updateFundingAgreement(fundingAgreementId, payload) {
    try {
      if (!fundingAgreementId) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreementId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update the Funding Agreement - ${error}`)
      throw error
    }
  },

  //Backend will order FA's so newest one (newest MOD agreement) will always be first
  async getActiveFundingAgreementByFacilityIdAndStatus(facilityId, statusCode) {
    try {
      if (!facilityId && !statusCode) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}&statusCode=${statusCode}`)
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the active funding agreement by facility id and status - ${error}`)
      throw error
    }
  },

  async getFAsByFacilityIdAndStartDate(facilityId, startDateFrom, startDateTo) {
    try {
      if (!facilityId && !startDateFrom) return
      let url = `${ApiRoutes.FUNDING_AGREEMENTS}?facilityId=${facilityId}&includeEA=true&dateFrom=${startDateFrom}`
      if (startDateTo) {
        url += `&dateTo=${startDateTo}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by facility id and start date threshold - ${error}`)
      throw error
    }
  },
}
