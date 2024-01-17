import { defineStore } from 'pinia'

import ApplicationService from '@/services/applicationService'

function checkFacilityDetailsComplete(application) {
  return application?.primaryContactId ? true : false
}

function checkStaffingComplete(application) {
  const totalStaffs =
    application?.staffingInfantECEducatorFullTime +
    application?.staffingInfantECEducatorPartTime +
    application?.staffingECEducatorFullTime +
    application?.staffingECEducatorPartTime +
    application?.staffingECEducatorAssistantFullTime +
    application?.staffingECEducatorAssistantPartTime +
    application?.staffingResponsibleAdultFullTime +
    application?.staffingResponsibleAdultPartTime
  return (
    totalStaffs > 0 &&
    application?.staffingInfantECEducatorFullTime >= 0 &&
    application?.staffingInfantECEducatorFullTime <= 99 &&
    application?.staffingInfantECEducatorPartTime >= 0 &&
    application?.staffingInfantECEducatorPartTime <= 99 &&
    application?.staffingECEducatorFullTime >= 0 &&
    application?.staffingECEducatorFullTime <= 99 &&
    application?.staffingECEducatorPartTime >= 0 &&
    application?.staffingECEducatorPartTime <= 99 &&
    application?.staffingECEducatorAssistantFullTime >= 0 &&
    application?.staffingECEducatorAssistantFullTime <= 99 &&
    application?.staffingECEducatorAssistantPartTime >= 0 &&
    application?.staffingECEducatorAssistantPartTime <= 99 &&
    application?.staffingResponsibleAdultFullTime >= 0 &&
    application?.staffingResponsibleAdultFullTime <= 99 &&
    application?.staffingResponsibleAdultPartTime >= 0 &&
    application?.staffingResponsibleAdultPartTime <= 99
  )
}

export const useApplicationsStore = defineStore('applications', {
  namespaced: true,
  state: () => ({
    currentApplication: undefined,
    isFacilityDetailsComplete: false,
    isLicencesComplete: false,
    isOperatingCostsComplete: false,
    isStaffingComplete: false,
    isSubmitApplicationComplete: false,
  }),
  actions: {
    checkApplicationComplete() {
      this.setIsFacilityDetailsComplete(checkFacilityDetailsComplete(this.currentApplication))
      this.setIsStaffingComplete(checkStaffingComplete(this.currentApplication))
    },

    setIsStaffingComplete(value) {
      this.isStaffingComplete = value
    },

    setIsFacilityDetailsComplete(value) {
      this.isFacilityDetailsComplete = value
    },

    async getApplication(applicationId) {
      try {
        this.currentApplication = await ApplicationService.getApplication(applicationId)
      } catch (error) {
        console.log(`Failed to get the application by application id - ${error}`)
        throw error
      }
    },
  },
})
