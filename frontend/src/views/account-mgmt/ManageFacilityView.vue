<template>
  <v-container fluid>
    <h1>Update Facility Information</h1>
    <v-row class="mt-4">
      <v-col cols="12" lg="6">
        <h4>Facility Details</h4>
      </v-col>
      <v-col v-if="editable" cols="12" lg="6">
        <v-row no-gutters justify="end" class="">
          <AppButton size="large" :loading="loading" @click="validateOfmProgram()">Submit a Change Request</AppButton>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-0">
        <FacilityInfo :loading="loading" :facility="facility" />
      </v-col>
    </v-row>
    <v-row class="mt-6">
      <v-col class="pb-1 pt-6">
        <h4>Licences</h4>
      </v-col>
      <v-col class="d-flex justify-end align-end pb-1 pt-0">
        <AppButton v-if="licences?.length > 0 && isEmpty(panel)" id="expand-button" :primary="false" size="large" width="200px" @click="togglePanels()">
          <v-icon>mdi-arrow-expand-vertical</v-icon>
          Expand All
        </AppButton>
        <AppButton v-else-if="licences?.length > 0" id="collapse-button" :primary="false" size="large" width="200px" @click="togglePanels()">
          <v-icon>mdi-arrow-collapse-vertical</v-icon>
          Collapse All
        </AppButton>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-card elevation="0" variant="outlined" class="w-100">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <v-expansion-panels v-if="licences?.length > 0" v-model="panel" multiple>
              <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
                <v-expansion-panel-title>
                  <LicenceHeader :licence="licence" />
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <LicenceDetails :read-only="true" :licence="licence" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <div v-else class="pa-5">0 Licences</div>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row no-gutters class="mt-6">
      <h4 class="mr-2">Primary Contact</h4>
      <h5>(You can only have one primary contact)</h5>
    </v-row>
    <v-row>
      <v-col cols="12" class="py-0">
        <v-card class="pa-6 mb-3" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <div class="w-100">
              <!-- NOTE: div was required due to dynamic v-row within v-skeleton-loader, otherwise intended row formatting breaks -->
              <v-row v-if="editModePrimaryContact">
                <v-col cols="auto">
                  <AppLabel>Change primary contact:</AppLabel>
                </v-col>
                <v-col cols="12" sm="6" md="4" xl="3" class="pb-0">
                  <v-select
                    id="primary-contact"
                    v-model="primaryContact"
                    :items="sortedContacts"
                    :disabled="loading"
                    item-title="fullName"
                    item-value="contactId"
                    label="Select Primary Contact"
                    :rules="rules.required"
                    density="compact"
                    variant="outlined"
                    return-object></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="10" sm="11">
                  <ContactInfo :loading="loading" :contact="primaryContact" vCardVariant="flat" class="mt-0" />
                </v-col>
                <v-col cols="2" sm="1">
                  <v-row v-if="editable && !editModePrimaryContact" no-gutters justify="end">
                    <AppButton variant="text" :disabled="editMode || loading" @click="toggleEditPrimaryContact()">
                      <v-icon icon="fa:fa-regular fa-edit" class="transaction-icon"></v-icon>
                    </AppButton>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-if="editable && editModePrimaryContact">
                <v-col cols="12">
                  <v-row justify="end">
                    <AppButton id="cancel" :primary="false" size="large" :loading="loading" class="mr-6" @click="toggleEditPrimaryContact()">Cancel</AppButton>
                    <AppButton id="save" :primary="true" size="large" :loading="loading" :disabled="!hasPrimaryContactChanged" class="mr-4" @click="savePrimaryContact()">Save</AppButton>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <EditFacilityContacts
      :loading="loading"
      title="Expense Authorities"
      title-info="(You can have more than one expense authority)"
      :contacts="expenseAuthorities"
      :contacts-for-add="expenseAuthoritiesAvailableForAdd"
      :at-least-one-contact-mandatory="true"
      :parent-in-edit-mode="editMode"
      :editable="editable"
      @save-contact-updates="saveExpenseAuthorityUpdates"
      @edit-mode-changed="contactEditModeChange" />
    <EditFacilityContacts
      :loading="loading"
      title="Additional Contacts"
      title-info="(You can have more than one additional contact)"
      :contacts="additionalContacts"
      :contacts-for-add="additionalContactsAvailableForAdd"
      :parent-in-edit-mode="editMode"
      :editable="editable"
      @save-contact-updates="saveAdditionalContactUpdates"
      @edit-mode-changed="contactEditModeChange" />
    <AppBackButton id="back-to-manage-organization" max-width="500px" :to="{ name: 'manage-organization' }" :loading="loading">Organization Information</AppBackButton>
    <NewRequestDialog
      v-if="editable"
      class="pa-0"
      :show="showChangeRequestDialog"
      :default-request-category-id="getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.ACCOUNT_MAINTENANCE)"
      :default-facility="facility"
      @close="toggleChangeRequestDialog"
      @submit-phone-email="handleCRSubmit" />
    <UnableToSubmitCrDialog :show="showUnableToSubmitCrDialog" :display-type="preventChangeRequestType" @close="toggleUnableToSubmitCrDialog" />
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import EditFacilityContacts from '@/components/account-mgmt/EditFacilityContacts.vue'
import UnableToSubmitCrDialog from '@/components/account-mgmt/UnableToSubmitCrDialog.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import ApplicationService from '@/services/applicationService'
import FacilityService from '@/services/facilityService'
import LicenceService from '@/services/licenceService'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { REQUEST_CATEGORY_NAMES, OFM_PROGRAM_CODES, PREVENT_CHANGE_REQUEST_TYPES } from '@/utils/constants'
import rules from '@/utils/rules'

export default {
  name: 'ManageFacilityView',
  components: { AppButton, AppBackButton, AppLabel, FacilityInfo, EditFacilityContacts, ContactInfo, LicenceHeader, LicenceDetails, NewRequestDialog, UnableToSubmitCrDialog },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      facilityId: null,
      licences: [],
      contacts: [],
      panel: [],
      primaryContact: undefined,
      primaryContactLastSaved: undefined,
      facility: undefined,
      loading: false,
      rules,
      editMode: false,
      editModePrimaryContact: false,
      isEmpty,
      showChangeRequestDialog: false,
      showUnableToSubmitCrDialog: false,
      preventChangeRequestType: undefined,
    }
  },
  computed: {
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),
    ...mapState(useAuthStore, ['userInfo']),
    expenseAuthorities() {
      return this.contacts?.filter((contact) => contact.isExpenseAuthority)
    },
    additionalContacts() {
      return this.contacts?.filter((contact) => contact.isAdditionalContact)
    },
    additionalContactsAvailableForAdd() {
      return this.contacts?.filter((contact) => !contact.isAdditionalContact)
    },
    expenseAuthoritiesAvailableForAdd() {
      return this.contacts?.filter((contact) => !contact.isExpenseAuthority)
    },
    hasPrimaryContactChanged() {
      return this.primaryContact !== this.primaryContactLastSaved
    },
    allLicenceIDs() {
      return this.licences?.map((licence) => licence.licenceId)
    },
    editable() {
      return this.hasPermission(this.PERMISSIONS.UPDATE_ORG_FACILITY) && this.hasAccessToFacility(this.facilityId)
    },
    sortedContacts() {
      if (!this.contacts) return []
      const contactsCopy = [...this.contacts]
      return contactsCopy.sort((a, b) => {
        return a.firstName?.localeCompare(b.firstName)
      })
    },
  },
  async created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
    this.PREVENT_CHANGE_REQUEST_TYPES = PREVENT_CHANGE_REQUEST_TYPES
    this.facilityId = this.$route.params.facilityId
    await this.loadData()
    this.primaryContact = this.contacts?.find((contact) => contact.contactId === this.facility?.primaryContactId)
    this.primaryContactLastSaved = this.primaryContact
  },
  methods: {
    /**
     * Load the data for the page
     */
    async loadData() {
      try {
        this.loading = true
        await Promise.all([this.getFacility(), this.getContacts(), this.getLicences()])
      } finally {
        this.loading = false
      }
    },

    /**
     * Get the contacts for the facility
     */
    async getContacts() {
      try {
        this.contacts = await FacilityService.getContacts(this.facilityId)
        this.contacts?.forEach((contact) => {
          contact.fullName = `${contact.firstName ?? ''} ${contact.lastName}`
        })
      } catch (error) {
        this.setFailureAlert('Failed to get contacts for facilityId = ' + this.facilityId, error)
      }
    },

    /**
     * Get the licences for the facility
     */
    async getLicences() {
      try {
        this.licences = await FacilityService.getLicences(this.facilityId)
        await Promise.all(
          this.licences.map(async (licence) => {
            licence.licenceDetails = await LicenceService.getLicenceDetails(licence.licenceId)
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to licence(s) for facilityId = ' + this.facilityId, error)
      }
    },

    /**
     * Get facility by facilityId
     */
    async getFacility() {
      try {
        this.facility = await FacilityService.getFacility(this.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Facility information for facilityId = ' + this.facilityId, error)
      }
    },

    /**
     * Toggle edit mode for primary contact
     */
    toggleEditPrimaryContact() {
      this.editModePrimaryContact = !this.editModePrimaryContact
      this.primaryContact = this.primaryContactLastSaved
      this.editMode = this.editModePrimaryContact
    },

    /**
     * Save primary contact updates
     */
    async savePrimaryContact() {
      try {
        if (this.primaryContact === this.primaryContactLastSaved) {
          return
        }
        this.loading = true
        this.facility.primaryContactId = this.primaryContact?.contactId
        await FacilityService.updateFacilityPrimaryContact(this.facility.facilityId, this.facility.primaryContactId)
        this.primaryContactLastSaved = this.primaryContact
        this.editModePrimaryContact = false
        this.editMode = false
        this.setSuccessAlert('Primary contact updated successfully')
      } catch (error) {
        this.setFailureAlert('Failed to update Primary Contact', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Save contact updates
     * @param {*} property - property to update (i.e isExpenseAuthority or isAdditionalContact)
     * @param {*} contactsToAdd - contacts to set incoming property to true
     * @param {*} contactsToRemove - contacts to set incoming property to false
     */
    async saveContactUpdates(property, contactType, contactsToAdd, contactsToRemove) {
      this.loading = true
      try {
        contactsToAdd.forEach((obj) => (obj[property] = true))
        contactsToRemove?.forEach((obj) => (obj[property] = false))
        const contactsToUpdate = contactsToRemove?.length === 0 ? [...contactsToAdd] : [...contactsToAdd, ...contactsToRemove]
        const updateContactsTasks = contactsToUpdate.map(async (contact) => {
          try {
            await FacilityService.updateFacilityContact(contact.bceidFacilityId, contact)
          } catch (error) {
            this.setFailureAlert(`Failed to update ${property} for contactId = ` + contact.contactId, error)
            throw error
          }
        })
        await Promise.all(updateContactsTasks)
        this.getContacts()
        this.setSuccessAlert(`${contactType} updates have been saved successfully`)
      } catch (error) {
        this.setFailureAlert(`Failure occurred while updating ${contactType}`, error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Save expense authority contact updates
     */
    async saveExpenseAuthorityUpdates(contactsToAdd, contactsToRemove) {
      await this.saveContactUpdates('isExpenseAuthority', 'Expense Authority', contactsToAdd, contactsToRemove)
    },

    /**
     * Save additional contact updates
     */
    async saveAdditionalContactUpdates(contactsToAdd, contactsToRemove) {
      await this.saveContactUpdates('isAdditionalContact', 'Additional Contact', contactsToAdd, contactsToRemove)
    },

    /**
     * Toggle expansion panels
     */
    togglePanels() {
      this.panel = this.panel.length === 0 ? this.allLicenceIDs : []
    },

    /**
     * Handle edit mode change for component
     */
    contactEditModeChange(editMode) {
      this.editMode = editMode
    },

    /**
     * Check if user has access to facility
     */
    hasAccessToFacility(facilityId) {
      return this.userInfo?.facilities?.some((facility) => facility.facilityId === facilityId)
    },

    /**
     * Open/close the Change Request dialog
     */
    toggleChangeRequestDialog() {
      this.showChangeRequestDialog = !this.showChangeRequestDialog
    },

    handleCRSubmit() {
      this.loadData()
    },

    async validateOfmProgram() {
      const isCCOForMultipleProgram = [OFM_PROGRAM_CODES.CCOF, OFM_PROGRAM_CODES.MULTIPLE].includes(this.facility?.programCode)
      const isTDADProgram = OFM_PROGRAM_CODES.TDAD === this.facility?.programCode
      const hasApprovedApplication = await ApplicationService.hasApprovedApplication([{ facilityId: this.facility?.facilityId }])
      if ((isCCOForMultipleProgram || isTDADProgram) && !hasApprovedApplication) {
        this.preventChangeRequestType = isCCOForMultipleProgram ? PREVENT_CHANGE_REQUEST_TYPES.IN_CCOF_PROGRAM : PREVENT_CHANGE_REQUEST_TYPES.IN_TDAD_PROGRAM
        this.showUnableToSubmitCrDialog = true
      } else {
        this.toggleChangeRequestDialog()
      }
    },

    toggleUnableToSubmitCrDialog() {
      this.showUnableToSubmitCrDialog = !this.showUnableToSubmitCrDialog
    },
  },
}
</script>
