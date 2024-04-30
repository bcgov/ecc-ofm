<template>
  <v-container fluid>
    <v-row>
      <v-col class="pt-0">
        <h3>Manage users</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="9" md="6" lg="6" xl="6" class="pb-1 mt-2 ml-6">
        <FacilityFilter :loading="loading" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
      <v-col class="d-flex justify-end align-end pb-0">
        <AppButton variant="text" @click="toggleDialog({})" :disabled="loading">
          <v-icon left>mdi-plus</v-icon>
          Add new user
        </AppButton>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0 pb-0">
        <!-- Users Table -->
        <v-skeleton-loader :loading="loading" type="table-tbody">
          <v-data-table :headers="headersUsers" :items="filteredUserFacilities" item-key="contactId" item-value="contactId" show-expand density="compact" :expanded.sync="expanded">
            <!-- Slot to customize expand row event -->
            <template v-slot:item.data-table-expand="{ item }">
              <AppButton @click.stop="toggleExpand(item)" variant="text">
                {{ expanded[0] == item.contactId ? 'hide detail' : 'view' }}
              </AppButton>
            </template>

            <template v-slot:item.actions="{ item }">
              <AppButton @click.stop="toggleDialog(item)" variant="text">edit</AppButton>
            </template>
            <!-- Slots to translate specific column values into display values -->

            <template v-slot:item.role="{ item }">
              <span>{{ item.role?.roleName }}</span>
            </template>

            <template v-slot:item.isExpenseAuthority="{ item }">
              <span>{{ isExpenseAuthority(item) }}</span>
            </template>

            <template v-slot:item.stateCode="{ item }">
              <span>{{ getStatusDescription(item) }}</span>
            </template>

            <!-- Slot to customize expand row content -->

            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td></td>
                <td colspan="6" class="pl-0">
                  <v-row>
                    <v-col cols="11" class="pt-5 pb-0">
                      <h4>Current facility access</h4>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="pt-0 pb-0">
                      <!-- Facilities table -->
                      <v-data-table :headers="headersFacilities" :items="item.facilities" item-key="facilityId" items-per-page="-1" density="compact">
                        <template v-slot:item.address="{ item }">{{ item.address }}, {{ item.city }}</template>

                        <template v-slot:item.isExpenseAuthority="{ item }">{{ item.isExpenseAuthority ? 'Yes' : 'No' }}</template>

                        <template v-slot:bottom><!-- no paging --></template>
                      </v-data-table>
                    </v-col>
                    <v-col cols="12"></v-col>
                  </v-row>
                </td>
                <td class="pl-0">
                  <AppButton v-if="showDeactivateUserButton(item)" variant="text" @click="deactivateUser(item)">Deactivate user</AppButton>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <ManageUserDialog :show="showManageUserDialog" :updatingUser="userToUpdate" @close="toggleDialog" @close-refresh="closeDialogAndRefresh" @update-success-event="updateSuccessEvent" />
    <DeactivateUserDialog :show="showDeactivateUserDialog" :user="userToDeactivate" @close="toggleDeactivateUserDialog" @deactivate="getUsersAndFacilities" />
    <AppBackButton width="400px" :to="{ name: 'account-mgmt' }">Account Management</AppBackButton>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import { useAuthStore } from '@/stores/auth'
import alertMixin from '@/mixins/alertMixin'
import { CRM_STATE_CODES, ROLES } from '@/utils/constants'
import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'
import ManageUserDialog from '@/components/account-mgmt/ManageUserDialog.vue'
import DeactivateUserDialog from '@/components/account-mgmt/DeactivateUserDialog.vue'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'

export default {
  components: { AppButton, AppBackButton, ManageUserDialog, DeactivateUserDialog, FacilityFilter },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      showFilterInput: false,
      facilityNameFilter: '',
      usersAndFacilities: null,
      expanded: [],
      showManageUserDialog: false,
      showDeactivateUserDialog: false,
      editedIndex: -1,
      userToUpdate: {},
      userToDeactivate: {},
      headersUsers: [
        { title: '', key: 'data-table-expand', width: '87px' },
        { title: '', key: 'actions', width: '30px' },
        { title: 'First Name', key: 'firstName', width: '10%' },
        { title: 'Last Name', key: 'lastName', width: '10%' },
        { title: 'Email', key: 'email', width: '12%' },
        { title: 'BCeID', key: 'userName', width: '12%' },
        { title: 'Role', key: 'role', width: '12%' },
        { title: 'Expense Authority', key: 'isExpenseAuthority', width: '12%' },
        { title: 'Status', key: 'stateCode', width: '16%' },
      ],
      headersFacilities: [
        { title: 'Facility Name', key: 'facilityName', width: '35%' },
        { title: 'Address', key: 'address', width: '45%' },
        { title: 'Expense Authority', key: 'isExpenseAuthority', width: '15%' },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),

    filteredUserFacilities() {
      this.loading = true
      try {
        if (!this.facilityNameFilter) return this.sortUsers(this.usersAndFacilities)
        return this.sortUsers(this.usersAndFacilities.filter((user) => user.facilities.some((facility) => facility.facilityName.toLowerCase().includes(this.facilityNameFilter.toLocaleLowerCase()))))
      } catch (error) {
        this.setFailureAlert('Failed to filter users by facility name', error)
      } finally {
        this.loading = false
      }
    },
  },
  async created() {
    this.ROLES = ROLES
    await this.getUsersAndFacilities()
  },
  methods: {
    isDeactivatedUser(user) {
      return user?.facilities?.length === 0 && !user?.role
    },

    isSameUser(user) {
      return user?.userName === this.userInfo?.userName
    },

    showDeactivateUserButton(user) {
      return !this.isDeactivatedUser(user) && !this.isSameUser(user) && user?.stateCode === CRM_STATE_CODES.ACTIVE
    },

    /**
     * Get the list of users and facilities
     */
    async getUsersAndFacilities() {
      try {
        this.loading = true
        // TODO (jgstorey) Make this a service function
        const res = await ApiService.apiAxios.get(ApiRoutes.USER_PERMISSIONS_FACILITIES + '/' + this.userInfo.organizationId)
        this.usersAndFacilities = res.data
      } catch (error) {
        this.setFailureAlert('Failed to get the list of users by organization id: ' + this.userInfo.organizationId, error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Toggle expanded row
     */
    toggleExpand(item) {
      const index = this.expanded.indexOf(item.contactId)
      if (index > -1) {
        // Collapse if already expanded
        this.expanded.splice(index, 1)
      } else {
        // Expand the clicked row
        this.expanded = [item.contactId]
      }
    },

    /**
     * Get the status description for a status code
     */
    getStatusDescription(user) {
      return this.isDeactivatedUser(user) || user?.stateCode === CRM_STATE_CODES.INACTIVE ? 'Inactive' : 'Active'
    },

    /**
     * Sort users by: account management role 1st, expense authority 2nd, last name 3rd
     */
    sortUsers(users) {
      if (!users) return []
      return users.sort((a, b) => {
        // Check for account management role and sort by it, with true values first
        // TODO (weskubo-cgi) Revisit this requirement given new Roles Security Matrix
        const roleA = a.role === this.ROLES.ACCOUNT_MANAGER
        const roleB = b.role === this.ROLES.ACCOUNT_MANAGER
        if (roleA && !roleB) return -1
        if (!roleA && roleB) return 1

        // If roles are the same, then sort by stateCode
        if (a.stateCode !== b.stateCode) {
          return a.stateCode - b.stateCode
        }

        // If stateCode is the same, then sort by lastName
        return a.lastName.localeCompare(b.lastName)
      })
    },

    /**
     * Toggles the manage user dialog opened/closed while passing in the user to edit.
     */
    toggleDialog(user) {
      this.editedIndex = this.usersAndFacilities.indexOf(user)
      this.userToUpdate = Object.assign({}, user)
      this.showManageUserDialog = !this.showManageUserDialog
    },

    toggleDeactivateUserDialog(user) {
      this.showDeactivateUserDialog = !this.showDeactivateUserDialog
      this.userToDeactivate = user
    },

    /**
     * Close the manage user dialog and refresh the user list.
     */
    closeDialogAndRefresh() {
      this.showManageUserDialog = false
      this.getUsersAndFacilities()
    },

    /**
     * Called when the manage user dialog emits a user update was success or fail.
     */
    async updateSuccessEvent(isSuccess, error) {
      if (isSuccess) {
        this.setSuccessAlert('User updated successfully.')
        // A user has been updated, get the latest data for UI.
        await this.getUsersAndFacilities()
      } else {
        this.setFailureAlert('User update failed.', error)
      }
    },

    /**
     * Checks if the user is an Expense Authority for any facility.
     */
    isExpenseAuthority(user) {
      return user.facilities.some((facility) => facility.isExpenseAuthority) ? 'Yes' : 'No'
    },

    /**
     * Deactivates a user if they are not the last Expense Authority for any facility.
     */
    deactivateUser(user) {
      const facilityNames = this.getLastExpenseAuthoritiesForUser(user)
      if (facilityNames.length > 0) {
        this.setFailureAlert(`Cannot deactivate user. They are the last expense authority for facilities: ${facilityNames.join(', ')}.`)
      } else {
        this.toggleDeactivateUserDialog(user)
      }
    },

    /**
     * Get the last expense authority facility names for a user
     */
    getLastExpenseAuthoritiesForUser(user) {
      // Find target users's facilities that are marked as isExpenseAuthority
      const targetFacilities = user.facilities.filter((f) => f.isExpenseAuthority) || []
      // If no facilities with isExpenseAuthority true, return false
      if (targetFacilities.length === 0) {
        return { isLastExpenseAuthority: false, facilityNames: [] }
      }
      const lastExpenseAuthorityFacilityNames = []
      // Check for each of the target's facilities with isExpenseAuthority true
      targetFacilities.forEach((facility) => {
        // Check if any other user has a facility with the same facilityId and isExpenseAuthority true
        const hasOtherUserWithAuthority = this.usersAndFacilities.some(
          (userToCheck) => userToCheck.contactId !== user.contactId && userToCheck.facilities.some((f) => f.facilityId === facility.facilityId && f.isExpenseAuthority),
        )
        if (!hasOtherUserWithAuthority) {
          lastExpenseAuthorityFacilityNames.push(facility.facilityName)
        }
      })
      return lastExpenseAuthorityFacilityNames
    },

    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },
  },
}
</script>

<style scoped>
:deep(div.v-data-table-footer) {
  padding-top: 20px !important;
}
</style>
