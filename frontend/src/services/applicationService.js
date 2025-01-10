import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { useApplicationsStore } from '@/stores/applications'
import { useAuthStore } from '@/stores/auth'
import { APPLICATION_STATUS_CODES, ApiRoutes, CRM_STATE_CODES } from '@/utils/constants'

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

  async getActiveApplicationsByFacilityId(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.APPLICATIONS}?facilityId=${facilityId}&stateCode=${CRM_STATE_CODES.ACTIVE}`
      )
      return response?.data
    } catch (error) {
      console.log(`Failed to get the list of applications by facility id - ${error}`)
      throw error
    }
  },

  async getApprovedApplicationsCountByFacilityId(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.APPLICATIONS}/applications-count?facilityId=${facilityId}&statusCode=${APPLICATION_STATUS_CODES.APPROVED}`
      )
      return response?.data[0]?.count
    } catch (error) {
      console.log(`Failed to get the list of approved applications by facility id - ${error}`)
      throw error
    }
  },

  async getRedirectedApplications(facilities) {
    try {
      let applications = []
      await Promise.all(
        facilities?.map(async (facility) => {
          const response = await ApiService.apiAxios.get(
            `${ApiRoutes.APPLICATIONS}?facilityId=${facility?.facilityId}&stateCode=${CRM_STATE_CODES.INACTIVE}` +
              `&statusCode=${APPLICATION_STATUS_CODES.REDIRECTED}`
          )
          applications = applications?.concat(response?.data)
        })
      )
      return applications
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
        })
      )
      sortApplications(applications)
      return applications
    } catch (error) {
      console.log(`Failed to get the applications - ${error}`)
      throw error
    }
  },

  async getActiveApplications() {
    try {
      const authStore = useAuthStore()
      const facilities = authStore?.userInfo?.facilities
      let applications = []
      await Promise.all(
        facilities?.map(async (facility) => {
          const response = await this.getActiveApplicationsByFacilityId(facility.facilityId)
          applications = applications?.concat(response)
        })
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

  async getApplicationPDF(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.APPLICATIONS}/${applicationId}/pdf`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the application PDF by application id - ${error}`)
      throw error
    }
  },

  isApplicationUpdated(updatedApplication) {
    const applicationsStore = useApplicationsStore()
    const currentApplication = applicationsStore?.currentApplication
    const index = Object.entries(updatedApplication)?.findIndex(
      ([key, value]) => key in currentApplication && currentApplication[key] != value
    )
    return index > -1
  },

  async updateApplication(applicationId, payload) {
    try {
      if (!applicationId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.patch(ApiRoutes.APPLICATIONS + '/' + applicationId, payload)
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

  async getSupplementaryApplicationById(supplementaryApplicationId) {
    try {
      const response = await ApiService.apiAxios.get(
        ApiRoutes.SUPPLEMENTARY_APPLICATIONS + '/' + supplementaryApplicationId + '/details'
      )
      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application by supplementary id  - ${error}`)
      throw error
    }
  },

  async getSupplementaryApplicationsByDate(applicationId, statusCode, startDateFrom, startDateTo, pcmValidated) {
    try {
      if (!applicationId) return
      let url = `${ApiRoutes.SUPPLEMENTARY_APPLICATIONS}/${applicationId}`
      if (statusCode) {
        url += `?statusCode=${statusCode}`
      }
      if (startDateFrom) {
        url += `&dateFrom=${startDateFrom}`
      }
      if (startDateTo) {
        url += `&dateTo=${startDateTo}`
      }
      if (pcmValidated) {
        url += '&pcmValidated=true'
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application by application id and date - ${error}`)
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
      const response = await ApiService.apiAxios.patch(
        ApiRoutes.SUPPLEMENTARY_APPLICATIONS + '/' + applicationId,
        payload
      )
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

  async getSupplementaryApplicationPDF(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.SUPPLEMENTARY_APPLICATIONS}/${applicationId}/pdf`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the supp application PDF by application id - ${error}`)
      throw error
    }
  },

  async getApprovedSupplementaryPDF(applicationId) {
    try {
      if (!applicationId) return
      const response = await ApiService.apiAxios.get(
        `${ApiRoutes.SUPPLEMENTARY_APPLICATIONS}/${applicationId}/approved-pdf`
      )
      return response?.data
    } catch (error) {
      console.log(`Failed to get the approved supp application PDF by application id - ${error}`)
      throw error
    }
  },

  isValidApplication(application) {
    return this.checkApplicationStatus(application) && this.checkFundingAgreement(application?.fundingAgreement)
  },

  checkApplicationStatus(application) {
    const isActive = application?.stateCode === CRM_STATE_CODES.ACTIVE
    const hasCorrectStatus = [
      APPLICATION_STATUS_CODES.SUBMITTED,
      APPLICATION_STATUS_CODES.IN_REVIEW,
      APPLICATION_STATUS_CODES.APPROVED,
      APPLICATION_STATUS_CODES.AWAITING_PROVIDER,
      APPLICATION_STATUS_CODES.VERIFIED
    ].includes(application?.statusCode)
    return isActive && hasCorrectStatus
  },

  checkFundingAgreement(fundingAgreement) {
    const isUnexpired = new Date() < new Date(fundingAgreement?.endDate)
    return fundingAgreement?.stateCode === CRM_STATE_CODES.ACTIVE && isUnexpired
  },

  async hasApprovedApplication(facilities = []) {
    const results = await Promise.all(
      facilities.map(async (facility) => {
        const approvedApplicationsCount = await this.getApprovedApplicationsCountByFacilityId(facility.facilityId)
        return approvedApplicationsCount > 0
      })
    )
    return results.some((result) => result)
  },

  async createEmployeeCertificate(payload) {
    try {
      if (isEmpty(payload)) return
      const response = await ApiService.apiAxios.post(`${ApiRoutes.APPLICATIONS}/employeeCertificate`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create a new employee certificate - ${error}`)
      throw error
    }
  },

  async updateEmployeeCertificate(certificate) {
    try {
      if (!certificate?.providerEmployeeId) return
      const payload = {
        initials: certificate?.initials,
        certificateNumber: certificate?.certificateNumber
      }
      const response = await ApiService.apiAxios.patch(
        `${ApiRoutes.APPLICATIONS}/employeeCertificate/${certificate?.providerEmployeeId}`,
        payload
      )
      return response
    } catch (error) {
      console.log(`Failed to update the employee certificate - ${error}`)
      throw error
    }
  },

  async deleteEmployeeCertificate(certificate) {
    try {
      if (!certificate?.providerEmployeeId) return
      const response = await ApiService.apiAxios.delete(
        `${ApiRoutes.APPLICATIONS}/employeeCertificate/${certificate?.providerEmployeeId}`
      )
      return response?.data
    } catch (error) {
      console.log(`Failed to delete the employee certificate - ${error}`)
      throw error
    }
  }
}
