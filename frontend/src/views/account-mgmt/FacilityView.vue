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
        FACILITY CARD...
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6">
        <h4>Licenses</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="ml-6 pr-9 pt-0">
        <v-card class="pa-6" variant="outlined">
          <v-row>
            <v-col cols="11">
              <v-card v-for="(item, index) in userInfo.facilities"
                :key="index"
                clickable
                hover
                class="facility-card mr-4">{{ item.facilityName }}</v-card>
            </v-col>
            <v-col cols="1">
              <v-row justify="end">
                <v-icon>mdi-plus</v-icon>
                <v-icon>mdi-delete</v-icon>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <AppButton :primary="false" size="large" width="400px" :to="{ name: 'account-mgmt' }">&larr; Back to Account Management</AppButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import OrganizationInfo from '@/components/organizations/OrganizationInfo.vue'

import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export default {
  name: 'OrganizationFacilityView',
  components: { AppButton, AppLabel, OrganizationInfo },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
}
</script>

<style>
.facility-card {
  display: inline-block;
  max-width: 200px;
  width: auto;
  min-width: 0;
  height: auto;
  padding: 8px;
  border: 1px solid black;
  box-shadow: none;
  margin-right: 4px;
}
</style>
