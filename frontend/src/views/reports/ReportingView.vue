<template>
  <OrganizationHeader :show-facility="false" />
  <v-container fluid v-bind="$attrs">
    <h1 class="mb-6">Reporting</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366" show-arrows>
        <v-tab value="pending-reports-tab">
          <v-icon size="large">mdi-history</v-icon>
          <strong class="ml-1">Pending Reports</strong>
        </v-tab>
        <v-tab value="reporting-history-tab">
          <v-icon size="large">mdi-finance</v-icon>
          <strong class="ml-1">Reporting History</strong>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="pending-reports-tab">
            <PendingReportsTab />
          </v-window-item>
          <v-window-item value="reporting-history-tab">
            <ReportingHistoryTab />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppBackButton from '@/components/ui/AppBackButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import PendingReportsTab from '@/components/reports/PendingReportsTab.vue'
import ReportingHistoryTab from '@/components/reports/ReportingHistoryTab.vue'

export default {
  name: 'ReportingView',
  components: { AppBackButton, OrganizationHeader, PendingReportsTab, ReportingHistoryTab },
  data() {
    return {
      tab: undefined
    }
  }
}
</script>
