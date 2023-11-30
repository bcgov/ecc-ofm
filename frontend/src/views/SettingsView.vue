<template>
  <v-container v-if="usersAndFacilities" class="pa-2 ma-0 w-100">
    <v-row>
      <v-col class="text-start sub-header pt-0">
        Manage users
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto">
        <v-btn @click="toggleShowFilter()">
          Filter by facility
          <v-icon right>mdi-filter</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="3">
        <v-text-field
          v-if="showFilterInput"
          v-model="facilityNameFilter"
          placeholder="Filter by facility name"></v-text-field>
      </v-col>
      <v-col class="d-flex justify-end align-end">
        <span class="interactive-text-bold">+ Add new user</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Users Table -->
        <v-skeleton-loader :loading="!usersAndFacilities" type="table-tbody">
          <v-data-table
            :headers="headersUsers"
            :items="filteredUserFacilities"
            item-key="contactId"
            item-value="contactId"
            show-expand
            density="compact"
            :expanded.sync="expanded">

            <!-- Slot to customize expand row event -->
            <template v-slot:item.data-table-expand="{ item }">
              <span
                class="interactive-text"
                @click.stop="toggleExpand(item)">
                {{ expanded[0] == item.contactId ? 'hide details' : 'view' }}
              </span>
            </template>

            <!-- Slots to translate specific column values into display values -->
            <template v-slot:item.roles="{ item }">
              <span>{{ getRoleDescriptions(item.roles) }}</span>
            </template>
            <template v-slot:item.isExpenseAuthority="{ item }">
              <span>{{ (item.isExpenseAuthority) ? 'Yes' : 'No' }}</span>
            </template>
            <template v-slot:item.stateCode="{ item }">
              <span>{{ getStatusDescription(item.stateCode) }}</span>
            </template>

            <!-- Slot to customize expand row content -->
            <template v-slot:expanded-row="{ columns, item }">
              <tr>
                <td class="no-border-bottom"></td>
                <td :colspan="7" class="sub-table-header no-border-bottom">
                  Current facility access
                </td>
              </tr>
              <tr>
                <td class="no-border-bottom"></td>
                <td :colspan="5" class="no-border-bottom">
                  <!-- Facilities table -->
                  <v-data-table
                    :headers="headersFacilities"
                    :items="item.facilities"
                    item-key="facilityId"
                    class="table-facility">
                    <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
              <tr>
                <th v-for="column in columns" :key="column.key" :style="{ width: column.width }"
                  class="table-header-facility" @click="toggleSort(column)">
                  {{ column.title }}
                  <v-icon v-if="isSorted(column)" size="20" class="pa-0, ma-0">{{ getSortIcon(column) }}</v-icon>
                </th>
              </tr>
            </template>
            <template v-slot:item="{ item }">
              <tr>
                <td class="table-item-facility">{{ item.name }}</td>
                <td class="table-item-facility">{{ item.address }}, {{ item.city }}</td>
              </tr>
            </template>
            <template v-slot:bottom><!-- no paging --></template>
          </v-data-table>
          </td>
          <td class="no-border-bottom"></td>
          <td class="no-border-bottom interactive-text">
            Deactivate user
          </td>
          </tr>
          <tr>
            <td></td>
            <td :colspan="columns.length">
              <span class="interactive-text">Add/remove facilities</span>
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
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import rolesMixin from '@/mixins/rolesMixin.js'
import { CRM_STATE_CODES } from '@/utils/constants'
import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'

export default {
  mixins: [rolesMixin],
  data() {
    return {
      showFilterInput: false,
      facilityNameFilter: '',
      usersAndFacilities: null,
      expanded: [],
      headersUsers: [
        { title: '', key: 'data-table-expand', width: '6%' },
        { title: 'First Name', key: 'firstName', width: '10%' },
        { title: 'Last Name', key: 'lastName', width: '10%' },
        { title: 'Email', key: 'email', width: '12%' },
        { title: 'Username', key: 'userName', width: '12%' },
        { title: 'Role', key: 'roles', width: '12%' },
        { title: 'Expense Authority', key: 'isExpenseAuthority', width: '12%' },
        { title: 'Status', key: 'stateCode', width: '12%' },
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
      return this.usersAndFacilities.filter(user =>
        user.facilities.some(facility => facility.name.toLowerCase().includes(this.facilityNameFilter.toLocaleLowerCase())))
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
      const index = this.expanded.indexOf(item.contactId);
      if (index > -1) {
        // Collapse if already expanded
        this.expanded.splice(index, 1);
      } else {
        // Expand the clicked row
        this.expanded = [item.contactId];
      }
    },

    /**
     * Convert a comma separated string to an array of numbers
     */
    convertStringToArray(string) {
      return string.split(',').map(Number);
    },

    // TODO: Hard coding of role names in this method is temporary. Will be replaced with endpoint call to get role names.
    /**
     * Get the role description for role code(s)
     */
    getRoleDescriptions(roles) {
      const roleDescriptions = []
      const rolesArray = this.convertStringToArray(roles)
      rolesArray.forEach(role => {
        switch (role) {
          case this.ROLES.ADMIN:
            roleDescriptions.push('Admin')
            break
          case this.ROLES.ACCOUNT_MANAGEMENT:
            roleDescriptions.push('Account Management')
            break
          case this.ROLES.FINANCIAL:
            roleDescriptions.push('Financial')
            break
          case this.ROLES.REPORTING:
            roleDescriptions.push('Reporting')
            break
        }
      })
      return roleDescriptions.join(', ')
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
  },
}
</script>

<style scoped>
.sub-header {
  display: flex;
  color: #003366;
  font-weight: 600;
  font-size: 1.3em;
}

.table-facility {
  border: 1px solid #D9D9D9;
}

.table-header-facility {
  color: black !important;
  font-weight: bold !important;
  background-color: #D9D9D9;
  font-size: .90em;
  height: 23px !important;
}

.table-header-facility:hover {
  cursor: pointer;
}

.sub-table-header {
  color: #545454;
  font-weight: 600 !important;
}

td.table-item-facility {
  height: 23px !important;
  font-size: .90em !important;
}

.interactive-text,
.interactive-text-bold {
  color: #6699cc;
  cursor: pointer;
}

.interactive-text {
  font-weight: 500;
}

.interactive-text-bold {
  font-weight: bold;
}

.interactive-text:hover,
.interactive-text-bold:hover {
  text-decoration: underline;
}

.no-border-bottom {
  border-bottom: 0px !important;
}

>>>div.v-data-table-footer {
  padding-top: 20px !important;
}
</style>
