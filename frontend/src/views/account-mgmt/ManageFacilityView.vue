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
      <v-col cols="12" class="licence-card-header">
        <h4>Expense Authority</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6 w-100" variant="outlined">
          <v-skeleton-loader :loading="loading" type="table-tbody">
            <div class="w-100">
              <!-- NOTE: div was required due to dynamic v-row within v-skeleton-loader, otherwise intended row formatting breaks -->
              <v-row>
                <v-col>
                  <AppLabel>Current expense authority:</AppLabel>
                </v-col>
                <v-col>
                  <v-row no-gutters justify="end">
                    <v-icon icon="fa:fa-regular fa-plus" class="mr-4"></v-icon>
                    <v-icon v-if="isEditableExpenseAuthority" icon="fa:fa-regular fa-edit" class="mr-4"></v-icon>
                  </v-row>
                </v-col>
              </v-row>
              <v-row v-for="(item, index) in this.expenseAuthorities" :key="index">
                <v-col cols="auto">
                  <AppLabel>Name:</AppLabel>
                </v-col>
                <v-col cols="2">{{ item.firstName }} {{ item.lastName }}</v-col>
                <v-col cols="auto">
                  <AppLabel>Role:</AppLabel>
                </v-col>
                <v-col cols="2">
                  {{ getRoleNameById(item.role) }}
                </v-col>
              </v-row>
            </div>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6 pr-9 pt-0 pb-0">
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
                <v-col>
                  <AppLabel>Current primary contact info:</AppLabel>
                </v-col>
                <v-col>
                  <v-row no-gutters justify="end">
                    <v-icon v-if="primaryContact" icon="fa:fa-regular fa-edit" class="mr-4"></v-icon>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="auto">
                  <AppLabel>Name:</AppLabel>
                </v-col>
                <v-col cols="2">{{ primaryContact?.firstName }} {{ primaryContact?.lastName }}</v-col>
                <v-col cols="auto">
                  <AppLabel>Role:</AppLabel>
                </v-col>
                <v-col cols="auto">
                  {{ getRoleNameById(primaryContact?.role) }}
                </v-col>
              </v-row>
            </div>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-row justify="center" justify-md="start" class="pb-2">
          <AppButton id="back-to-account-mgmt" :primary="false" size="large" width="400px" :to="{ name: 'account-mgmt' }" :loading="loading">
            <v-icon class="pb-1">mdi-arrow-left</v-icon>
            Back to Account Management
          </AppButton>
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <v-row justify="center" justify-md="end" class="pb-2">
          <AppButton id="cancel" :primary="false" size="large" :to="{ name: 'manage-organization' }" :loading="loading" class="mr-6">Cancel</AppButton>
          <AppButton id="save" :disabled="true" :primary="true" size="large" :to="{ name: 'account-mgmt' }" :loading="loading">Save</AppButton>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import FacilityInfo from '@/components/facilities/FacilityInfo.vue'
import FacilityService from '@/services/facilityService'
import alertMixin from '@/mixins/alertMixin'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'ManageFacilityView',
  components: { AppButton, AppLabel, FacilityInfo },
  mixins: [alertMixin],
  data() {
    return {
      facilityId: null,
      licences: [],
      contacts: [],
      facility: undefined,
      loading: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['healthAuthorities']),
    expenseAuthorities() {
      return this.contacts?.filter((contact) => contact.isExpenseAuthority)
    },
    primaryContact() {
      return this.contacts?.find((contact) => contact.contactId === this.facility?.primaryContactId)
    },
    isEditableExpenseAuthority() {
      return this.expenseAuthorities?.length !== 0
    },
  },
  async created() {
    this.facilityId = this.$route.params.facilityId
    await this.loadData()
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

    async getFacility() {
      try {
        this.facility = await FacilityService.getFacility(this.facilityId)
      } catch (error) {
        this.setFailureAlert('Failed to get Facility information for facilityId = ' + this.facilityId, error)
      }
    },

    /**
     * Get the role name by id
     */
    getRoleNameById(roleId) {
      const appStore = useAppStore()
      return appStore.getRoleNameById(Number(roleId))
    },
  },
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
