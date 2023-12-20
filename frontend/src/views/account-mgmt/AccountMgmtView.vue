<template>
  <v-container fluid>
    <h1>Account Management</h1>
    <v-card min-width="350px" max-width="50%">
      <v-list>
        <v-list-item>
          <template v-slot:prepend>
            <v-icon>mdi-office-building</v-icon>
          </template>
          <router-link :to="{ name: 'organization-facility' }">Maintain Organization/Facilities</router-link>
        </v-list-item>
        <v-list-item>
          <template v-slot:prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <router-link :to="{ name: 'home' }">Maintain Users</router-link>
        </v-list-item>
      </v-list>
    </v-card>
    <AppButton id="back-home-button" class="mt-2" :primary="false" size="large" width="200px" :to="{ name: 'home' }">&larr; Back to Home</AppButton>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'

export default {
  components: { AppButton },
}
</script>
