<template>
  <AppHeroImage />
  <OrganizationHeader />
  <v-container v-bind="$attrs">
    <v-row>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </v-row>
    <v-row v-if="loading">
      <v-col v-for="n in 6" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader :loading="loading" type="card" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="hasPermission(PERMISSIONS.SEARCH_VIEW_REPORTS)" cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-file-chart-outline" title="Reporting" @click="$router.push({ name: 'reporting' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-currency-usd" title="Funding" @click="$router.push({ name: 'funding-overview' })">
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
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_APPLICATIONS)" cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-file-document-multiple-outline" title="Applications" @click="$router.push({ name: 'applications-history' })">
          <v-card-text>
            Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti. Duis aliquet non ipsum a feugiat. Mauris felis mi, feugiat eu placerat non,
            tempor a velit.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-cog-outline" title="Account Management" @click="$router.push({ name: 'account-mgmt' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
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
    </v-row>
  </v-container>

  <SignFundingPopup @loading="setloading" />
</template>

<script>
import AppHeroImage from '@/components/ui/AppHeroImage.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import SignFundingPopup from '@/components/funding/SignFundingPopup.vue'
import permissionsMixin from '@/mixins/permissionsMixin.js'

export default {
  name: 'HomeView',
  components: { AppHeroImage, OrganizationHeader, SignFundingPopup },
  mixins: [permissionsMixin],
  emits: ['setLoading'],
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    setloading(value) {
      this.loading = value
    },
  },
}
</script>

<style>
.home-card {
  border-top: 5px solid #003366 !important;
  min-height: 225px;
}
</style>
