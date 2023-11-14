import { defineStore } from 'pinia'

import ApiService from '@/common/apiService'
import AuthService from '@/common/authService'

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
    // TODO: once roles are established more clearly, need to address isAuthorizedUser and general role impleentation design...
    //isAuthorizedUser: localStorage.getItem('isAuthorizedUser') !== null,
    isValidChildCareProviderUser: localStorage.getItem('iisValidChildCareProviderUser') !== null,
    isValdProgramUser: localStorage.getItem('isValdProgramUser') !== null,
    isValidFinancialOpsUser: localStorage.getItem('isValidFinancialOpsUser') !== null,
  }),
  getters: {
    isActingProvider: (state) => !state.isMinistryUser || state.isImpersonating,
    hasRoles: (state) => state.userInfo && state.userInfo.roles && state.userInfo.roles.length > 0,
    hasFacilities: (state) => state.userInfo && state.userInfo.facilities && state.userInfo.facilities.length > 0,
    //TODO: 3 temp roles ('CCP_ROLE', 'OPS_ROLE', 'PCM_ROLE') were created in auth.js (loosely
    //based on OFM requirements) for the purpose of achieving a 1st draft of the frontend that
    //will render a home screen and menu with minimal errors given no authorization/backend integration.
    //Thus the following related code is only temporarly and expected to be replaced...
    CCP_ROLE: (state) => state.isValidChildCareProviderUser,
    OPS_ROLE: (state) => state.isValdProgramUser,
    PCM_ROLE: (state) => state.isValidFinancialOpsUser,
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
    // TODO Remove setter. Just use state
    async setAuthorizedUser(isAdminUser) {
      if (isAdminUser) {
        this.isAuthorizedUser = true
        localStorage.setItem('isAuthorizedUser', 'true')
      } else {
        this.isAuthorizedUser = false
        localStorage.removeItem('isAuthorizedUser')
      }
    },
    // TODO Remove setter. Just use state
    async setAuthorizedWebsocketUser(isAuthorizedWebsocketUser) {
      if (isAuthorizedWebsocketUser) {
        this.isAuthorizedWebsocketUser = true
        localStorage.setItem('isAuthorizedWebsocketUser', 'true')
      } else {
        this.isAuthorizedWebsocketUser = false
        localStorage.removeItem('isAuthorizedWebsocketUser')
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

      // TODO: Once roles are more clear need to sort out this logic...
      await this.setAuthorizedUser(response.isAuthorizedUser)
      await this.setChildCareProviderUser(true)
      await this.setProgramUser(true)
      await this.setFinancialOpsUser(true)
    },

    // TODO: Temp placeholder code for OFM authorization role processing...
    async setChildCareProviderUser(isValidChildCareProviderUser) {
      if (isValidChildCareProviderUser) {
        this.isValidChildCareProviderUser = true
        localStorage.setItem('isValidChildCareProviderUser', 'true')
      } else {
        this.isValidChildCareProviderUser = false
        localStorage.removeItem('isValidChildCareProviderUser')
      }
    },
    // TODO: Temp placeholder code for OFM authorization role processing...
    async setProgramUser(isValdProgramUser) {
      if (isValdProgramUser) {
        this.isValdProgramUser = true
        localStorage.setItem('isValdProgramUser', 'true')
      } else {
        this.isValdProgramUser = false
        localStorage.removeItem('isValdProgramUser')
      }
    },
    // TODO: Temp placeholder code for OFM authorization role processing...
    async setFinancialOpsUser(isValidFinancialOpsUser) {
      if (isValidFinancialOpsUser) {
        this.isValidFinancialOpsUser = true
        localStorage.setItem('isValidFinancialOpsUser', 'true')
      } else {
        this.isValidFinancialOpsUser = false
        localStorage.removeItem('isValidFinancialOpsUser')
      }
    },
  },
})
