<template>
  <v-container v-if="usersAndFacilities" class="pa-2 ma-0 w-100">
    <v-row>
      <v-col class="text-start page-header">
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
        <v-data-table-virtual
          :headers="headersUsers"
          :items="filteredUserFacilities"
          item-key="id"
          show-expand
          density="compact"
          :expanded.sync="expanded">

          <!-- Slot to customize expand row event -->
          <template v-slot:item.data-table-expand="{ item }">
            <span
              class="interactive-text"
              @click.stop="toggleExpand(item)">
              {{ expanded[0] == item.id ? 'hide details' : 'view' }}
            </span>
          </template>

          <!-- Slot to customize expand row content -->
          <template v-slot:expanded-row="{ columns, item }">
            <tr>
              <td class="no-border-bottom"></td>
              <td :colspan="columns.length - 1" class="sub-table-header no-border-bottom">
                Current facility access
              </td>
            </tr>
            <tr>
              <td class="no-border-bottom"></td>
              <td :colspan="5" class="no-border-bottom">
                <!-- Facilities table -->
                <v-data-table-virtual
                  :headers="headersFacilities"
                  :items="item.facilities"
                  item-key="name"
                  class="table-facility"
                  density="desnse">
                  <template #headers="{ columns }">
            <tr>
              <th v-for="column in columns" :key="column.key" :style="{ width: column.width }"
                class="table-header-facility">
                {{ column.title }}
              </th>
            </tr>
          </template>
          <template v-slot:item.name="{ item }">
            <span class="table-item-facility">{{ item.name }}</span>
          </template>
          <template v-slot:item.address="{ item }">
            <span class="table-item-facility">{{ item.address }}, {{ item.city }}</span>
          </template>
        </v-data-table-virtual>
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
        </v-data-table-virtual>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

export default {
  data() {
    return {
      organizationId: 9191919191,
      showFilterInput: false,
      facilityNameFilter: '',
      expanded: [],
      headersUsers: [
        { title: '', key: 'data-table-expand', width: '6%' },
        { title: 'First Name', key: 'firstname', width: '10%' },
        { title: 'Last Name', key: 'lastname', width: '10%' },
        { title: 'Email', key: 'email', width: '12%' },
        { title: 'Username', key: 'bceidusername', width: '12%' },
        { title: 'Role', key: 'userrole', width: '12%' },
        { title: 'Expense Authority', key: 'expenseAuthority', width: '12%' },
        { title: 'Status', key: 'status', width: '12%' },
      ],
      headersFacilities: [
        { title: 'Facility Name', key: 'name', width: '40%' },
        { title: 'Address', key: 'address', width: '60%' },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useUsersStore, ['usersAndFacilities']),
    filteredUserFacilities() {
      return this.usersAndFacilities.filter(user =>
        user.facilities.some(facility => facility.name.toLowerCase().includes(this.facilityNameFilter.toLocaleLowerCase())))
    },
  },
  created() {
    this.getUsersFacilities(this.organizationId)
  },
  methods: {
    ...mapActions(useUsersStore, ['getUsersFacilitiesByOrganizationId']),

    async getUsersFacilities(organizationId) {
      await this.getUsersFacilitiesByOrganizationId(organizationId)
    },

    toggleShowFilter() {
      if (this.showFilterInput) {
        this.showFilterInput = false
      } else {
        this.showFilterInput = true
      }
    },

    toggleExpand(item) {
      const index = this.expanded.indexOf(item.id);
      if (index > -1) {
        // Collapse if already expanded
        this.expanded.splice(index, 1);
      } else {
        // Expand the clicked row
        this.expanded = [item.id];
      }
    },
  },
}
</script>

<style>
.page-header {
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
}

.sub-table-header {
  color: #545454;
  font-weight: 600 !important;
}

.table-item-facility {
  font-size: .90em;
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
</style>
