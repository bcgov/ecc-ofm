<template>
  <v-container fluid>
    <v-row class="pb-0">
      <v-col cols="12" lg="6" class="pb-0">
        <h4>Organization Details</h4>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.SUBMIT_CHANGE_REQUEST)" cols="12" lg="6" class="pb-0">
        <v-row no-gutters justify="end">
          <AppButton :loading="loading" @click="validateOfmProgram()">Submit a Change Request</AppButton>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <OrganizationInfo
          :loading="loading"
          :editable="hasPermission(PERMISSIONS.UPDATE_ORG_FACILITY)"
          :organization="organization"
          :show-documents="true"
          :uploaded-documents="uploadedDocuments"
          class="mt-1"
          @save-inclusion-policy-data="saveInclusionPolicyData" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <h4>Facilities</h4>
      </v-col>
    </v-row>
    <v-row v-if="isInformationMissing" class="ml-1">
      <v-icon color="amber" class="mr-2">mdi-alert</v-icon>
      <p>Important information missing</p>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="pa-6" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <v-row>
              <v-col v-if="hasPermission(PERMISSIONS.UPDATE_ORG_FACILITY)">
                <v-expansion-panels v-model="panelYourFacilities" multiple class="pb-4">
                  <v-expansion-panel>
                    <v-expansion-panel-title class="header-label">
                      <h4>Your Facilities</h4>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <ManageFacilityTable :facilities="userFacilities"></ManageFacilityTable>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
                <v-expansion-panels v-if="otherFacilities?.length > 0" v-model="panelOtherFacilities" multiple>
                  <v-expansion-panel>
                    <v-expansion-panel-title class="header-label">
                      <h4>Other Facilities (read-only)</h4>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <ManageFacilityTable :facilities="otherFacilities"></ManageFacilityTable>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
              <v-col v-else>
                <ManageFacilityTable :facilities="facilities"></ManageFacilityTable>
              </v-col>
            </v-row>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <AppBackButton max-width="450px" :to="{ name: 'account-mgmt' }" :loading="loading" class="mt-4">Account Management</AppBackButton>
    <template v-if="hasPermission(PERMISSIONS.VIEW_APPLICATIONS)">
      <NewRequestDialog
        class="pa-0"
        :show="showChangeRequestDialog"
        :default-request-category-id="getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.ACCOUNT_MAINTENANCE)"
        @close="toggleChangeRequestDialog"
        @submit-phone-email="handleCRSubmit" />
      <UnableToSubmitCrDialog :show="showUnableToSubmitCrDialog" :display-type="preventChangeRequestType" @close="toggleUnableToSubmitCrDialog" />
    </template>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState, mapActions } from 'pinia'

import UnableToSubmitCrDialog from '@/components/account-mgmt/UnableToSubmitCrDialog.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'
import ApplicationService from '@/services/applicationService'
import DocumentService from '@/services/documentService'
import OrganizationService from '@/services/organizationService'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'

import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useOrgStore } from '@/stores/org'

import ManageFacilityTable from '@/components/account-mgmt/ManageFacilityTable.vue'
import { REQUEST_CATEGORY_NAMES, OFM_PROGRAM_CODES, PREVENT_CHANGE_REQUEST_TYPES, VIRUS_SCAN_ERROR_MESSAGE, DOCUMENT_TYPES } from '@/utils/constants'

export default {
  name: 'ManageOrganizationView',
  components: { AppButton, AppBackButton, OrganizationInfo, NewRequestDialog, UnableToSubmitCrDialog, ManageFacilityTable },
  mixins: [alertMixin, permissionsMixin],
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
      userFacilities: [],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),
    ...mapState(useOrgStore, ['facilitiesWithContacts']),
    otherFacilities() {
      return this.facilities.filter((f) => !this.userFacilities.some((facility) => facility.facilityId === f.facilityId))
    },
    hasAnOFMFacility() {
      return this.facilities.some((facility) => facility.programCode === OFM_PROGRAM_CODES.OFM)
    },
    isInformationMissing() {
      return (
        this.facilities?.some((facility) => !facility.primaryContactName) ||
        this.facilities?.some((facility) => !facility.expenseAuthorityName) ||
        this.userFacilities?.some((facility) => !facility.primaryContactName) ||
        this.userFacilities?.some((facility) => !facility.expenseAuthorityName)
      )
    },
  },
  async created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
    this.OFM_PROGRAM_CODES = OFM_PROGRAM_CODES
    this.PREVENT_CHANGE_REQUEST_TYPES = PREVENT_CHANGE_REQUEST_TYPES
    await this.loadData()
  },
  methods: {
    ...mapActions(useOrgStore, ['getOrganizationFacilitiesAndContacts']),
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

    populateContacts(facilityArray) {
      return facilityArray.map((fac) => {
        const contacts = fac.contacts
        const address = [fac.streetAddress1, fac.city, fac.postalCode].filter(Boolean).join(', ')

        //can be more than one EA. Sort by some order so the results are always consistant. I picked alphabetical by first name
        const expenseContactList = contacts
          ?.filter((f) => f.isExpenseAuthority)
          .sort((a, b) => {
            return a.firstName?.localeCompare(b.firstName)
          })

        let expenseAuthorityName = null
        if (expenseContactList?.length > 0) {
          const str = expenseContactList?.length > 1 ? `(+${expenseContactList.length - 1} more)` : ''
          expenseAuthorityName = `${expenseContactList[0].firstName ?? ''} ${expenseContactList[0].lastName ?? ''} ${str}`
        }

        const primaryContact = contacts?.find((f) => f.contactId === fac.primaryContactId)
        const primaryContactName = primaryContact ? `${primaryContact.firstName ?? ''} ${primaryContact.lastName ?? ''}` : null

        return {
          ...fac,
          address: address,
          primaryContactName: primaryContactName,
          expenseAuthorityName: expenseAuthorityName,
          facilityName: fac.facilityName || fac.name,
        }
      })
    },
    async loadFacilities() {
      try {
        if (!this.facilitiesWithContacts) {
          await this.getOrganizationFacilitiesAndContacts(this.userInfo.organizationId)
        }
        this.facilities = this.populateContacts(this.facilitiesWithContacts)
        this.userFacilities = this.populateContacts(
          this.userInfo.facilities.map((fac) => {
            const currentFacility = this.facilities?.find((el) => el.facilityId === fac.facilityId)
            return { ...fac, ...currentFacility }
          }),
        )
      } catch (error) {
        this.setFailureAlert(`Failed to get facilities for organizationId = ${this.userInfo.organizationId}`, error)
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
        const docs = await DocumentService.getDocuments(this.userInfo.organizationId)
        this.uploadedDocuments = docs?.filter((doc) => doc.documentType === DOCUMENT_TYPES.INCLUSION_POLICY) ?? []
      } catch (error) {
        this.setFailureAlert("Failed to get organization's Inclusion Policy Document(s)", error)
        return
      }
    },

    /**
     * Open the Change Request dialog
     */
    toggleChangeRequestDialog() {
      this.showChangeRequestDialog = !this.showChangeRequestDialog
    },

    handleCRSubmit() {
      this.loadData()
    },

    async validateOfmProgram() {
      try {
        this.loading = true
        const hasApprovedApplication = await ApplicationService.hasApprovedApplication(this.userInfo.facilities)
        if (!this.hasAnOFMFacility && !hasApprovedApplication) {
          this.preventChangeRequestType = PREVENT_CHANGE_REQUEST_TYPES.NO_FACILITIES_IN_OFM
          this.showUnableToSubmitCrDialog = true
          return
        }
        this.toggleChangeRequestDialog()
      } finally {
        this.loading = false
      }
    },

    async saveInclusionPolicyData(hasInclusionPolicy, documentsToUpload, documentsToDelete, onSaveCompleteCallBack) {
      try {
        await this.processDocuments(documentsToUpload, documentsToDelete)
        await this.getInclusionPolicyDocuments()
        // hasInclusionPolicy should always be false if there is no uploaded document in CRM
        const updatedHasInclusionPolicy = this.uploadedDocuments?.length > 0 ? hasInclusionPolicy : false
        if (updatedHasInclusionPolicy !== this.organization.hasInclusionPolicy) {
          const payload = {
            hasInclusionPolicy: updatedHasInclusionPolicy,
          }
          await OrganizationService.updateOrganization(this.organization?.organizationId, payload)
          this.organization.hasInclusionPolicy = updatedHasInclusionPolicy
        }
        onSaveCompleteCallBack()
        this.setSuccessAlert('Inclusion Policy updated successfully')
      } catch (error) {
        this.setFailureAlert('Failed update Inclusion Policy on Organization', error)
      }
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
