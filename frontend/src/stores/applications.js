import { APPLICATION_STATUS_CODES, FACILITY_TYPES } from '@/utils/constants'

import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import LicenceService from '@/services/licenceService'
import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'

function checkFacilityDetailsComplete(application) {
  return application?.primaryContactId && application?.expenseAuthorityId
}

function checkStaffingComplete(application) {
  const totalStaff =
    application?.staffingInfantECEducatorFullTime +
    application?.staffingInfantECEducatorPartTime +
    application?.staffingECEducatorFullTime +
    application?.staffingECEducatorPartTime +
    application?.staffingECEducatorAssistantFullTime +
    application?.staffingECEducatorAssistantPartTime +
    application?.staffingResponsibleAdultFullTime +
    application?.staffingResponsibleAdultPartTime
  return totalStaff > 0
}

function checkOperatingCostsComplete(application) {
  const isDocumentUploaded = application?.facilityType != FACILITY_TYPES.RENT_LEASE || (application?.facilityType === FACILITY_TYPES.RENT_LEASE && !isEmpty(application?.uploadedDocuments))
  return application?.facilityType && isDocumentUploaded && application?.totalYearlyOperatingCosts + application?.totalYearlyFacilityCosts > 0
}

function checkServiceDeliveryComplete(application) {
  return application?.licenceDeclaration && !isEmpty(application?.licences)
}

function checkDeclareSubmitComplete(application) {
  return application?.applicationDeclaration
}

export const useApplicationsStore = defineStore('applications', {
  namespaced: true,
  state: () => ({
    currentApplication: undefined,
    isSelectFacilityComplete: false,
    isFacilityDetailsComplete: false,
    isServiceDeliveryComplete: false,
    isOperatingCostsComplete: false,
    isStaffingComplete: false,
    isDeclareSubmitComplete: false,
    validation: false,
  }),
  getters: {
    isApplicationComplete: (state) => state.isFacilityDetailsComplete && state.isServiceDeliveryComplete && state.isOperatingCostsComplete && state.isStaffingComplete,
    isApplicationReadonly: (state) => state.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT,
  },
  actions: {
    checkApplicationComplete() {
      this.isFacilityDetailsComplete = checkFacilityDetailsComplete(this.currentApplication)
      this.isServiceDeliveryComplete = checkServiceDeliveryComplete(this.currentApplication)
      this.isOperatingCostsComplete = checkOperatingCostsComplete(this.currentApplication)
      this.isStaffingComplete = checkStaffingComplete(this.currentApplication)
      this.isDeclareSubmitComplete = checkDeclareSubmitComplete(this.currentApplication)
    },

    async getApplication(applicationId) {
      try {
        this.currentApplication = await ApplicationService.getApplication(applicationId)
        if (!this.currentApplication) return
        if (this.currentApplication?.facilityType === FACILITY_TYPES.RENT_LEASE) {
          this.currentApplication.uploadedDocuments = await DocumentService.getDocuments(applicationId)
        }
        this.currentApplication.licences = await LicenceService.getLicences(this.currentApplication?.facilityId)
      } catch (error) {
        console.log(`Failed to get the application by application id - ${error}`)
        throw error
      }
    },
  },
})
