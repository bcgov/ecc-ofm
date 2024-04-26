<template>
  <v-container fluid>
    <h1>Account Management</h1>
    <v-card min-width="350px" max-width="50%">
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-icon>mdi-office-building</v-icon>
          </template>
          <router-link :to="{ name: 'manage-organization' }">Manage Organization/Facilities</router-link>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <router-link :to="{ name: 'manage-users' }">Manage Users</router-link>
        </v-list-item>
      </v-list>
    </v-card>
    <AppBackButton id="back-home-button" size="large" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppBackButton from '@/components/ui/AppBackButton.vue'
import rolesMixin from '@/mixins/rolesMixin.js'
import { mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  components: { AppBackButton },
  mixins: [rolesMixin],
  methods: {
    ...mapActions(useAuthStore, ['hasRole']),
  },
}
</script>
