import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

function sortContactsByName(contacts) {
  return contacts?.sort(function (a, b) {
    return a.lastName?.localeCompare(b.lastName)
  })
}

export default {
  async getFacility(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.FACILITIES + '/' + facilityId)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the facility by facility/account id - ${error}`)
      throw error
    }
  },

  async getContacts(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.FACILITIES_CONTACTS.replace(':facilityId', facilityId))
      return sortContactsByName(response?.data)
    } catch (error) {
      console.log(`Failed to get the contacts by facilityId - ${error}`)
      throw error
    }
  },

  async getLicences(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.FACILITIES_LICENCES.replace(':facilityId', facilityId))
      return response?.data
    } catch (error) {
      console.log(`Failed to get the licences by facilityId - ${error}`)
      throw error
    }
  },

  async updateFacilityPrimaryContact(facilityId, primaryContactId) {
    try {
      if (!facilityId || !primaryContactId) return
      const payload = {
        primaryContactId: primaryContactId,
      }
      const response = await ApiService.apiAxios.put(`${ApiRoutes.FACILITIES}/${facilityId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update facility primary contact by facility/account id - ${error}`)
      throw error
    }
  },

  async updateFacilityContact(facilityId, contact) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.USER_PERMISSIONS_FACILITIES}/${contact.bceidFacilityId}`, contact)
      return response?.data
    } catch (error) {
      console.log(`Failed to update facility contact by facility/account id - ${error}`)
      throw error
    }
  },

  async updateFacility(facilityId, facility) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.patch(ApiRoutes.FACILITIES + '/' + facilityId, facility)
      return response?.data
    } catch (error) {
      console.log(`Failed to update facility by facility id - ${error}`)
      throw error
    }
  },
}
