import moment from 'moment'
import { defineStore } from 'pinia'

import ApiService from '@/common/apiService'

export const useAppStore = defineStore('app', {
  namespaced: true,
  state: () => ({
    // TODO (weskubo-cgi) Remove unused state
    subtitleBanner: '',

    // Alert Notifications
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,

    // Lookup data from Dynamics365
    requestCategories: {},
    requestSubCategories: {},
    // TODO (weskubo-cgi) Remove this
    userRoles: {},
    roles: {},
    healthAuthorities: {},
    facilityTypes: {},
    licenceTypes: {},
    reportQuestionTypes: {},
    fiscalYears: {},
    months: {},
  }),
  getters: {
    getRoleNameById: (state) => {
      return (id) => {
        const role = state.userRoles?.find((role) => role.id === id)
        return role?.description
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
    getReportQuestionTypeNameById: (state) => {
      return (id) => {
        const questionType = state.reportQuestionTypes?.find((questionType) => questionType.id === id)
        return questionType?.description
      }
    },
    getMonthIdByName: (state) => {
      return (monthName) => {
        const month = state.months?.find((month) => month.name === monthName)
        return month?.monthId
      }
    },
    getFiscalYearNameById: (state) => {
      return (id) => {
        const year = state.fiscalYears?.find((fiscalYear) => fiscalYear.fiscalYearId === id)
        return year?.name
      }
    },
    getFiscalYearIdByDate: (state) => {
      return (date) => {
        const year = state.fiscalYears?.find((fiscalYear) => moment(fiscalYear.startDate).isSameOrBefore(moment(date)) && moment(fiscalYear.endDate).isSameOrAfter(moment(date)))
        return year?.fiscalYearId
      }
    },
    getFiscalYearIdsByDates: (state) => {
      return (start, end) => {
        const startDate = moment(start)
        const endDate = moment(end)
        const years = state.fiscalYears?.filter(
          (fiscalYear) =>
            (moment(fiscalYear.startDate).isSameOrBefore(startDate) && moment(fiscalYear.endDate).isSameOrAfter(startDate)) ||
            (moment(fiscalYear.startDate).isSameOrBefore(endDate) && moment(fiscalYear.endDate).isSameOrAfter(endDate)) ||
            (moment(fiscalYear.startDate).isSameOrAfter(startDate) && moment(fiscalYear.endDate).isSameOrBefore(endDate)),
        )
        return years?.map((year) => year.fiscalYearId)
      }
    },
  },
  actions: {
    async getLookupInfo() {
      if (localStorage.getItem('jwtToken')) {
        // DONT Call api if there is no token.
        const lookupInfo = await ApiService.getLookupInfo()
        this.requestCategories = lookupInfo?.data?.requestCategories
        this.requestSubCategories = lookupInfo?.data?.requestSubCategories
        this.userRoles = lookupInfo?.data?.userRoles
        this.roles = lookupInfo?.data?.roles
        this.healthAuthorities = lookupInfo?.data?.healthAuthorities
        this.facilityTypes = lookupInfo?.data?.facilityTypes
        this.licenceTypes = lookupInfo?.data?.licenceTypes
        this.reportQuestionTypes = lookupInfo?.data?.reportQuestionTypes
        this.fiscalYears = lookupInfo?.data?.fiscalYears
        this.months = lookupInfo?.data?.months
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
