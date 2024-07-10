<template>
  <v-container fluid>
    <h1>Account Management</h1>
    <v-row>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_ORG_FACILITY)" cols="12" md="6" lg="4">
        <v-card class="account-card" id="org-facilities-card" prepend-icon="mdi-office-building" title="Manage Organizations/Facilities" @click="$router.push({ name: 'manage-organization' })">
          <v-card-text>
            <p>View and update organization/facility details</p>
            <ul>
              <li>Mailing address</li>
              <li>Contact info</li>
              <li>Primary contact</li>
              <li>Expense Authority</li>
              <li>Facility phone/email</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.MANAGE_USERS_VIEW)" cols="12" md="6" lg="4">
        <v-card class="account-card" id="manage-users-card" prepend-icon="mdi-account-group" title="Manage Facility Users" @click="$router.push({ name: 'manage-users' })">
          <v-card-text>
            <p>Manage facility users</p>
            <ul>
              <li>Add new users</li>
              <li>Edit user role</li>
              <li>View user contact information</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <AppBackButton id="back-home-button" size="large" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppBackButton from '@/components/ui/AppBackButton.vue'
import permissionsMixin from '@/mixins/permissionsMixin'

export default {
  components: { AppBackButton },
  mixins: [permissionsMixin],
}
</script>

<style scoped>
.account-card {
  border-top: 5px solid #003366 !important;
  min-height: 250px;
}

ul {
  padding-left: 25px;
  list-style-type: disc;
}

li {
  margin-top: 3px;
}
</style>
