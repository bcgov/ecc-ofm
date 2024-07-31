import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getOrganization(organizationId) {
    try {
      if (!organizationId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.ORGANIZATIONS + '/' + organizationId)
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

  async getOrganizationUsers(organizationId, firstName, lastName, email) {
    try {
      if (!organizationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.ORGANIZATIONS_USERS.replace(':organizationId', organizationId)}?firstName=${firstName}&lastName=${lastName}&email=${email}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the organization's users by organizationid - ${error}`)
      throw error
    }
  },

  async updateOrganization(organizationId, organization) {
    try {
      if (!organizationId) return
      const response = await ApiService.apiAxios.put(ApiRoutes.ORGANIZATIONS + '/' + organizationId, organization)
      return response?.data
    } catch (error) {
      console.log(`Failed to update organization by organization/account id - ${error}`)
      throw error
    }
  },
}
