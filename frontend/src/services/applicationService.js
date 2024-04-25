import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import FundingAgreementService from '@/services/fundingAgreementService'
import { useApplicationsStore } from '@/stores/applications'
import { useAuthStore } from '@/stores/auth'
import { ApiRoutes } from '@/utils/constants'
import { APPLICATION_STATUS_CODES, CRM_STATE_CODES } from '@/utils/constants'

function sortApplications(applications) {
  applications?.sort((app1, app2) => {
    return new Date(app2.latestActivity) - new Date(app1.latestActivity)
  })
}

export default {
  async getApplicationsByFacilityId(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.APPLICATIONS}?facilityId=${facilityId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of applications by facility id - ${error}`)
      throw error
    }
  },

  async getApplications() {
    try {
      const authStore = useAuthStore()
      const facilities = authStore?.userInfo?.facilities
      let applications = []
      await Promise.all(
        facilities?.map(async (facility) => {
          const response = await this.getApplicationsByFacilityId(facility.facilityId)
          applications = applications?.concat(response)
        }),
      )
      sortApplications(applications)
      return applications
    } catch (error) {
      console.log(`Failed to get the applications - ${error}`)
      throw error
    }
  },

  async getApplication(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.APPLICATIONS + '/' + applicationId)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the application by application id - ${error}`)
      throw error
    }
  },

  isApplicationUpdated(updatedApplication) {
    const applicationsStore = useApplicationsStore()
    const currentApplication = applicationsStore?.currentApplication
    const index = Object.entries(updatedApplication)?.findIndex(([key, value]) => key in currentApplication && currentApplication[key] != value)
    return index > -1
  },

  async updateApplication(applicationId, payload) {
    try {
      if (!applicationId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.put(ApiRoutes.APPLICATIONS + '/' + applicationId, payload)
      return response
    } catch (error) {
      console.log(`Failed to update the application - ${error}`)
      throw error
    }
  },

  async createApplication(payload) {
    try {
      if (isEmpty(payload)) return
      const response = await ApiService.apiAxios.post(ApiRoutes.APPLICATIONS + '/', payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create a new application - ${error}`)
      throw error
    }
  },

  async getSupplementaryApplications(applicationId, filterQuery) {
    try {
      if (!applicationId) return
      let url = `${ApiRoutes.SUPPLEMENTARY_APPLICATIONS}/${applicationId}`
      if (filterQuery) {
        url += `?${filterQuery}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application by application id - ${error}`)
      throw error
    }
  },

  async getSupplementaryApplicationsForForm(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(ApiRoutes.SUPPLEMENTARY_APPLICATIONS + '/' + applicationId)
      //clean up the fields I don't need
      response?.data?.forEach((application) => {
        delete application.supplementaryReferenceNumber
        delete application.supplementaryApplicationStatus
        delete application.supplementaryApplicationSubmittedDate
        delete application.supplementaryTypeDescription
        delete application.ministryLastUpdated
        delete application.providerLastUpdated
        delete application.latestActivityDate
        delete application.stateCode
        delete application.applicationId
      })

      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application by application id - ${error}`)
      throw error
    }
  },

  async createSupplementaryApplication(payload) {
    try {
      const response = await ApiService.apiAxios.post(ApiRoutes.SUPPLEMENTARY_APPLICATIONS + '/', payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create a new application - ${error}`)
      throw error
    }
  },

  async updateSupplementaryApplication(applicationId, payload) {
    try {
      if (!applicationId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.patch(ApiRoutes.SUPPLEMENTARY_APPLICATIONS + '/' + applicationId, payload)
      return response
    } catch (error) {
      console.log(`Failed to update the application - ${error}`)
      throw error
    }
  },

  async deleteSupplementaryApplication(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.delete(ApiRoutes.SUPPLEMENTARY_APPLICATIONS + '/' + applicationId)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application by application id - ${error}`)
      throw error
    }
  },

  isValidApplication(application) {
    return this.checkApplicationStatus(application) && this.checkFundingAgreement(application?.fundingAgreement)
  },

  checkApplicationStatus(application) {
    const isActive = application?.stateCode === CRM_STATE_CODES.ACTIVE
    const hasCorrectStatus = [APPLICATION_STATUS_CODES.SUBMITTED, APPLICATION_STATUS_CODES.IN_REVIEW, APPLICATION_STATUS_CODES.APPROVED, APPLICATION_STATUS_CODES.AWAITING_PROVIDER].includes(
      application?.statusCode,
    )
    return isActive && hasCorrectStatus
  },

  checkFundingAgreement(fundingAgreement) {
    const isUnexpired = new Date() < new Date(fundingAgreement?.endDate)
    return fundingAgreement?.stateCode === CRM_STATE_CODES.ACTIVE && isUnexpired
  },

  async hasActiveApplicationOrFundingAgreement(facilities = []) {
    const results = await Promise.all(
      facilities.map(async (facility) => {
        const applications = await this.getApplicationsByFacilityId(facility.facilityId)
        return applications?.some(async (application) => {
          application.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(application.applicationId)
          return this.checkApplicationStatus(application) || this.checkFundingAgreement(application?.fundingAgreement)
        })
      }),
    )
    return results.some((result) => result)
  },
}
