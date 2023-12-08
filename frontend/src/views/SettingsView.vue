<template>
  <v-container v-if="usersAndFacilities" class="pa-2 ma-0 w-100">
    <v-row>
      <v-col class="pt-0">
        <h3>Manage users</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <AppButton @click="toggleShowFilter()" variant="text">
          Filter by facility
          <v-icon right>mdi-filter</v-icon>
        </AppButton>
      </v-col>
      <v-col cols="3">
        <v-text-field v-if="showFilterInput" v-model="facilityNameFilter" placeholder="Filter by facility name"></v-text-field>
      </v-col>
      <v-col class="d-flex justify-end align-end">
        <AppButton variant="text">
          <v-icon left>mdi-plus</v-icon>
          Add new user
        </AppButton>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Users Table -->
        <v-skeleton-loader :loading="!usersAndFacilities" type="table-tbody">
          <v-data-table :headers="headersUsers" :items="filteredUserFacilities" item-key="contactId" item-value="contactId" show-expand density="compact" :expanded.sync="expanded">
            <!-- Slot to customize expand row event -->
            <template v-slot:item.data-table-expand="{ item }">
              <AppButton @click.stop="toggleExpand(item)" variant="text">
                {{ expanded[0] == item.contactId ? 'hide detail' : 'view' }}
              </AppButton>
            </template>

            <!-- Slots to translate specific column values into display values -->
            <template v-slot:item.roles="{ item }">
              <span>{{ getRoleDescriptions(item.roles) }}</span>
            </template>
            <template v-slot:item.isExpenseAuthority="{ item }">
              <span>{{ item.isExpenseAuthority ? 'Yes' : 'No' }}</span>
            </template>
            <template v-slot:item.stateCode="{ item }">
              <span>{{ getStatusDescription(item.stateCode) }}</span>
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
                    <v-col cols="11" class="pt-0 pb-0">
                      <!-- Facilities table -->
                      <v-data-table :headers="headersFacilities" :items="item.facilities" item-key="facilityId" density="compact">
                        <template v-slot:item.address="{ item }">{{ item.address }}, {{ item.city }}</template>
                        <template v-slot:bottom><!-- no paging --></template>
                      </v-data-table>
                    </v-col>
                    <v-col cols="6">
                      <AppButton variant="text">Add/remove facilities</AppButton>
                    </v-col>
                  </v-row>
                </td>
                <td class="pl-0">
                  <AppButton variant="text">Deactivate user</AppButton>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import { useAuthStore } from '@/stores/auth'
import rolesMixin from '@/mixins/rolesMixin.js'
import { CRM_STATE_CODES } from '@/utils/constants'
import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'

export default {
  components: { AppButton },
  mixins: [rolesMixin],
  data() {
    return {
      showFilterInput: false,
      facilityNameFilter: '',
      usersAndFacilities: null,
      expanded: [],
      headersUsers: [
        { title: '', key: 'data-table-expand', width: '135px' },
        { title: 'First Name', key: 'firstName', width: '10%' },
        { title: 'Last Name', key: 'lastName', width: '10%' },
        { title: 'Email', key: 'email', width: '12%' },
        { title: 'BCeID', key: 'userName', width: '12%' },
        { title: 'Role', key: 'roles', width: '12%' },
        { title: 'Expense Authority', key: 'isExpenseAuthority', width: '12%' },
        { title: 'Status', key: 'stateCode', width: '16%' },
      ],
      headersFacilities: [
        { title: 'Facility Name', key: 'name', width: '40%' },
        { title: 'Address', key: 'address', width: '60%' },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),

    filteredUserFacilities() {
      if (!this.facilityNameFilter) return this.sortUsers(this.usersAndFacilities)
      return this.sortUsers(this.usersAndFacilities.filter((user) => user.facilities.some((facility) => facility.name.toLowerCase().includes(this.facilityNameFilter.toLocaleLowerCase()))))
    },
  },
  async created() {
    try {
      const res = await ApiService.apiAxios.get(ApiRoutes.USER_FACILITIES + '/' + this.userInfo.organizationId)
      this.usersAndFacilities = res.data
    } catch (error) {
      console.log(`Failed to get the list of users by organization id - ${error}`)
    }
  },
  methods: {
    /**
     * Toggle the facility input filter
     */
    toggleShowFilter() {
      if (this.showFilterInput) {
        this.showFilterInput = false
        this.facilityNameFilter = ''
      } else {
        this.showFilterInput = true
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
     * Convert a comma separated string to an array of numbers
     */
    convertStringToArray(string) {
      return string.split(',').map(Number)
    },

    /**
     * Get a comma separated list of role descriptions from a comma separated list of role codes
     */
    getRoleDescriptions(roles) {
      const roleDescriptions = []
      const rolesArray = this.convertStringToArray(roles)
      rolesArray.forEach((role) => {
        roleDescriptions.push(this.getRoleDescription(role))
      })
      return roleDescriptions.join(', ')
    },

    // TODO: Hard coding of role names in this method is temporary. Will be replaced with endpoint call to get role names.
    /**
     * Get the role description for a role code
     */
    getRoleDescription(role) {
      switch (role) {
        case this.ROLES.ADMIN:
          return 'Admin'
        case this.ROLES.ACCOUNT_MANAGEMENT:
          return 'Account Management'
        case this.ROLES.FINANCIAL:
          return 'Financial'
        case this.ROLES.REPORTING:
          return 'Reporting'
      }
    },

    /**
     * Get the status description for a status code
     */
    getStatusDescription(statusCode) {
      switch (statusCode) {
        case CRM_STATE_CODES.ACTIVE:
          return 'Active'
        case CRM_STATE_CODES.INACTIVE:
          return 'Inactive'
      }
    },


    /**
     * Sort users by: account management role 1st, expense authority 2nd, last name 3rd
     */
    sortUsers(users) {
      return users.sort((a, b) => {
        // Check for account management role and sort by it, with true values first
        const roleA = a.roles.includes(this.ROLES.ACCOUNT_MANAGEMENT)
        const roleB = b.roles.includes(this.ROLES.ACCOUNT_MANAGEMENT)
        if (roleA && !roleB) return -1
        if (!roleA && roleB) return 1

        // If roles are the same, then sort by stateCode
        if (a.stateCode !== b.stateCode) {
          return a.stateCode - b.stateCode;
        }

        // If stateCode is the same, then sort by lastName
        return a.lastName.localeCompare(b.lastName);
      });
    }
  },
}
</script>

<style scoped>
:deep(div.v-data-table-footer) {
  padding-top: 20px !important;
}
</style>
