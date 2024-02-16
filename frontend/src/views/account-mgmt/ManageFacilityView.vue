<template>
  <v-container fluid>
    <h1>Update Facility Information</h1>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Facility Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0 pb-0">
        <FacilityInfo :loading="loading" :facility="facility" class="mt-0" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pb-1 pt-6">
        <h4>Licences</h4>
      </v-col>
      <v-col class="d-flex justify-end align-end pb-1 pt-0">
        <AppButton id="add-licence-button" :primary="false" size="large" width="250px" class="mr-4" @click="addEditLicense()">
          <v-icon left>mdi-plus</v-icon>
          Add New Licence
        </AppButton>

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
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card elevation="0" variant="outlined" class="w-100">
          <v-skeleton-loader v-if="licences?.length > 0" :loading="loading" type="table-tbody">
            <v-expansion-panels v-model="panel" multiple>
              <v-expansion-panel v-for="licence in licences" :key="licence.licenceId" :value="licence.licenceId">
                <v-expansion-panel-title class="header-label">
                  <LicenceHeader :licence="licence" />
                  <v-col cols="auto">
                    <v-icon icon="fa:fa-regular fa-pen-to-square" class="" @click.stop="addEditLicense(licence.licenceId)"></v-icon>
                  </v-col>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <LicenceDetails :licence="licence" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-skeleton-loader>
          <div v-else class="pa-5">0 Licences</div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pr-9 pb-0 d-flex flex-row align-center">
        <h4 class="mr-2">Primary Contact</h4>
        <h5>&nbsp;(You can only have one primary contact)</h5>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0 pb-0">
        <v-card class="pa-6 mb-3" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <div class="w-100">
              <!-- NOTE: div was required due to dynamic v-row within v-skeleton-loader, otherwise intended row formatting breaks -->
              <v-row v-if="editModePrimaryContact">
                <v-col cols="auto">
                  <AppLabel>Change primary contact:</AppLabel>
                </v-col>
                <v-col cols="4" class="pb-0">
                  <v-select
                    v-if="editModePrimaryContact"
                    id="primary-contact"
                    v-model="primaryContact"
                    :items="sortedContacts"
                    :disabled="loading"
                    item-title="fullName"
                    label="Select Primary Contact"
                    :rules="rules.required"
                    density="compact"
                    variant="outlined"
                    return-object></v-select>
                  <template v-else>{{ primaryContact?.firstName }} {{ primaryContact?.lastName }}</template>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="11">
                  <ContactInfo :loading="loading" :contact="primaryContact" vCardVariant="flat" class="mt-0" />
                </v-col>
                <v-col cols="1">
                  <v-row v-if="!editModePrimaryContact" no-gutters justify="end">
                    <v-icon icon="fa:fa-regular fa-edit" @click="toggleEditPrimaryContact()"></v-icon>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-if="editModePrimaryContact">
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
      titleInfo="(You can have more than one expense authority)"
      :contacts="expenseAuthorities"
      :contactsForAdd="expenseAuthoritiesAvailableForAdd"
      :atLeastOneContactMandatory="true"
      @save-contact-updates="saveExpenseAuthorityUpdates" />
    <EditFacilityContacts
      :loading="loading"
      title="Additional Contacts"
      titleInfo="(You can have more than one additional contact)"
      :contacts="additionalContacts"
      :contactsForAdd="additionalContactsAvailableForAdd"
      @save-contact-updates="saveAdditionalContactUpdates" />
    <v-row>
      <v-col cols="12" md="6">
        <v-row justify="center" justify-md="start" class="pb-2">
          <AppBackButton id="back-to-manage-organization" width="450px" :to="{ name: 'manage-organization' }" :loading="loading">Organization Information</AppBackButton>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import { ApiRoutes } from '@/utils/constants'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import ApiService from '@/common/apiService'
import FacilityService from '@/services/facilityService'
import LicenceService from '@/services/licenceService'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import EditFacilityContacts from '@/components/account-mgmt/EditFacilityContacts.vue'
import ContactInfo from '@/components/applications/ContactInfo.vue'
import LicenceHeader from '@/components/licences/LicenceHeader.vue'
import LicenceDetails from '@/components/licences/LicenceDetails.vue'
import { isEmpty } from 'lodash'

export default {
  name: 'ManageFacilityView',
  components: { AppButton, AppBackButton, AppLabel, FacilityInfo, EditFacilityContacts, ContactInfo, LicenceHeader, LicenceDetails },
  mixins: [alertMixin],
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
      editModePrimaryContact: false,
      isEmpty,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getRoleNameById', 'healthAuthorities', 'userRoles', 'getHealthAuthorityNameById']),
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
    sortedContacts() {
      if (!this.contacts) return []
      const contactsCopy = [...this.contacts]
      return contactsCopy.sort((a, b) => {
        return a.firstName.localeCompare(b.firstName)
      })
    },
  },
  async created() {
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
          contact.fullName = `${contact.firstName} ${contact.lastName}`
          contact.roleName = this.getRoleNameById(Number(contact.role))
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
    },

    /**
     * Save primary contact updates
     */
    async savePrimaryContact() {
      try {
        if (this.primaryContact === this.primaryContactLastSaved) {
          return
        }
        this.Loading = true
        this.facility.primaryContactId = this.primaryContact?.contactId
        await FacilityService.updateFacilityPrimaryContact(this.facility.facilityId, this.facility.primaryContactId)
        this.primaryContactLastSaved = this.primaryContact
        this.editModePrimaryContact = false
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
        let updateContactsTasks = contactsToUpdate.map(async (contact) => {
          try {
            await ApiService.apiAxios.patch(ApiRoutes.USER_PERMISSIONS_FACILITIES + '/' + contact.bceidFacilityId, contact)
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
     * Add a new licence category
     */
    addEditLicense(licenceId) {
      this.setWarningAlert('This feature is not yet implemented')
    },

    togglePanels() {
      this.panel = this.panel.length === 0 ? this.allLicenceIDs : []
    },
  },
}
</script>
