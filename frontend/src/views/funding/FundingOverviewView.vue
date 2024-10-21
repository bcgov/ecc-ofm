<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs">
    <h1 class="mb-2">Funding</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366" show-arrows>
        <v-tab v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" value="agreements">
          <v-icon size="large">mdi-file-document-outline</v-icon>
          <strong>Funding Agreements</strong>
        </v-tab>
        <v-tab v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AMOUNTS)" value="payment-records">
          <v-icon size="large">mdi-history</v-icon>
          <strong>Payment Records</strong>
        </v-tab>
        <v-tab v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" value="funding-allocation">
          <v-icon size="large">mdi-call-split</v-icon>
          <strong>Funding Allocation</strong>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" value="agreements">
            <FundingAgreementsTab />
          </v-window-item>
          <v-window-item v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AMOUNTS)" value="payment-records">
            <PaymentRecordsTab />
          </v-window-item>
          <v-window-item v-if="hasPermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT)" value="funding-allocation">
            <FundingAllocationTab />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import FundingAgreementsTab from '@/components/funding/FundingAgreementsTab.vue'
import FundingAllocationTab from '@/components/funding/FundingAllocationTab.vue'
import PaymentRecordsTab from '@/components/funding/PaymentRecordsTab.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import permissionsMixin from '@/mixins/permissionsMixin'

export default {
  name: 'FundingOverviewView',
  components: { AppBackButton, FundingAgreementsTab, FundingAllocationTab, PaymentRecordsTab, OrganizationHeader },
  mixins: [permissionsMixin],
  data() {
    return {
      tab: null,
    }
  },
}
</script>
