<template>
  <v-container fluid>
    <v-row>
      <v-col class="ml-6 mt-10 pb-0">
        <h4>Organization Details</h4>
      </v-col>
      <v-col v-if="isAccountManager" class="ml-6 mt-6 pb-0">
        <v-row no-gutters justify="end">
          <AppButton size="large" width="300px" :loading="isLoading()" @click="openChangeRequestDialog()">Submit a Change Request</AppButton>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <OrganizationInfo
          ref="organizationInfo"
          :loadingAll="loading"
          :loadingInclusionPolicy="loadingInclusionPolicy"
          :editable="isAccountManager"
          :organization="organization"
          :uploadedDocuments="uploadedDocuments"
          @saveInclusionPolicyData="saveInclusionPolicyData"
          class="mt-1" />
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
                <v-expansion-panels v-if="otherFacilities?.length > 0" v-model="panelOtherFacilities" multiple>
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
        <AppBackButton width="400px" :to="{ name: 'account-mgmt' }" :loading="isLoading()">Account Management</AppBackButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import OrganizationService from '@/services/organizationService'
import DocumentService from '@/services/documentService'
import alertMixin from '@/mixins/alertMixin'
import rolesMixin from '@/mixins/rolesMixin.js'
import { mapState } from 'pinia'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { isEmpty } from 'lodash'

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
      loadingInclusionPolicy: false,
      organization: undefined,
      uploadedDocuments: [],
      documentsToDelete: [],
      documentsToUpload: [],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    isAccountManager() {
      return this.hasRole(this.ROLES.ACCOUNT_MANAGEMENT)
    },
    accountManagerFacilities() {
      return this.userInfo.facilities
    },
    otherFacilities() {
      return this.facilities.filter((f) => !this.accountManagerFacilities.some(facility => facility.facilityId === f.facilityId))
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
        await Promise.all([this.loadFacilities(), this.getOrganization(), this.getInclusionPolicyDocuments()])
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
        this.organization = await OrganizationService.getOrganization(this.userInfo.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get your organization information', error)
      }
    },

    async getInclusionPolicyDocuments() {
      try {
        this.uploadedDocuments = await DocumentService.getDocuments(this.userInfo.organizationId)
      } catch (error) {
        this.setFailureAlert('Failed to get organization\'s Inclusion Policy Document(s)', error)
        return
      }
    },

    /**
     * Navigates to the Manage Facility page
     */
    navigateToFacility(facilityId) {
      this.$router.push({ name: 'manage-facility', params: { facilityId } })
    },

    /**
     * Open the Change Request dialog
     */
    openChangeRequestDialog() {
      this.setWarningAlert('This feature will be implemented in a future sprint')
    },

    async saveOrganization(updatedOrganization) {
      try {
        await OrganizationService.updateOrganization(this.organization.organizationId, updatedOrganization)
        this.organization = updatedOrganization
      } catch (error) {
        this.setFailureAlert('Failed update Inclusion Policy on Organization: ' + this.organization.organizationId, error)
        return
      }
    },

    async saveInclusionPolicyData(updatedOrganization, documentsToUpload, documentsToDelete) {
      this.loadingInclusionPolicy = true
      this.documentsToUpload = documentsToUpload
      this.documentsToDelete = documentsToDelete
      try {
        await this.saveOrganization(updatedOrganization)
        await this.processDocuments()
        await this.getInclusionPolicyDocuments()
        this.$refs.organizationInfo.resetData()
        this.setSuccessAlert('Inclusion Policy updated successfully')
      } finally {
        this.loadingInclusionPolicy = false
      }
    },

    async processDocuments() {
      try {
        if (!isEmpty(this.documentsToUpload)) {
          await DocumentService.createDocuments(this.documentsToUpload, this.userInfo.organizationId)
          this.documentsToUpload = []
        }
        if (!isEmpty(this.documentsToDelete)) {
          await Promise.all(
            this.documentsToDelete.map(async (documentId) => {
              await DocumentService.deleteDocument(documentId)
            }),
          )
          this.documentsToDelete = []
        }
      } catch (error) {
        this.setFailureAlert('Failed Inclusion Policy Document(s) update on Organization: ' + this.organization.organizationId, error)
        return
      }
    },

    isLoading() {
      return this.loading || this.loadingInclusionPolicy
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
