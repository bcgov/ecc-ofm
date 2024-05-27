import ApiService from '@/common/apiService'
import { ApiRoutes, CRM_STATE_CODES } from '@/utils/constants'

export default {
  async getActiveFundingAgreementByApplicationId(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?applicationId=${applicationId}&stateCode=${CRM_STATE_CODES.ACTIVE}`)
      //CRM confirmed that there will only ever be one Funding Agreement per ApplicationID. However response returns an array. If index 0 contains data, return it
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
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

  // A facility can have only 1 Active funding agreement
  async getActiveFundingAgreementByFacilityId(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}`)
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },

  // A facility can have only 1 Active funding agreement
  async getActiveFundingAgreementByFacilityIdAndStatus(facilityId, statusCode) {
    try {
      if (!facilityId && !statusCode) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FUNDING_AGREEMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}&statusCode=${statusCode}`)
      return response?.data[0]
    } catch (error) {
      console.log(`Failed to get the list of active funding agreements by application id - ${error}`)
      throw error
    }
  },

  async getFAsByFacilityIdAndStartDate(facilityId, startDateFrom, startDateTo) {
    try {
      if (!facilityId && !startDateFrom) return
      let url = `${ApiRoutes.FUNDING_AGREEMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}&includeEA=true&dateFrom=${startDateFrom}`
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
