<template>
  <v-container>
    <h1>Account Management</h1>
    <!-- <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-account-group" title="Maintain Organization/Facilities" @click="$router.push({ name: 'organization-facility' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-office-building title="Maintain Users" @click="$router.push({ name: 'home' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row> -->
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
