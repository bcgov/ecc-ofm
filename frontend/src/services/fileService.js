import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getFile(fileId, image = false) {
    try {
      if (!fileId) return null
      const response = await ApiService.apiAxios.get(`${ApiRoutes.FILES}/${fileId}?image=${image}`)
      return response.data
    } catch (error) {
      console.log(`Failed to get file - ${error}`)
      throw error
    }
  }
}
