import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'

export default {
  async getLicences(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.FACILITIES_LICENCES.replace(':facilityId', facilityId))
      const licences = response?.data
      await Promise.all(
        licences?.map(async (licence) => {
          licence.licenceDetails = await this.getLicenceDetails(licence.licenceId)
        })
      )
      return licences
    } catch (error) {
      console.log(`Failed to get licence(s) by facilityId - ${error}`)
      throw error
    }
  },

  async getLicenceDetails(licenceId) {
    try {
      if (!licenceId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.LICENCES}/${licenceId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get licence detail(s) by licenceId - ${error}`)
      throw error
    }
  },

  async updateLicenceDetails(licenceDetailId, payload) {
    try {
      return await ApiService.apiAxios.patch(`${ApiRoutes.LICENCES}/${licenceDetailId}`, payload)
    } catch (error) {
      console.log(`Failed to update licence detail - ${error}`)
      throw error
    }
  },

  // Helpers to validate licence details
  isOperationalSpacesValid(value) {
    return value != null && value >= 0 && value < 1000
  },
  isEnrolledSpacesValid(value) {
    return value != null && value >= 0 && value < 1000
  },
  isWeeksInOperationValid(value) {
    return value != null && value > 0 && value < 53
  },
  isSplitClassRoomInfoValid(licenceDetail) {
    return !licenceDetail.applyRoomSplitCondition || !isEmpty(licenceDetail.roomSplitDetails)
  }
}
