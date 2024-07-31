import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getIrregularExpenseApplications(applicationId, statusCode = undefined) {
    try {
      if (!applicationId) return
      let url = `${ApiRoutes.IRREGULAR_APPLICATIONS}?applicationId=${applicationId}`
      if (statusCode) {
        url += `&statusCode=${statusCode}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the Irregular Expense by application id - ${error}`)
      throw error
    }
  },

  async getIrregularExpensePDF(expenseApplicationId) {
    try {
      if (!expenseApplicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.IRREGULAR_APPLICATIONS}/${expenseApplicationId}/pdf`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the approved  PDF by application id - ${error}`)
      throw error
    }
  },

  async getIrregularExpenseById(expenseApplicationId) {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.IRREGULAR_APPLICATIONS}/${expenseApplicationId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application by supplementary id  - ${error}`)
      throw error
    }
  },
}
