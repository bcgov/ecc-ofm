import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getOrganization(accountId) {
    try {
      if (!accountId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.ORGANIZATIONS + '/' + accountId)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the organization by organization/account id - ${error}`)
      throw error
    }
  },

  async getOrganizationFacilities(organizationId) {
    try {
      if (!organizationId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.ORGANIZATIONS_FACILITIES.replace(':organizationId', organizationId))
      return response?.data
    } catch (error) {
      console.log(`Failed to get the organization's facilities by organization/account id - ${error}`)
      throw error
    }
  },
}
