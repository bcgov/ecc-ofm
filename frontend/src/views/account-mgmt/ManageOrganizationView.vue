<template>
  <v-container fluid>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Organization Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <OrganizationInfo :loading="loading" :organization="organization" :editable="isAccountManager" class="mt-1" />
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
              <v-col v-if="isAccountManager">
                <v-expansion-panels v-model="panelYourFacilities" multiple class="pb-4">
                  <v-expansion-panel>
                    <v-expansion-panel-title class="header-label">
                      <h4>Your Facilities</h4>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-card v-for="item in accountManagerFacilities" :key="item.facilityId" @click="navigateToFacility(item.facilityId)" class="facility-card mr-4">{{ item.facilityName }}</v-card>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-expansion-panels v-show="otherFacilities?.length > 0" v-model="panelOtherFacilities" multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-title class="header-label">
                      <h4>Other Facilities (read-only)</h4>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-card v-for="item in otherFacilities" :key="item.facilityId" @click="navigateToFacility(item.facilityId)" class="facility-card mr-4">{{ item.name }}</v-card>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col v-else>
                <v-card v-for="item in facilities" :key="item.facilityId" @click="navigateToFacility(item.facilityId)" class="facility-card mr-4">{{ item.name }}</v-card>
              </v-col>
            </v-row>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AppBackButton width="400px" :to="{ name: 'account-mgmt' }">Account Management</AppBackButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import OrganizationService from '@/services/organizationService'
import alertMixin from '@/mixins/alertMixin'
import rolesMixin from '@/mixins/rolesMixin.js'
import { mapState } from 'pinia'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ManageOrganizationView',
  components: { AppButton, AppBackButton, OrganizationInfo },
  mixins: [alertMixin, rolesMixin],
  data() {
    return {
      facilities: [],
      panelYourFacilities: [0],
      panelOtherFacilities: [0],
      loading: false,
      organization: undefined,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    isAccountManager() {
      return this.hasRole(this.ROLES.ACCOUNT_MANAGEMENT)
    },
    accountManagerFacilities() {
      return this.userInfo.facilities.filter((f) => this.facilities.some(facility => facility.facilityId === f.facilityId))
    },
    otherFacilities() {
      return this.facilities.filter((f) => !this.userInfo.facilities.some(facility => facility.facilityId === f.facilityId))
    },

  },
  async created() {
    await this.loadData()
  },
  methods: {
    ...mapActions(useAuthStore, ['hasRole']),
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
