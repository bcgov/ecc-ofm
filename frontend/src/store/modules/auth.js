import ApiService from '@/common/apiService';
/* TODO: uncomment during integration with authservice...
import AuthService from '@/common/authService';
*/
import { Routes } from '@/utils/constants';
import {defineStore} from 'pinia';

export const authStore = defineStore('auth', {
  namespaced: true,
  state: () => ({
    acronyms: [],
    isAuthenticated: true  /* TODO: during integration with backend, replace true with... localStorage.getItem('jwtToken') !== null */,
    isAuthorizedUser: true /* TODO: during integration with backend, replace true with... localStorage.getItem('isAuthorizedUser') !== null */,
    userInfo: false,
    isValidChildCareProviderUser: localStorage.getItem('iisValidChildCareProviderUser') !== null,
    isValdProgramUser: localStorage.getItem('isValdProgramUser') !== null,
    isValidFinancialOpsUser: localStorage.getItem('isValidFinancialOpsUser') !== null,    
  }),
  getters: {
    acronymsGet: state => state.acronyms,
    isAuthenticatedGet: state => state.isAuthenticated,
    jwtTokenGet: () => localStorage.getItem('jwtToken'),
    userInfoGet: state => state.userInfo,
    //TODO: 3 temp roles ('CCP_ROLE', 'OPS_ROLE', 'PCM_ROLE') were created in auth.js (loosely
    //based on OFM requirements) for the purpose of achieving a 1st draft of the frontend that
    //will render a home screen and menu with minimal errors given no authorization/backend integration.
    //Thus the following related code is only temporarly and expected to be replaced...
    CCP_ROLE: state => state.isValidChildCareProviderUser,
    OPS_ROLE: state => state.isValdProgramUser,
    PCM_ROLE: state => state.isValidFinancialOpsUser
  },
  actions: {
    //sets Json web token and determines whether user is authenticated
    async setJwtToken(token = null) {
      if (token) {
        this.isAuthenticated = true;
        localStorage.setItem('jwtToken', token);
      } else {
        this.isAuthenticated = false;
        localStorage.removeItem('jwtToken');
      }
    },
    async setAuthorizedUser(isAdminUser){
      if (isAdminUser) {
        this.isAuthorizedUser = true;
        localStorage.setItem('isAuthorizedUser', 'true');
      } else {
        this.isAuthorizedUser = false;
        localStorage.removeItem(('isAuthorizedUser'));
      }
    },
    async setAuthorizedWebsocketUser(isAuthorizedWebsocketUser){
      if (isAuthorizedWebsocketUser) {
        this.isAuthorizedWebsocketUser = true;
        localStorage.setItem('isAuthorizedWebsocketUser', 'true');
      } else {
        this.isAuthorizedWebsocketUser = false;
        localStorage.removeItem(('isAuthorizedWebsocketUser'));
      }
    },
    async setUserInfo(userInf) {
      if (userInf) {
        this.userInfo = userInf;
      } else {
        this.userInfo = null;
      }
    },
    // TODO: method below is part of 1st draft of app framework and likely to be removed...
    async setChildCareProviderUser(isValidChildCareProviderUser) {
      if (isValidChildCareProviderUser) {
        this.isValidChildCareProviderUser = true;
        localStorage.setItem('isValidChildCareProviderUser', 'true');
      } else {
        this.isValidChildCareProviderUser = false;
        localStorage.removeItem(('isValidChildCareProviderUser'));
      }
    },
    // TODO: method below is part of 1st draft of app framework and likely to be removed...
    async setProgramUser(isValdProgramUser) {
      if (isValdProgramUser) {
        this.isValdProgramUser = true;
        localStorage.setItem('isValdProgramUser', 'true');
      } else {
        this.isValdProgramUser = false;
        localStorage.removeItem(('isValdProgramUser'));
      }
    },
      // TODO: method below is part of 1st draft of app framework and likely to be removed...
    async setFinancialOpsUser(isValidFinancialOpsUser) {
      if (isValidFinancialOpsUser) {
        this.isValidFinancialOpsUser = true;
        localStorage.setItem('isValidFinancialOpsUser', 'true');
      } else {
        this.isValidFinancialOpsUser = false;
        localStorage.removeItem(('isValidFinancialOpsUser'));
      }
    },
    //sets the token required for refreshing expired json web tokens
    async logoutState() {
      localStorage.removeItem('jwtToken');
      this.userInfo = false;
      this.isAuthenticated = false;
    },
    async getUserInfo() {
      const token = localStorage.getItem('jwtToken');

      if(!token){
        await this.getJwtToken();
      }

      if(localStorage.getItem('jwtToken')) {
        const response = await ApiService.apiAxios.get(Routes.USER);
        await this.setUserInfo(response.data);
      }
    },
    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken() {
      try {
        const token = localStorage.getItem('jwtToken');
        if (this.isAuthenticated && !!token) {
          /* TODO: uncomment during integration with authservice/backend...
          const response = await AuthService.refreshAuthToken(token);
          */
         //TODO: uncomment 'response' below during integration with backend...
          await this.setAuthorizations(/*response*/);
        } else {
          /* TODO: uncomment during integration with backend...
          const response = await AuthService.getAuthToken();
          */
         //TODO: uncomment 'response' below during integration with backend...
          await this.setAuthorizations(/*response*/);
        }
      } catch (e) {
        // Remove tokens from localStorage and update state
        await this.setJwtToken(null);
        throw e;
      }
    },
    //TODO: uncomment 'response' below during integration with authorization/backend...
    async setAuthorizations(/*response*/) {
    /* TODO: uncomment during integration with backend...
      if (response.jwtFrontend) {
        await this.setJwtToken(response.jwtFrontend);
      }

      ApiService.setAuthHeader(response.jwtFrontend);
    */
      await this.setAuthorizedUser(true);
      await this.setChildCareProviderUser(true);
      await this.setProgramUser(true);
      await this.setFinancialOpsUser(true);
    }
  }
});
