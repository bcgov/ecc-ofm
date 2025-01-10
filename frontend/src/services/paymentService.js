import ApiService from '@/common/apiService'
import { ApiRoutes, CRM_STATE_CODES } from '@/utils/constants'

export default {
  async getActivePaymentsByFacilityId(facilityId, dateFrom = null, dateTo = null) {
    try {
      if (!facilityId) return
      let url = `${ApiRoutes.PAYMENTS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}`
      if (dateFrom) {
        url += `&dateFrom=${dateFrom}`
      }
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

  async getPaymentsByFacilityIdAndStatus(facilityId, statusCode, dateFrom = null, dateTo = null) {
    try {
      if (!facilityId || !statusCode) return
      let url = `${ApiRoutes.PAYMENTS}?facilityId=${facilityId}&statusCode=${statusCode}`
      if (dateFrom) {
        url += `&dateFrom=${dateFrom}`
      }
      if (dateTo) {
        url += `&dateTo=${dateTo}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of payments by facility id and status and payment/invoice date - ${error}`)
      throw error
    }
  }
}
