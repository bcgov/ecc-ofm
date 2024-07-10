<template>
  <AppHeroImage />
  <OrganizationHeader />
  <v-container v-bind="$attrs">
    <v-row>
      <v-col class="pa-1">
        <p class="home-overview page-overview">Welcome to your Management Portal - Connect with the program, view and manage accounts, applications, and reports</p>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col v-for="n in 6" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader :loading="loading" type="card" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="hasPermission(PERMISSIONS.SEARCH_VIEW_REPORTS)" cols="12" md="6" lg="4">
        <v-card class="basic-card" id="reporting-card" prepend-icon="mdi-file-chart-outline" title="Reporting" @click="$router.push({ name: 'reporting' })">
          <v-card-text>Complete or view current or past Monthly Reports and submit financial reports.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission([PERMISSIONS.VIEW_FUNDING_AGREEMENT, PERMISSIONS.VIEW_FUNDING_AMOUNTS])" cols="12" md="6" lg="4">
        <v-card class="basic-card" id="funding-card" prepend-icon="mdi-currency-usd" title="Funding" @click="$router.push({ name: 'funding-overview' })">
          <v-card-text>Review operational funding details by month or funding envelopes.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission([PERMISSIONS.MANAGE_NOTIFICATIONS])" cols="12" md="6" lg="4">
        <v-card class="basic-card" id="assistance-card" prepend-icon="mdi-message-text-outline" title="Assistance Request" @click="toggleAssistanceRequestDialog">
          <v-card-text>Have Questions? Send us a message.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_APPLICATIONS)" cols="12" md="6" lg="4">
        <v-card class="basic-card" id="applications-card" prepend-icon="mdi-file-document-multiple-outline" title="Applications" @click="$router.push({ name: 'applications-history' })">
          <v-card-text>Submit new or view applications for $10 a Day funding or Allowances.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_ORG_FACILITY, PERMISSIONS.MANAGE_USERS_VIEW)" cols="12" md="6" lg="4">
        <v-card class="basic-card" id="account-mgmt-card" prepend-icon="mdi-cog-outline" title="Account Management" @click="$router.push({ name: 'account-mgmt' })">
          <v-card-text>Maintain or edit organization or facility information and request a change.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="basic-card" id="help-card" prepend-icon="mdi-help-circle-outline" title="Help and Resources" @click="$router.push({ name: 'help' })">
          <v-card-text>Need support? Find program training tools and resources, technical help, or call us.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <SignFundingPopup v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" @loading="setLoading" />
  <NewRequestDialog v-if="hasPermission(PERMISSIONS.MANAGE_NOTIFICATIONS)" :show="showAssistanceRequestDialog" @close="toggleAssistanceRequestDialog" />
</template>

<script>
import SignFundingPopup from '@/components/funding/SignFundingPopup.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppHeroImage from '@/components/ui/AppHeroImage.vue'
import permissionsMixin from '@/mixins/permissionsMixin.js'

export default {
  name: 'HomeView',
  components: { AppHeroImage, NewRequestDialog, OrganizationHeader, SignFundingPopup },
  mixins: [permissionsMixin],
  emits: ['setLoading'],
  data() {
    return {
      loading: false,
      showAssistanceRequestDialog: false,
    }
  },
  methods: {
    setLoading(value) {
      this.loading = value
    },
    toggleAssistanceRequestDialog() {
      this.showAssistanceRequestDialog = !this.showAssistanceRequestDialog
    },
  },
}
</script>

<style scoped>
.home-overview {
  text-align: center;
}
</style>
