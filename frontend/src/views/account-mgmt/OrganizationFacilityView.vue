<template>
  <v-container>
    <h1>Organization/Facilities</h1>
    <v-row>
      <v-col>
        <h3>Organization: {{ userInfo.organizationName }}</h3>
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

import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'

export default {
  components: { AppButton },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
}
</script>
