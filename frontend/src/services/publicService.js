import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getSystemMessages() {
    try {
      const response = await ApiService.apiAxios.get(ApiRoutes.SYSTEM_MESSAGES)
      return response.data
    } catch (error) {
      console.log(`Failed to get system messages - ${error}`)
      throw error
    }
  },
}
