<template>
  <OrganizationHeader :showFacility="false" />
  <v-container fluid v-bind="$attrs">
    <h1>Funding</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366">
        <v-tab value="agreements">
          <v-icon size="large">mdi-file-document-outline</v-icon>
          Funding Agreements
        </v-tab>
        <v-tab value="history">
          <v-icon size="large">mdi-history</v-icon>
          Funding History
        </v-tab>
        <v-tab value="upcoming">
          <v-icon size="large">mdi-currency-usd</v-icon>
          Upcoming Funding
        </v-tab>
        <v-tab value="analytics">
          <v-icon size="large">mdi-finance</v-icon>
          Funding Analytics
        </v-tab>
        <v-tab value="reallocation">
          <v-icon size="large">mdi-call-split</v-icon>
          Funding Re-allocation
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="agreements">
            <h2>Funding Details</h2>
            <v-data-table :headers="headers" :items="fundingAgreements" item-key="guid" :items-per-page="10" density="compact">
              <template #[`item.actions`]="{ item }">
                <v-btn v-if="item.status === 'FA Signature Pending'" variant="text" @click="this.$router.push({ name: 'funding', params: { fundingGuid: item.guid } })">
                  <v-icon size="large">mdi-signature-freehand</v-icon>
                </v-btn>
                <v-btn v-if="item.status === 'FA Submitted to Ministry'" variant="text" @click="this.$router.push({ name: 'funding', params: { fundingGuid: item.guid } })">
                  <v-icon size="large">mdi-folder-open-outline</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-window-item>
          <v-window-item value="history">Funding History</v-window-item>
          <v-window-item value="upcoming">Upcoming Funding</v-window-item>
          <v-window-item value="analytics">Funding Analytics</v-window-item>
          <v-window-item value="reallocation">Funding Re-allocation</v-window-item>
        </v-window>
      </v-card-text>
    </v-card>

    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'FundingOverviewView',
  components: { AppBackButton, OrganizationHeader },
  data() {
    return {
      tab: null,
      fundingAgreements: [
        {
          guid: 'e60816e0-5106-ef11-9f89-000d3af44815',
          faNumber: 'FA-123456',
          faType: 'Base Funding',
          facility: 'Facility 1',
          startDate: 'Nov 22, 2023',
          endDate: 'Nov 22, 2024',
          status: 'FA Signature Pending',
        },
        {
          guid: 'e60816e0-5106-ef11-9f89-000d3af44815',
          faNumber: 'FA-000002',
          faType: 'Supplementary Allowances',
          facility: 'Facility 2',
          startDate: 'May 15, 2023',
          endDate: 'May 15, 2024',
          status: 'FA Submitted to Ministry',
        },
      ],
      headers: [
        { title: 'FA Number', key: 'faNumber' },
        { title: 'FA Type', key: 'faType' },
        { title: 'Facility', key: 'facility' },
        { title: 'Start Date', key: 'startDate' },
        { title: 'End Date', key: 'endDate' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions' },
      ],
    }
  },
}
</script>

<style scoped></style>
