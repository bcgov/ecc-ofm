import { isEmpty } from 'lodash'
import { defineStore } from 'pinia'

import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import LicenceService from '@/services/licenceService'
import { APPLICATION_STATUS_CODES, DOCUMENT_TYPES, FACILITY_TYPES, YES_NO_CHOICE_CRM_MAPPING } from '@/utils/constants'

/*
  Facility Details page - Helper functions
*/
function checkFacilityDetailsComplete(application) {
  return application?.primaryContactId && application?.expenseAuthorityId
}

/*
  Operating Cost page - Helper functions
*/
function checkRequiredDocsExist(application, requiredDocumentTypes) {
  return requiredDocumentTypes.every((type) => application.uploadedDocuments.some((doc) => doc.documentType === type))
}

function isRentLease(application) {
  return application?.facilityType === FACILITY_TYPES.RENT_LEASE
}

function checkOperatingCostsComplete(application) {
  const isRequiredFinancialDocsUploaded = checkRequiredDocsExist(application, [DOCUMENT_TYPES.INCOME_STATEMENT, DOCUMENT_TYPES.BALANCE_SHEET])
  const isFacilityTypeRequiredDocsUploaded = !isRentLease(application) || checkRequiredDocsExist(application, [DOCUMENT_TYPES.SUPPORTING_DOCS])
  const areCostsPositive = application?.totalYearlyOperatingCosts + application?.totalYearlyFacilityCosts > 0
  const isArmsLengthConfirmed = !isRentLease(application) || application?.armsLength === YES_NO_CHOICE_CRM_MAPPING.YES
  return application?.facilityType && isArmsLengthConfirmed && isRequiredFinancialDocsUploaded && isFacilityTypeRequiredDocsUploaded && areCostsPositive
}

/*
  Service Delivery page - Helper functions
*/
function checkServiceDeliveryComplete(application) {
  const allDetailsComplete = application.licences.every((licence) => {
    return licence.licenceDetails?.every(
      (detail) =>
        LicenceService.isOperationalSpacesValid(detail.operationalSpaces) &&
        LicenceService.isEnrolledSpacesValid(detail.enrolledSpaces) &&
        LicenceService.isWeeksInOperationValid(detail.weeksInOperation) &&
        !isEmpty(detail.weekDays) &&
        !isEmpty(detail.operationFromTime) &&
        !isEmpty(detail.operationToTime) &&
        LicenceService.isSplitClassRoomInfoValid(detail),
    )
  })
  return application?.licenceDeclaration && !isEmpty(application?.licences) && allDetailsComplete
}

/*
  Declare Submit page - Helper functions
*/
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
      this.isStaffingComplete = this.isThereAtLeastOneEmployee(this.currentApplication) && this.areEmployeeCertificatesComplete(this.currentApplication?.providerEmployees, this.currentApplication)
      this.isDeclareSubmitComplete = checkDeclareSubmitComplete(this.currentApplication)
    },

    async getApplication(applicationId) {
      try {
        this.currentApplication = await ApplicationService.getApplication(applicationId)
        if (!this.currentApplication) return
        this.currentApplication.uploadedDocuments = await DocumentService.getDocuments(applicationId)
        this.currentApplication.licences = await LicenceService.getLicences(this.currentApplication?.facilityId)
        this.checkApplicationComplete()
      } catch (error) {
        console.log(`Failed to get the application by application id - ${error}`)
        throw error
      }
    },

    /* 
      Staffing page
    */
    isThereAtLeastOneEmployee(application) {
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
    },

    areEmployeeCertificatesComplete(certificates, application) {
      return this.areAllEmployeeCertificatesEntered(certificates, application) && this.areAllCertificateInitialsUnique(certificates) && this.areAllCertificateNumbersUnique(certificates)
    },

    areAllEmployeeCertificatesEntered(certificates, application) {
      const filteredCertificates = certificates?.filter((certificate) => certificate.initials && certificate.certificateNumber)
      const totalInfantECEducatorStaff = application?.staffingInfantECEducatorFullTime + application?.staffingInfantECEducatorPartTime
      const totalECEducatorStaff = application?.staffingECEducatorFullTime + application?.staffingECEducatorPartTime
      const totalECEducatorAssistantStaff = application?.staffingECEducatorAssistantFullTime + application?.staffingECEducatorAssistantPartTime
      return filteredCertificates?.length === totalInfantECEducatorStaff + totalECEducatorStaff + totalECEducatorAssistantStaff
    },

    areAllCertificateInitialsUnique(certificates) {
      const allInitials = certificates?.map((certificate) => certificate.initials)?.filter((initials) => initials)
      const uniqueInitials = [...new Set(allInitials)]
      return allInitials?.length === uniqueInitials?.length
    },

    areAllCertificateNumbersUnique(certificates) {
      const allCertificateNumbers = certificates?.map((certificate) => certificate.certificateNumber)?.filter((certificateNumber) => certificateNumber)
      const uniqueCertificateNumbers = [...new Set(allCertificateNumbers)]
      return allCertificateNumbers?.length === uniqueCertificateNumbers?.length
    },
  },
})
