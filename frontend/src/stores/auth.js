import { defineStore } from 'pinia'

import ApiService from '@/common/apiService'
import AuthService from '@/common/authService'

import { useAppStore } from './app'

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
  }),
  getters: {
    isActingProvider: (state) => !state.isMinistryUser || state.isImpersonating,
    hasFacilities: (state) => state.userInfo?.facilities?.length > 0,
    hasRole: (state) => {
      return (role) => state.userInfo?.role === role
    },
    hasPermission: (state) => {
      return (permission) => {
        const appStore = useAppStore()
        const matchingRole = appStore.roles.find((role) => role.roleId === state.userInfo.role?.ofm_portal_roleid)
        return matchingRole?.permissions.some((p) => p.permissionName === permission)
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
          // XXX When this code is called the roles may not be loaded from the appStore
          // So don't bother keeping permissions in the store
          //this.permissions = appStore.roles.find((role) => role.roleId === this.userInfo.role.ofm_portal_roleid)?.permissions.map((p) => p.permissionName)

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
