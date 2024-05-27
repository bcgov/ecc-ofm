import moment from 'moment'
import { defineStore } from 'pinia'

import ApiService from '@/common/apiService'
import AuthService from '@/common/authService'
import { useAppStore } from '@/stores/app'
import { APPLICATION_INTAKE_TYPES, OFM_PROGRAM_CODES, ROLES } from '@/utils/constants'

export const useAuthStore = defineStore('auth', {
  namespaced: true,
  state: () => ({
    isAuthenticated: localStorage.getItem('jwtToken') !== null,
    isMinistryUser: false,
    isImpersonating: false,
    isUserInfoLoaded: false,
    userInfo: null,
    impersonateId: null,
    currentFacility: {},
    permissions: [],
  }),
  getters: {
    isActingProvider: (state) => !state.isMinistryUser || state.isImpersonating,
    hasFacilities: (state) => state.userInfo?.facilities?.length > 0,
    hasPermission: (state) => {
      return (permission) => {
        return state.permissions?.some((p) => p === permission)
      }
    },
  },
  actions: {
    //sets Json web token and determines whether user is authenticated
    async setJwtToken(token = null) {
      if (token) {
        this.isAuthenticated = true
        localStorage.setItem('jwtToken', token)
      } else {
        this.isAuthenticated = false
        localStorage.removeItem('jwtToken')
      }
    },
    //sets the token required for refreshing expired json web tokens
    async logout() {
      localStorage.removeItem('jwtToken')
      this.userInfo = null
      this.isAuthenticated = false
    },
    async getUserInfo() {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        await this.getJwtToken()
      }
      if (localStorage.getItem('jwtToken')) {
        if (!this.isUserInfoLoaded) {
          const appStore = useAppStore()
          let userInfoRes = undefined
          if (this.impersonateId && this.isMinistryUser) {
            userInfoRes = await ApiService.getUserImpersonateInfo(this.impersonateId)
            this.isImpersonating = true
          } else {
            userInfoRes = await ApiService.getUserInfo()
            this.isMinistryUser = userInfoRes.data.isMinistryUser
            delete userInfoRes.data.isMinistryUser
          }
          this.userInfo = userInfoRes.data
          // Default the facility
          if (this.isActingProvider && this.hasFacilities) {
            this.currentFacility = this.userInfo.facilities[0]
          }
          
          // Lookup the permissions
          let role
          if (this.isImpersonating) {
            // When impersonating always use 'Impersonate', not the impersonated user's role
            role = appStore.roles.find((role) => role.roleName === ROLES.IMPERSONATE)
          } else {
            role = appStore.roles.find((role) => role.roleId === this.userInfo.role?.ofm_portal_roleid)
          }
          this.permissions = role?.permissions.map((p) => p.permissionName)

          /*
            A facility can apply for a core application if it satisfies these conditions:
            1. There is an Open Intake or the facility is in the allowed facility list of a Limited Intake
            2. If the facility is in the CCOF program, their program start date must >= 1 year from the current date.
          */
          this.userInfo?.facilities?.forEach((facility) => {
            facility.intakeWindowCheckForAddApplication = appStore.applicationIntakes?.some((intake) => {
              const isWithinApplicationIntakeWindow = moment().isSameOrAfter(moment(intake.startDate)) && moment().isSameOrBefore(moment(intake.endDate))
              const isOpenIntake = intake.type === APPLICATION_INTAKE_TYPES.OPEN_INTAKE
              const limitedIntakeFacilities = intake?.facilities?.map((facility) => facility.facilityId)
              return isWithinApplicationIntakeWindow && (isOpenIntake || limitedIntakeFacilities?.includes(facility.facilityId))
            })
            facility.ccofEnrolmentCheckForAddApplication = facility?.programCode !== OFM_PROGRAM_CODES.CCOF || (facility?.programCode === OFM_PROGRAM_CODES.CCOF && facility?.ccofOneYearEnrolment)
          })

          this.isUserInfoLoaded = true
        }
      }
    },
    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken() {
      try {
        const token = localStorage.getItem('jwtToken')
        if (this.isAuthenticated && !!token) {
          const response = await AuthService.refreshAuthToken(token)
          await this.setAuthorizations(response)
        } else {
          const response = await AuthService.getAuthToken()
          await this.setAuthorizations(response)
        }
      } catch (e) {
        // Remove tokens from localStorage and update state
        await this.setJwtToken(null)
        throw e
      }
    },
    async setAuthorizations(response) {
      if (response.jwtFrontend) {
        await this.setJwtToken(response.jwtFrontend)
      }
      ApiService.setAuthHeader(response.jwtFrontend)
    },
  },
})
