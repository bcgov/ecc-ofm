<template>
  <v-container fluid>
    <h1>Update Organization Information</h1>
    <v-row>
      <v-col class="ml-6">
        <h4>Organization Details</h4>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="ml-6">
        <v-card>
          org info
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

import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export default {
  components: { AppButton, AppLabel },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
}
</script>
