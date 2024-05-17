import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  /**
   * Gets all the users/contacts for the specified organizationId.
   * @param {*} organizationId
   * @returns The list of contacts
   */
  async getOrganizationUsers(organizationId) {
    try {
      if (!organizationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.USER_PERMISSIONS_FACILITIES}/${organizationId}`)
      return response.data
    } catch (error) {
      console.log(`Failed to get the list of users by organization id: ${organizationId}`, error)
      throw error
    }
  },
}
