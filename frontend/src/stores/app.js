import { defineStore } from 'pinia'

import LookupService from '@/services/lookupService'

export const useAppStore = defineStore('app', {
  namespaced: true,
  state: () => ({
    backendError: '',

    // Alert Notifications
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,

    // Lookup data from Dynamics365
    requestCategories: {},
    requestSubCategories: {},
    roles: {},
    healthAuthorities: {},
    facilityTypes: {},
    licenceTypes: {},
    // reportTemplates: {},
    applicationIntakes: {},
    paymentTypes: {},
  }),
  getters: {
    getRoleNameById: (state) => {
      return (id) => {
        const role = state.roles?.find((role) => role.roleId === id)
        return role?.roleName
      }
    },
    getLicenceTypeNameById: (state) => {
      return (id) => {
        const licenceType = state.licenceTypes?.find((licenceType) => licenceType.id === id)
        return licenceType?.description
      }
    },
    getHealthAuthorityNameById: (state) => {
      return (id) => {
        const healthAuthority = state.healthAuthorities?.find((healthAuthority) => healthAuthority.id === id)
        return healthAuthority?.description
      }
    },
    getFacilityTypeNameById: (state) => {
      return (id) => {
        const facilityType = state.facilityTypes?.find((facilityType) => facilityType.id === id)
        return facilityType?.description
      }
    },
    getRequestCategoryIdByName: (state) => {
      return (categoryName) => {
        const requestCategory = state.requestCategories?.find((requestCategory) => requestCategory.categoryName === categoryName)
        return requestCategory?.categoryId
      }
    },
    getRequestSubCategoryIdByName: (state) => {
      return (categoryName) => {
        const requestSubCategory = state.requestSubCategories?.find((requestSubCategory) => requestSubCategory.categoryName === categoryName)
        return requestSubCategory?.subCategoryId
      }
    },
  },
  actions: {
    async getLookupInfo() {
      if (localStorage.getItem('jwtToken')) {
        // DONT Call api if there is no token.
        const lookupInfo = await LookupService.getLookupInfo()
        this.requestCategories = lookupInfo?.data?.requestCategories
        this.requestSubCategories = lookupInfo?.data?.requestSubCategories
        this.roles = lookupInfo?.data?.roles
        this.healthAuthorities = lookupInfo?.data?.healthAuthorities
        this.facilityTypes = lookupInfo?.data?.facilityTypes
        this.licenceTypes = lookupInfo?.data?.licenceTypes
        // this.reportTemplates = lookupInfo?.data?.reportTemplates
        this.applicationIntakes = lookupInfo?.data?.applicationIntakes
        this.paymentTypes = lookupInfo?.data?.paymentTypes
      }
    },
    async setAlertNotificationText(alertNotificationText) {
      this.alertNotificationText = alertNotificationText
    },
    async setAlertNotification(alertNotification) {
      this.alertNotification = alertNotification
    },
    async addAlertNotification(text) {
      this.alertNotificationQueue.push(text)
      if (!this.alertNotification) {
        this.alertNotification = true
      }
    },
  },
})
