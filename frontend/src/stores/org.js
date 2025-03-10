import { defineStore } from 'pinia'

import OrganizationService from '@/services/organizationService'

export const useOrgStore = defineStore('org', {
  namespaced: true,
  state: () => ({
    currentOrg: undefined,
    organizationAndContacts: undefined,
  }),
  getters: {},
  actions: {
    async getOrganizationInfo(organizationId) {
      this.currentOrg = await OrganizationService.getOrganization(organizationId)
    },
    async getOrganizationFacilitiesAndContacts(organizationId) {
      this.organizationAndContacts = await OrganizationService.getOrganizationFacilitiesAndContacts(organizationId)
    },
  },
})
