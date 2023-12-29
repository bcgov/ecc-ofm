import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getFacility(accountId) {
    try {
      if (!accountId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.FACILITIES + '/' + accountId)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the facility by facility/account id - ${error}`)
      throw error
    }
  },
}
