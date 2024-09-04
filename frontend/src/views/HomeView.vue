<template>
  <v-row v-if="showReportsAlertBanner" no-gutters class="blue-background justify-center pa-2">
    <v-banner bg-color="#f9f1c6" :lines="$vuetify.display.smAndUp ? 'one' : 'two'" max-width="700px" rounded class="alert-banner">
      <template #text>
        <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
        <strong>You have one or more monthly reports that are due or overdue.</strong>
      </template>
      <template #actions>
        <router-link :to="{ name: 'reporting' }"><strong>Take Action</strong></router-link>
      </template>
    </v-banner>
  </v-row>
  <AppHeroImage />
  <OrganizationHeader :show-facility="false" />
  <v-container v-bind="$attrs">
    <v-row>
      <v-col class="pa-1">
        <p class="home-overview page-overview">Welcome to your Management Portal - Connect with the program, view and manage accounts, applications, and reports</p>
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-col v-for="n in 6" :key="n" cols="12" md="6" lg="4">
        <v-skeleton-loader :loading="isLoading" type="card" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col v-if="hasPermission(PERMISSIONS.SEARCH_VIEW_REPORTS)" cols="12" md="6" lg="4">
        <v-card id="reporting-card" class="basic-card" prepend-icon="mdi-file-chart-outline" title="Reporting" @click="$router.push({ name: 'reporting' })">
          <v-card-text>Complete or view current or past Monthly Reports and submit financial reports.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission([PERMISSIONS.VIEW_FUNDING_AGREEMENT, PERMISSIONS.VIEW_FUNDING_AMOUNTS])" cols="12" md="6" lg="4">
        <v-card id="funding-card" class="basic-card" prepend-icon="mdi-currency-usd" title="Funding" @click="$router.push({ name: 'funding-overview' })">
          <v-card-text>Review operational funding details by month or funding envelopes.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission([PERMISSIONS.MANAGE_NOTIFICATIONS])" cols="12" md="6" lg="4">
        <v-card id="assistance-card" class="basic-card" prepend-icon="mdi-message-text-outline" title="Assistance Request" @click="toggleAssistanceRequestDialog">
          <v-card-text>Have Questions? Send us a message.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_APPLICATIONS)" cols="12" md="6" lg="4">
        <v-card id="applications-card" class="basic-card" prepend-icon="mdi-file-document-multiple-outline" title="Applications" @click="$router.push({ name: 'applications-history' })">
          <v-card-text>Submit new or view applications for $10 a Day funding or Allowances.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="hasPermission(PERMISSIONS.VIEW_ORG_FACILITY, PERMISSIONS.MANAGE_USERS_VIEW)" cols="12" md="6" lg="4">
        <v-card id="account-mgmt-card" class="basic-card" prepend-icon="mdi-cog-outline" title="Account Management" @click="$router.push({ name: 'account-mgmt' })">
          <v-card-text>Maintain or edit organization or facility information and request a change.</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card
          id="help-card"
          class="basic-card"
          prepend-icon="mdi-help-circle-outline"
          title="Help and Resources"
          target="ofm_external_help"
          href="https://bcgov.sharepoint.com/sites/CCD-TDADExternal/SitePages/2023%20OFM%20Test.aspx">
          <v-card-text>Need support? Find program training tools, resources and technical help.</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <SignFundingPopup v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" @loading="setLoadingFA" />
  <NewRequestDialog v-if="hasPermission(PERMISSIONS.MANAGE_NOTIFICATIONS)" :show="showAssistanceRequestDialog" @close="toggleAssistanceRequestDialog" />
</template>

<script>
import { mapState } from 'pinia'

import SignFundingPopup from '@/components/funding/SignFundingPopup.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppHeroImage from '@/components/ui/AppHeroImage.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin.js'
import ReportsService from '@/services/reportsService'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'HomeView',
  components: { AppHeroImage, NewRequestDialog, OrganizationHeader, SignFundingPopup },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      loading: false,
      loadingFA: false,
      showAssistanceRequestDialog: false,
      pendingReportsCount: 0,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    isLoading() {
      return this.loading || this.loadingFA
    },
    showReportsAlertBanner() {
      return this.hasPermission(this.PERMISSIONS.SUBMIT_DRAFT_REPORTS) && this.pendingReportsCount > 0
    },
  },
  async created() {
    await this.loadPendingReportsCount()
  },
  methods: {
    setLoadingFA(value) {
      this.loadingFA = value
    },
    toggleAssistanceRequestDialog() {
      this.showAssistanceRequestDialog = !this.showAssistanceRequestDialog
    },
    async loadPendingReportsCount() {
      try {
        if (!this.hasPermission(this.PERMISSIONS.SUBMIT_DRAFT_REPORTS)) return
        this.loading = true
        this.pendingReportsCount = 0
        await Promise.all(
          this.userInfo?.facilities?.map(async (facility) => {
            const count = await ReportsService.getDraftSurveyResponsesCountByFacility(facility.facilityId)
            this.pendingReportsCount += count
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to get pending reports count for facilities ', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.home-overview {
  text-align: center;
}
.alert-banner {
  border: 1px solid rgb(252, 186, 25);
}

a[id='help-card']:hover {
  color: #313132;
}
</style>
