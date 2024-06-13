import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getLookupInfo() {
    try {
      return await ApiService.apiAxios.get(ApiRoutes.LOOKUP)
    } catch (e) {
      console.log(`Failed to get lookup info - ${e}`)
      throw e
    }
  },
}
