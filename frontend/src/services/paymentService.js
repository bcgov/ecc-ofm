import ApiService from '@/common/apiService'
import { ApiRoutes, CRM_STATE_CODES } from '@/utils/constants'

export default {
  async getActivePaymentsByFacilityId(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.PAYMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active payments by facility id - ${error}`)
      throw error
    }
  },

  async getActivePaymentsByFacilityIdAndDate(facilityId, dateFrom, dateTo) {
    try {
      if (!facilityId || !dateFrom) return
      let url = `${ApiRoutes.PAYMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}&dateFrom=${dateFrom}`
      if (dateTo) {
        url += `&dateTo=${dateTo}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of active payments by facility id and payment/invoice date - ${error}`)
      throw error
    }
  },

  async getPaymentsByFacilityIdAndStatusAndDate(facilityId, statusCode, dateFrom, dateTo) {
    try {
      if (!facilityId || !statusCode || !dateFrom) return
      let url = `${ApiRoutes.PAYMENTS}?facilityId=${facilityId}&statusCode=${statusCode}&dateFrom=${dateFrom}`
      if (dateTo) {
        url += `&dateTo=${dateTo}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of payments by facility id and status and payment/invoice date - ${error}`)
      throw error
    }
  },
}
