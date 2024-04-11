<template>
  <v-container fluid>
    <v-row>
      <v-col class="ml-6 mt-10 pb-0">
        <h4>Organization Details</h4>
      </v-col>
      <v-col v-if="isAccountManager" class="ml-6 mt-6 pb-0">
        <v-row no-gutters justify="end">
          <AppButton size="large" width="300px" :loading="loading" @click="validateOfmProgram()">Submit a Change Request</AppButton>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <OrganizationInfo
          :loading="loading"
          :editable="isAccountManager"
          :organization="organization"
          :showDocuments="true"
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
        <AppBackButton width="400px" :to="{ name: 'account-mgmt' }" :loading="loading">Account Management</AppBackButton>
      </v-col>
    </v-row>
    <NewRequestDialog
      class="pa-0"
      :show="showChangeRequestDialog"
      :defaultRequestCategoryId="getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.ACCOUNT_MAINTENANCE)"
      @close="toggleChangeRequestDialog" />
    <UnableToSubmitCrDialog
      :show="showUnableToSubmitCrDialog"
      :displayType="preventChangeRequestType"
      @close="toggleUnableToSubmitCrDialog" />
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import OrganizationService from '@/services/organizationService'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import UnableToSubmitCrDialog from '@/components/account-mgmt/UnableToSubmitCrDialog.vue'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import alertMixin from '@/mixins/alertMixin'
import rolesMixin from '@/mixins/rolesMixin.js'
import { mapState } from 'pinia'
import { mapActions } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { isEmpty } from 'lodash'
import { REQUEST_CATEGORY_NAMES, OFM_PROGRAM_CODES, PREVENT_CHANGE_REQUEST_TYPES, VIRUS_SCAN_ERROR_MESSAGE } from '@/utils/constants'

export default {
  name: 'ManageOrganizationView',
  components: { AppButton, AppBackButton, OrganizationInfo, NewRequestDialog, UnableToSubmitCrDialog },
  mixins: [alertMixin, rolesMixin],
  data() {
    return {
      facilities: [],
      panelYourFacilities: [0],
      panelOtherFacilities: [0],
      loading: false,
      organization: undefined,
      uploadedDocuments: [],
      showChangeRequestDialog: false,
      showUnableToSubmitCrDialog: false,
      preventChangeRequestType: undefined,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),

    isAccountManager() {
      return this.hasRole(this.ROLES.ACCOUNT_MANAGEMENT)
    },
    accountManagerFacilities() {
      return this.userInfo.facilities
    },
    otherFacilities() {
      return this.facilities.filter((f) => !this.accountManagerFacilities.some((facility) => facility.facilityId === f.facilityId))
    },
    hasAnOFMFacility() {
      return this.facilities.some(facility => facility.programCode === OFM_PROGRAM_CODES.OFM)
    },

  },
  async created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
    this.OFM_PROGRAM_CODES = OFM_PROGRAM_CODES
    this.PREVENT_CHANGE_REQUEST_TYPES = PREVENT_CHANGE_REQUEST_TYPES
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
        this.setFailureAlert("Failed to get organization's Inclusion Policy Document(s)", error)
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
    toggleChangeRequestDialog() {
      this.showChangeRequestDialog = !this.showChangeRequestDialog
    },

    async validateOfmProgram() {
      try {
        this.loading = true
        const hasActiveAppOrFunding = await ApplicationService.hasActiveApplicationOrFundingAgreement(this.userInfo.facilities)
        if (!this.hasAnOFMFacility && !hasActiveAppOrFunding) {
          this.preventChangeRequestType = PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM
          this.showUnableToSubmitCrDialog = true
          return
        }
        this.toggleChangeRequestDialog()
      } finally {
        this.loading = false
      }
    },

    async saveOrganization(updatedOrganization) {
      try {
        delete updatedOrganization.goodStandingStatus
        await OrganizationService.updateOrganization(this.organization.organizationId, updatedOrganization)
        this.organization = updatedOrganization
      } catch (error) {
        this.setFailureAlert('Failed update Inclusion Policy on Organization: ' + this.organization.organizationId, error)
        return
      }
    },

    async saveInclusionPolicyData(updatedOrganization, documentsToUpload, documentsToDelete, onSaveCompleteCallBack) {
      await this.saveOrganization(updatedOrganization)
      await this.processDocuments(documentsToUpload, documentsToDelete)
      await this.getInclusionPolicyDocuments()
      onSaveCompleteCallBack()
      this.setSuccessAlert('Inclusion Policy updated successfully')
    },

    async processDocuments(documentsToUpload, documentsToDelete) {
      try {
        if (!isEmpty(documentsToUpload)) {
          await DocumentService.createDocuments(documentsToUpload, this.userInfo.organizationId)
        }
        if (!isEmpty(documentsToDelete)) {
          await Promise.all(
            documentsToDelete.map(async (documentId) => {
              await DocumentService.deleteDocument(documentId)
            }),
          )
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          this.setFailureAlert(VIRUS_SCAN_ERROR_MESSAGE, error)
        } else {
          this.setFailureAlert(`Failed Inclusion Policy Document(s) update on Organization: ${this.organization.organizationId}`, error)
        }
      }
    },

    toggleUnableToSubmitCrDialog() {
      this.showUnableToSubmitCrDialog = !this.showUnableToSubmitCrDialog
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
