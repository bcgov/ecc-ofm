<template>
  <v-container fluid>
    <h1>Update Facility Information</h1>
    <v-row>
      <v-col class="ml-6 mt-6 pb-0">
        <h4>Facility Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pt-0">
        <FacilityInfo :loading="loading" :facility="facility" class="mt-0" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="licence-card-header align-self-end">
        <h4>Licences</h4>
      </v-col>
      <v-col class="d-flex justify-end align-end licence-card-header">
        <AppButton variant="text" :disabled="loading">
          <v-icon left>mdi-plus</v-icon>
          Add New Licence
        </AppButton>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6 mt-0" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <v-row>
              <v-col>
                <AppLabel>Current licences:</AppLabel>
                <v-card v-for="item in this.licences" :key="item.licence" class="licence-card">
                  <v-row>
                    <v-col cols="auto">
                      <AppLabel>Licence Number:</AppLabel>
                    </v-col>
                    <v-col cols="2">
                      {{ item.licence }}
                    </v-col>
                    <v-col cols="auto">
                      <v-icon icon="fa:fa-regular fa-pen-to-square" class="mr-4"></v-icon>
                    </v-col>
                    <v-col cols="1" />
                    <v-col cols="auto">
                      <AppLabel>Health Authority:</AppLabel>
                    </v-col>
                    <v-col cols="2" class="pb-0">
                      <v-select
                        id="health-authority"
                        :items="healthAuthorities"
                        v-model="item.healthAuthorityId"
                        item-title="description"
                        item-value="id"
                        :disabled="true"
                        density="compact"
                        variant="outlined"></v-select>
                    </v-col>
                    <v-col>
                      <v-row no-gutters justify="end">
                        <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pr-9 pb-0">
        <h4>Primary Contact</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6 mb-3" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <div class="w-100">
              <!-- NOTE: div was required due to dynamic v-row within v-skeleton-loader, otherwise intended row formatting breaks -->
              <v-row>
                <v-col cols="auto">
                  <AppLabel>Name:</AppLabel>
                </v-col>
                <v-col cols="2" class="pb-0">
                  <v-select v-if="editModePrimaryContact"
                    id="primary-contact"
                    v-model="primaryContact"
                    :items="sortedContacts"
                    :disabled="loading"
                    item-title="fullName"
                    label="Select Primary Contact"
                    :rules="rules.required"
                    density="compact"
                    variant="outlined"
                    return-object>
                  </v-select>
                  <template v-else>
                    {{ primaryContact?.firstName }} {{ primaryContact?.lastName }}
                  </template>
                </v-col>
                <v-col cols="auto" class="pb-0">
                  <AppLabel>Role:</AppLabel>
                </v-col>
                <v-col cols="2" class="pb-0">
                  {{ getRoleNameById(primaryContact?.role) }}
                </v-col>
                <v-col class="pb-0">
                  <v-row v-if="!editModePrimaryContact" no-gutters justify="end">
                    <v-icon icon="fa:fa-regular fa-edit" @click="toggleEditPrimaryContact()"></v-icon>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-if="editModePrimaryContact">
                <v-col cols="12">
                  <v-row justify="end">
                    <AppButton id="cancel" :primary="false" size="large" :loading="loading" class="mr-6" @click="toggleEditPrimaryContact()">Cancel</AppButton>
                    <AppButton id="save" :primary="true" size="large" :loading="loading" :disabled="hasPrimaryContactChanged" class="mr-4" @click="savePrimaryContact()">Save</AppButton>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <ManageContactFacilityPermissions
      :loading="loading"
      title="Expense Authorities"
      :contacts="expenseAuthorities"
      :contactsForAdd="expenseAuthoritiesAvailableForAdd"
      @save-contact-updates="saveExpenseAuthorityUpdates" />
    <ManageContactFacilityPermissions
      :loading="loading"
      title="Additional Contacts"
      :contacts="additionalContacts"
      :contactsForAdd="additionalContactsAvailableForAdd"
      @save-contact-updates="saveAdditionalContactUpdates" />
    <v-row>
      <v-col cols="12" md="6">
        <v-row justify="center" justify-md="start" class="pb-2">
          <AppButton id="back-to-manage-organization" :primary="false" size="large" width="515px" :to="{ name: 'manage-organization' }" :loading="loading">
            <v-icon class="pb-1">mdi-arrow-left</v-icon>
            Back to Update Organization Information
          </AppButton>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import ManageContactFacilityPermissions from '@/components/account-mgmt/ManageContactFacilityPermissions.vue'
import ApiService from '@/common/apiService'
import { ApiRoutes } from '@/utils/constants'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ManageFacilityView',
  components: { AppButton, AppLabel, FacilityInfo, ManageContactFacilityPermissions },
  mixins: [alertMixin],
  data() {
    return {
      facilityId: null,
      licences: [],
      contacts: [],
      primaryContact: undefined,
      primaryContactLastSaved: undefined,
      facility: undefined,
      loading: false,
      rules,
      editModePrimaryContact: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getRoleNameById', 'healthAuthorities', 'userRoles']),
    expenseAuthorities() {
      return this.contacts?.filter((contact) => contact.isExpenseAuthority)
    },
    additionalContacts() {
      return this.contacts?.filter((contact) => contact.isAdditionalContact)
    },
    additionalContactsAvailableForAdd() {
      return this.contacts?.filter((contact) => !contact.isPrimaryContact && !contact.isAdditionalContact)
    },
    expenseAuthoritiesAvailableForAdd() {
      return this.contacts?.filter((contact) => !contact.isExpenseAuthority)
    },
    hasPrimaryContactChanged() {
      return this.primaryContact === this.primaryContactLastSaved
    },
    sortedContacts() {
      if (!this.contacts) return []
      const contactsCopy = this.contacts.slice()
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
     * Format property name for display. i.e. property isExpenseAuthority becomes 'Expense Authority'
     */
    formatPropertyForDisplay(str) {
      // Remove 'is' prefix if it exists
      if (str.startsWith('is')) {
        str = str.substring(2)
      }
      // Split CamelCase into words and capitalize the first letter of each word
      return str
        // Insert a space before all caps and convert to lower case
        .replace(/([A-Z])/g, ' $1').toLowerCase()
        // Capitalize the first letter of each word
        .replace(/^./, str => str.toUpperCase())
        .replace(/\s./g, str => str.toUpperCase())
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
    async saveContactUpdates(property, contactsToAdd, contactsToRemove) {
      this.loading = true
      try {
        contactsToAdd.forEach(obj => obj[property] = true)
        contactsToRemove?.forEach(obj => obj[property] = false)
        const contactsToUpdate = (contactsToRemove?.length === 0) ? [...contactsToAdd] : [...contactsToAdd, ...contactsToRemove]
        for (const contact of contactsToUpdate) {
          try {
            await ApiService.apiAxios.patch(ApiRoutes.USER_PERMISSIONS_FACILITIES + '/' + contact.bceidFacilityId, contact)
            this.getContacts()
          } catch (error) {
            this.setFailureAlert(`Failed to update ${property} for contactId = ` + contact.contactId, error)
            throw error
          }
        }
        this.setSuccessAlert(`${this.formatPropertyForDisplay(property)} updates have been saved successfully`)
      } catch (error) {
        this.setFailureAlert(`Failure occurred while updating ${this.formatPropertyForDisplay(property)}`, error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Save expense authority contact updates
     */
    async saveExpenseAuthorityUpdates(contactsToAdd, contactsToRemove) {
      await this.saveContactUpdates('isExpenseAuthority', contactsToAdd, contactsToRemove)
    },

    /**
     * Save additional contact updates
     */
    async saveAdditionalContactUpdates(contactsToAdd, contactsToRemove) {
      await this.saveContactUpdates('isAdditionalContact', contactsToAdd, contactsToRemove)
    },
  }
}
</script>

<style>
.licence-card-header {
  margin-left: 24px;
  padding-right: 9px;
  padding-top: 0px;
  padding-bottom: 1px;
}

.licence-card {
  margin-top: 12px;
  padding: 10px;
  border: 1px solid black;
  box-shadow: none;
}
</style>
