import { APPLICATION_STATUS_CODES, DOCUMENT_TYPES, FACILITY_TYPES, OFM_PROGRAM_CODES, YES_NO_CHOICE_CRM_MAPPING, YES_NO_RADIO_GROUP_MAPPING } from '@/utils/constants'

import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import FacilityService from '@/services/facilityService'
import LicenceService from '@/services/licenceService'
import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'
import { useAppStore } from '@/stores/app'

export const useApplicationsStore = defineStore('applications', {
  namespaced: true,
  state: () => ({
    currentApplication: undefined,
    isSelectFacilityComplete: false,
    isFacilityDetailsComplete: false,
    isEligibilityComplete: false,
    isServiceDeliveryComplete: false,
    isOperatingCostsComplete: false,
    isStaffingComplete: false,
    isDeclareSubmitComplete: false,
    validation: false,
  }),
  getters: {
    isApplicationComplete: (state) => state.isFacilityDetailsComplete && state.isEligibilityComplete && state.isServiceDeliveryComplete && state.isOperatingCostsComplete && state.isStaffingComplete,
    isApplicationReadonly: (state) => state.currentApplication?.statusCode != APPLICATION_STATUS_CODES.DRAFT,
  },
  actions: {
    checkApplicationComplete() {
      this.isFacilityDetailsComplete = this.checkFacilityDetailsComplete()
      this.isEligibilityComplete = this.checkEligibilityComplete(this.currentApplication)
      this.isServiceDeliveryComplete = this.checkServiceDeliveryComplete()
      this.isOperatingCostsComplete = this.checkOperatingCostsComplete()
      this.isStaffingComplete = this.checkStaffingComplete()
      this.isDeclareSubmitComplete = this.checkDeclareSubmitComplete()
    },

    async getApplication(applicationId) {
      try {
        this.currentApplication = await ApplicationService.getApplication(applicationId)
        if (!this.currentApplication) return
        const [uploadedDocuments, licences, facility] = await Promise.all([
          DocumentService.getDocuments(applicationId),
          LicenceService.getLicences(this.currentApplication?.facilityId),
          FacilityService.getFacility(this.currentApplication?.facilityId),
        ])
        this.currentApplication.uploadedDocuments = uploadedDocuments
        this.currentApplication.licences = licences
        this.currentApplication.facility = facility
        this.checkApplicationComplete()
      } catch (error) {
        console.log(`Failed to get the application by application id - ${error}`)
        throw error
      }
    },

    /*
      Facility Details page
    */
    checkFacilityDetailsComplete() {
      return (
        this.currentApplication?.primaryContactId &&
        this.currentApplication?.expenseAuthorityId &&
        this.currentApplication?.fiscalYearEndDate &&
        this.isFacilityLocationAttributesComplete(this.currentApplication?.facility)
      )
    },

    isFacilityLocationAttributesComplete(facility) {
      return (
        !isEmpty(facility) &&
        facility?.k12SchoolGrounds != null &&
        facility?.municipalCommunity != null &&
        facility?.onReserve != null &&
        facility?.yppDesignation != null &&
        (facility?.yppDesignation === 0 || facility?.yppEnrolled != null) &&
        facility?.personalResidence != null
      )
    },

    /*
      Eligibility page
    */
    checkEligibilityComplete(application) {
      return (
        application?.greaterOneYearCCOFTDAD &&
        (!this.isMultipleProgram() || application?.ccfriParticipation) &&
        application?.ministryGoodStanding &&
        application?.healthAuthorityGoodStanding &&
        application?.eceCertificatesGoodStanding &&
        application?.eceweParticipation &&
        application?.accbParticipation &&
        application?.provideActualExpenses &&
        application?.providePreviousFYFinancialStatements &&
        application?.liabilityInsuranceCoverage &&
        application?.economicAnalysisParticipation &&
        (!this.isOperateInPersonalResidence() || application?.operateSeparateBankAccount)
      )
    },

    isMultipleProgram() {
      return this.currentApplication?.facility?.programCode === OFM_PROGRAM_CODES.MULTIPLE
    },

    isOperateInPersonalResidence() {
      return this.currentApplication?.facility?.personalResidence === YES_NO_RADIO_GROUP_MAPPING.YES
    },

    /* 
      Service Delivery page
     */
    checkServiceDeliveryComplete() {
      return (
        this.currentApplication?.licenceDeclaration &&
        !isEmpty(this.currentApplication?.licences) &&
        this.isLicenceDetailComplete() &&
        this.isLicenceDocumentUploaded() &&
        this.isHealthAuthorityReportUploaded() &&
        this.isPolicyProcedureManualUploaded()
      )
    },

    isLicenceDetailComplete() {
      return this.isCCOFMissingDetailComplete() && this.isSplitClassroomComplete()
    },

    isCCOFMissingDetailComplete() {
      return this.currentApplication?.licences.every((licence) => {
        return licence.licenceDetails?.every(
          (detail) =>
            LicenceService.isOperationalSpacesValid(detail.operationalSpaces) &&
            LicenceService.isEnrolledSpacesValid(detail.enrolledSpaces) &&
            LicenceService.isWeeksInOperationValid(detail.weeksInOperation) &&
            !isEmpty(detail.operationFromTime) &&
            !isEmpty(detail.operationToTime) &&
            !isEmpty(detail.weekDays),
        )
      })
    },

    isSplitClassroomComplete() {
      return this.currentApplication?.licences.every((licence) => licence.licenceDetails?.every((detail) => LicenceService.isSplitClassRoomInfoValid(detail)))
    },

    isLicenceDocumentUploaded() {
      return this.currentApplication.licences.every((licence) => {
        const uploadedDocument = this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(licence?.licence))
        return !isEmpty(uploadedDocument)
      })
    },

    isHealthAuthorityReportUploaded() {
      const healthAuthorityReports = this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(DOCUMENT_TYPES.HEALTH_AUTHORITY_REPORT))
      return !isEmpty(healthAuthorityReports)
    },
    isPolicyProcedureManualUploaded() {
      const policyProcedureManual = this.currentApplication?.uploadedDocuments?.filter((document) => document.documentType?.includes(DOCUMENT_TYPES.POLICY_PROCEDURE_MANUAL))
      return !isEmpty(policyProcedureManual)
    },

    /*
      Operating Cost page
    */
    checkOperatingCostsComplete() {
      const isFacilityTypeRequiredDocsUploaded =
        (!this.isRentLease(this.currentApplication) && !this.isMortgageOwned(this.currentApplication)) ||
        (this.isRentLease(this.currentApplication) && this.checkRequiredDocsExist(this.currentApplication, [DOCUMENT_TYPES.RENT_LEASE_AGREEMENT])) ||
        (this.isMortgageOwned(this.currentApplication) && this.checkRequiredDocsExist(this.currentApplication, [DOCUMENT_TYPES.MORTGAGE_STATEMENT]))
      const areCostsPositive = this.currentApplication?.totalYearlyOperatingCosts + this.currentApplication?.totalYearlyFacilityCosts > 0
      const isRentLeaseInformationComplete =
        !this.isRentLease(this.currentApplication) ||
        (this.currentApplication?.armsLength === YES_NO_CHOICE_CRM_MAPPING.YES &&
          (this.currentApplication?.monthToMonthRentLease === YES_NO_CHOICE_CRM_MAPPING.YES ||
            (this.currentApplication?.rentLeaseStartDate && this.currentApplication?.rentLeaseEndDate && this.currentApplication?.rentLeaseEndDate > this.currentApplication?.rentLeaseStartDate)))
      return this.currentApplication?.facilityType && isRentLeaseInformationComplete && isFacilityTypeRequiredDocsUploaded && areCostsPositive
    },

    checkRequiredDocsExist(application, requiredDocumentTypes) {
      return requiredDocumentTypes.every((type) => application.uploadedDocuments.some((doc) => doc.documentType === type))
    },

    isRentLease(application) {
      return application?.facilityType === FACILITY_TYPES.RENT_LEASE
    },

    isMortgageOwned(application) {
      return application?.facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE
    },

    /* 
      Staffing page
    */
    checkStaffingComplete() {
      return (
        this.isThereAtLeastOneEmployee(this.currentApplication) &&
        this.areEmployeeCertificatesComplete(this.currentApplication?.providerEmployees, this.currentApplication) &&
        this.isUnionSectionComplete(this.currentApplication) &&
        this.isCSSEASectionComplete(this.currentApplication)
      )
    },

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

    isOtherUnionSelected(application) {
      const appStore = useAppStore()
      return application?.unions?.includes(appStore.getUnionIdByName('Other'))
    },

    isUnionSectionComplete(application) {
      return application?.isUnionized === 0 || (!isEmpty(application?.unions) && (!this.isOtherUnionSelected(application) || !isEmpty(application?.unionDescription)))
    },

    isCSSEASectionComplete(application) {
      return application?.cssea != null
    },

    /*
      Declare Submit page
    */
    checkDeclareSubmitComplete() {
      return this.currentApplication?.applicationDeclaration
    },
  },
})
