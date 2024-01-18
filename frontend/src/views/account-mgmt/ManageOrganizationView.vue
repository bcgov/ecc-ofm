<template>
  <v-container fluid>
    <h1>Update Organization Information</h1>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Organization Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <OrganizationInfo :loading="loading" :organization="organization" :editable="true" class="mt-1" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0 pb-1">
        <h4>Facilities</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <v-row>
              <v-col cols="11">
                <v-card v-for="item in this.facilities" :key="item.facilityId" @click="navigateToFacility(item.facilityId)" class="facility-card mr-4">{{ item.name }}</v-card>
              </v-col>
              <v-col cols="3" md="1">
                <v-row justify="end">
                  <v-icon icon="fa:fa-regular fa-plus" class="mr-4"></v-icon>
                  <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
                </v-row>
              </v-col>
            </v-row>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AppButton :primary="false" size="large" width="400px" :to="{ name: 'account-mgmt' }">
          <v-icon class="pb-1">mdi-arrow-left</v-icon>
          Back to Account Management
        </AppButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import OrganizationService from '@/services/organizationService'
import alertMixin from '@/mixins/alertMixin'
import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ManageOrganizationView',
  components: { AppButton, OrganizationInfo },
  mixins: [alertMixin],
  data() {
    return {
      facilities: [],
      loading: false,
      organization: undefined,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    await this.loadData()
  },
  methods: {
    /**
     * Load the data for the page
     */
    async loadData() {
      try {
        this.loading = true
        await Promise.all([this.loadFacilities(), this.getOrganization()])
      } finally {
        this.loading = false
      }
    },

    /**
     * Loads the facilities for the organization
     */
    async loadFacilities() {
      try {
        this.facilities = await OrganizationService.getOrganizationFacilities(this.userInfo.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get facilities for organizationId = ' + this.userInfo.organizationId, error)
      }
    },

    async getOrganization() {
      try {
        this.organization = await OrganizationService.getOrganization(this.userInfo?.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      }
    },

    /**
     * Navigates to the Manage Facility page
     */
    navigateToFacility(facilityId) {
      this.$router.push({ name: 'manage-facility', params: { facilityId } })
    },
  },
}
</script>

<style>
.facility-card {
  display: inline-block;
  vertical-align: top;
  min-width: 200px;
  max-width: 300px;
  padding: 8px;
  margin: 4px;
}
</style>
