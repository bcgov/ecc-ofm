import { isEmpty } from 'lodash'

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

  async getSystemMessages() {
    try {
      const response = await ApiService.apiAxios.get(ApiRoutes.SYSTEM_MESSAGES)
      return response.data?.filter((message) => !isEmpty(message.content))
    } catch (error) {
      console.log(`Failed to get system messages - ${error}`)
      throw error
    }
  },
}
