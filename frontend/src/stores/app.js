import { defineStore } from 'pinia'

import ApiService from '@/common/apiService'

export const useAppStore = defineStore('app', {
  namespaced: true,
  state: () => ({
    // TODO (weskubo-cgi) Remove unused state
    request: {},
    selectedRequest: null,
    messages: [],
    subtitleBanner: '',
    stickyInfoPanelHeight: null,

    // Alert Notifications
    alertNotificationText: '',
    alertNotificationQueue: [],
    alertNotification: false,

    // Lookup data from Dynamics365
    requestCategories: {},
    userRoles: {},
    healthAuthorities: {},
    facilityTypes: {},

    config: '',
  }),
  getters: {
    getRoleNameById: (state) => {
      return (id) => {
        const role = state.userRoles.find((role) => role.id === id)
        return role ? role.description : null
      }
    },
  },
  actions: {
    async getLookupInfo() {
      if (localStorage.getItem('jwtToken')) {
        // DONT Call api if there is no token.
        const lookupInfo = await ApiService.getLookupInfo()
        this.requestCategories = lookupInfo?.data?.requestCategories
        this.userRoles = lookupInfo?.data?.userRoles
        this.healthAuthorities = lookupInfo?.data?.healthAuthorities
        this.facilityTypes = lookupInfo?.data?.facilityTypes
      }
    },
    async setConfig(config) {
      this.config = config
    },
    async setRequest(request) {
      this.request = request || {}
    },
    async setSelectedRequest(selectedRequest) {
      this.selectedRequest = selectedRequest
    },
    async pushMessage(message) {
      this.messages.push(message)
    },
    async setMessages(messages) {
      this.messages = messages || []
    },
    async setStickyInfoPanelHeight(stickyInfoPanelHeight) {
      this.stickyInfoPanelHeight = stickyInfoPanelHeight
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
    async getConfig() {
      const response = await ApiService.getConfig()
      await this.setConfig(response.data)
    },
    async refreshEntities() {
      if (localStorage.getItem('jwtToken')) {
        // DONT Call api if there is not token.
        /*TODO: fresh data from backend i.e....
        const responseActiveSchools = await ApiService.getActiveSchools();
        await this.setActiveSchools(responseActiveSchools.data);
        const responseDistricts = await ApiService.getDistricts();
        await this.setDistricts(responseDistricts.data);
        */
      }
    },
  },
})
