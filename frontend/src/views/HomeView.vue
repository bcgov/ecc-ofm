<template>
  <v-col cols="12" align="center" class="pa-0">
    <v-img src="@/assets/images/home-header-img.jpg" class="align-end">
      <v-col align="center" style="background-color: rgb(28, 115, 158, 0.85)" class="hidden-sm-and-down">
        <span class="text-h4 text-white font-weight-bold">Early Childhood Care - Operating Funding Model</span>
      </v-col>
    </v-img>
  </v-col>
  <v-container>
    <v-row align="center" justify="center"></v-row>
    <v-row>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-file-chart-outline" title="Reporting" @click="$router.push({ name: 'reporting' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-currency-usd" title="Funding" @click="$router.push({ name: 'funding' })">
          <v-card-text>
            Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit a. Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-folder-outline" title="Documents" @click="$router.push({ name: 'documents' })">
          <v-card-text>
            Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc. Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit
            a.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-file-document-multiple-outline" title="View Applications" @click="$router.push({ name: 'applications' })">
          <v-card-text>
            Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti. Duis aliquet non ipsum a feugiat. Mauris felis mi, feugiat eu placerat non,
            tempor a velit.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-file-document-edit-outline" title="New Application" @click="$router.push({ name: 'applications' })">
          <v-card-text>
            Curabitur molestie pulvinar sapien. Aenean aliquet dolor at mollis laoreet. Duis vel placerat lectus, eu rutrum turpis. Morbi consequat, purus et tempus iaculis, sapien massa rhoncus ex,
            sed consectetur leo odio in magna.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-help" title="Resources" @click="$router.push({ name: 'resources' })">
          <v-card-text>
            Curabitur molestie pulvinar sapien. Aenean aliquet dolor at mollis laoreet. Duis vel placerat lectus, eu rutrum turpis. Morbi consequat, purus et tempus iaculis, sapien massa rhoncus ex,
            sed consectetur leo odio in magna.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4" v-if="hasRole(ROLES.ACCOUNT_MANAGEMENT)">
        <v-card class="home-card" prepend-icon="mdi-cog-outline" title="Settings" @click="$router.push({ name: 'settings' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'pinia'

import rolesMixin from '@/mixins/rolesMixin.js'
import { useAuthStore } from '@/stores/auth'

export default {
  mixins: [rolesMixin],
  methods: {
    ...mapActions(useAuthStore, ['hasRole']),
  },
}
</script>

<style>
.home-card {
  border-top: 5px solid #003366 !important;
  min-height: 225px;
}

.home-card-disabled {
  border-top: 5px solid #909090 !important;
  min-height: 225px;
}
</style>
