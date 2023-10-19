<template>
  <div v-if="isAuthenticated && userInfo">
    <v-container>
      <v-card>
        <v-card-title>
          User
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>Username:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.username }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>User ID:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.userId }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Given Name:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.firstName }} {{ userInfo.firstName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Email:</v-list-item-title>
              <v-list-item-subtitle>{{ userInfo.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>
          Roles
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-subtitle>{{ userInfo.roles }} (WIP: will convert #s to descriptions)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>
          Organization
        </v-card-title>
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
              <v-list-item-subtitle>{{ userInfo.organizationAccountType }} (WIP: will convert # to
                description)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>
          Facilities
        </v-card-title>
        <v-card-text>
          <!-- TODO fix: v-list with v-for is throughing warning in browser concole -->
          <v-list v-for="(facility, index) in userInfo.facilityPermission" :key="index">
            <v-list-item>
              <v-list-item-title>Facility ID:</v-list-item-title>
              <v-list-item-subtitle>{{ facility.facilityId }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Facility Account Number:</v-list-item-title>
              <v-list-item-subtitle>{{ facility.facilityAccountNumber }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Facility Name:</v-list-item-title>
              <v-list-item-subtitle>{{ facility.facilityName }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Facility Type:</v-list-item-title>
              <v-list-item-subtitle>{{ facility.facilityType }} (WIP: will convert # to
                description)</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated'])
  },
}
</script>

<style>
div.v-card-title {
  padding-bottom: 0px;
}
</style>