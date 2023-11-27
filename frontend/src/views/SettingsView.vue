<template>
  <v-container v-if="usersAndFacilities" class="pa-2 ma-0 w-100">
    <v-row>
      <v-col class="text-start page-header">
        Manage users
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn>Filter by facility</v-btn>
      </v-col>
      <v-col>
        <v-btn>+ Add new user</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Users Table -->
        <v-data-table-virtual
          :headers="headersUsers"
          :items="usersAndFacilities"
          item-key="id"
          show-expand
          density="compact"
          :expanded.sync="expanded">

          <!-- Slot to customize expand row event -->
          <template v-slot:item.data-table-expand="{ item }">
            <span @click.stop="toggleExpand(item)"
              class="interactive-text">{{ this.expanded[0] == item.id ? 'hide details' : 'view' }}</span>
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
          <td :colspan="columns.length" class="interactive-text">
            <div style="text-align: left;">Add/remove facilities</div>
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
  },
  created() {
    this.getUsersFacilities(this.organizationId)
  },
  methods: {
    ...mapActions(useUsersStore, ['getUsersFacilitiesByOrganizationId']),

    async getUsersFacilities(organizationId) {
      try {
        await this.getUsersFacilitiesByOrganizationId(organizationId)
        console.log('usersAndFacilities', this.usersAndFacilities)
      } catch (error) {
        //this.setFailureAlert('An error occurred while trying to load users and facilities')
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
  border: 1px solid black;
}

.table-header-facility {
  color: black !important;
  font-weight: bold !important;
  background-color: #D9D9D9;
  border-bottom: 1px solid black !important;
  font-size: .90em;
}

.sub-table-header {
  color: #545454;
  font-weight: 600 !important;
}

.table-item-facility {
  font-size: .90em;
}

.interactive-text {
  color: #6699cc;
  font-weight: 500;
}

.interactive-text:hover {
  color: #6699cc;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;
}

.no-border-bottom {
  border-bottom: 0px !important;
}
</style>
