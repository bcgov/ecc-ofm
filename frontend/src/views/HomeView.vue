<template>
  <div v-if="isAuthenticated && userInfo">
    <v-container>
      <v-card>
        <v-card-title>{{ isMinistryUser && !isImpersonating ? 'Ministry ' : 'Provider ' }}User</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>{{ isMinistryUser && !isImpersonating ? 'IDIR' : 'Business BCeID' }}:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.userName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>GUID:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.userId }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item v-if="!isMinistryUser && userInfo.businessName">
              <v-list-item-title>Business Legal Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.businessName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.firstName }} {{ userInfo.lastName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Email:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-if="!isMinistryUser || isImpersonating">
      <v-card>
        <v-card-title>Roles</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-subtitle>{{ userInfo.roles }} (WIP: will convert #s to descriptions)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-if="!isMinistryUser || isImpersonating">
      <v-card>
        <v-card-title>Organization</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>ID:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationId }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Account Number:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationAccountNumber }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Type:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.organizationAccountType }} (WIP: will convert # to description)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-if="!isMinistryUser || isImpersonating">
      <v-card>
        <v-card-title>Current Facility</v-card-title>
        <v-card-text>Facility Name: {{ currentFacility?.facilityName }}</v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  computed: {
    ...mapState(useAuthStore, ['currentFacility', 'userInfo', 'isAuthenticated', 'isMinistryUser', 'isImpersonating']),
  },
}
</script>

<style>
div.v-card-title {
  padding-bottom: 0px;
}
</style>
