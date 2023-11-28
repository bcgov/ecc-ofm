import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  namespaced: true,
  state: () => ({
    usersAndFacilities: null,
  }),
  getters: {},
  actions: {
    async getUsersFacilitiesByOrganizationId(organizationId) {
      try {
        const response = await ApiService.apiAxios.get(ApiRoutes.USER_FACILITIES + '/' + organizationId)
        this.usersAndFacilities = response.data
      } catch (error) {
        console.log(`Failed to get the list of users by organization id - ${error}`)
        throw error
      }
    },
  },
})
