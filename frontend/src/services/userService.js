import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  /**
   * Gets the current user's info.
   * @returns
   */
  async getCurrentUser() {
    try {
      return await ApiService.apiAxios.get(ApiRoutes.USER)
    } catch (e) {
      console.log(`Failed to get current user info - ${e}`)
      throw e
    }
  },

  /**
   * Gets the specified user's info.
   * @param {} userName
   * @returns
   */
  async getUser(userName) {
    try {
      return await ApiService.apiAxios.get(`${ApiRoutes.USER}/${userName}`)
    } catch (e) {
      console.log(`Failed to get user info - ${e}`)
      throw e
    }
  },

  /**
   * Checks if the specified user exists.
   * @param {*} userName
   * @returns
   */
  async userExists(userName) {
    try {
      if (!userName) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.USER}/${userName}/exists`)
      return response.data
    } catch (e) {
      console.log(`Failed to check if user exists - ${e}`)
      throw e
    }
  },

  /**
   * Gets all the users/contacts for the specified organizationId.
   * @param {*} organizationId
   * @returns The list of contacts
   */
  async getOrganizationUsers(organizationId) {
    try {
      if (!organizationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.USER_PERMISSIONS_FACILITIES}/${organizationId}`)
      console.log('resp', response)
      if (!response) {
        console.error('Missing response from API')
        return
      }
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of users by organization id: ${organizationId}`, error)
      throw error
    }
  },

  /**
   * Creates a new user.
   * @param {*} user
   * @returns
   */
  async createUser(user) {
    try {
      if (isEmpty(user)) return
      const response = await ApiService.apiAxios.post(`${ApiRoutes.USER}`, user)
      return response?.data
    } catch (error) {
      console.log(`Failed to create user - ${error}`)
      throw error
    }
  },

  /**
   * Updates an existing user.
   * @param {*} user
   * @returns
   */
  async updateUser(user) {
    try {
      if (isEmpty(user)) return
      const response = await ApiService.apiAxios.put(`${ApiRoutes.USER}`, user)
      return response?.data
    } catch (error) {
      console.log(`Failed to update user - ${error}`)
      throw error
    }
  },

  /**
   * Gets the specified user's facilities.
   * @param {} contactId
   * @returns
   */
  async getUserFacilities(contactId) {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.USER_FACILITIES.replace(':contactId', contactId)}`)
      return response.data
    } catch (e) {
      console.log(`Failed to get user info - ${e}`)
      throw e
    }
  },
}
