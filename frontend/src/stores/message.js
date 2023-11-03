import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import { defineStore } from 'pinia'

/* TODO: If file is indeed common functionality (i.e. see header comment), then uncomment during integration with backend...
import { appStore } from '@/store/modules/app';
*/

export const useMessageStore = defineStore('message', {
  namespaced: true,
  state: () => ({
  }),
  actions: {
    async submitNewAssistanceRequest(payload) {
      try {
        let response = await ApiService.apiAxios.post(ApiRoutes.MESSAGE + '/newAssistanceRequest', payload);
        return response?.data;
      } catch (error) {
        console.log(`Failed to create a new Assistance Request - ${error}`);
        throw error;
      }
    },
  }
})
