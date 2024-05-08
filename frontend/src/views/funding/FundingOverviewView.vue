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
            <v-card class="pa-4 mb-4 ml-1 mr-1 mt-1">
              <v-row>
                <v-col class="v-col-1">
                  <AppLabel>Facility:</AppLabel>
                </v-col>
                <v-col class="v-col-4">
                  <v-select
                    :items="userInfo.facilities"
                    v-model="selectedFacility"
                    item-title="facilityName"
                    label="Select"
                    :disabled="loading"
                    density="compact"
                    variant="outlined"
                    return-object />
                </v-col>
                <v-col class="v-col-2" />
                <v-col class="v-col-1">
                  <AppLabel>Date:</AppLabel>
                </v-col>
                <v-col>
                  <AppButtonRadioGroup :options="radioOptions" :defaultOption="selectedRadio" @input="updateSelectedOption" />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="v-col-1">
                  <AppLabel>Payment Type:</AppLabel>
                </v-col>
                <v-col class="v-col-4">
                  <v-row>
                    <v-checkbox label="Base Funding" />
                    <v-checkbox label="Supplementary Allowances" />
                    <v-checkbox label="Other" />
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
            <v-row class="d-flex flex-column align-end pb-3">
              <!-- ??? AppButton id="reset" :primary="false" size="large" width="100px" class="mr-8" @click="resetFilters()">Reset</AppButton -->
              <AppButton id="run-report" size="large" width="150px" class="mr-4" @click="search()">Search</AppButton>
            </v-row>
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
import AppButton from '@/components/ui/AppButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppButtonRadioGroup from '@/components/ui/AppButtonRadioGroup.vue'
import FundingAgreementService from '@/services/fundingAgreementService'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'FundingOverviewView',
  components: { AppButton, AppBackButton, AppLabel, AppButtonRadioGroup, OrganizationHeader },
  emits: ['update'],
  data() {
    return {
      tab: null,
      loading: false,
      selectedFacility: undefined,
      fundingAgreements: [
        {
          guid: '21d0d405-900c-ef11-9f89-000d3af44283',
          faNumber: 'FA-123456',
          faType: 'Base Funding',
          facility: 'Facility 1',
          startDate: 'Nov 22, 2023',
          endDate: 'Nov 22, 2024',
          status: 'FA Signature Pending',
        },
        {
          guid: '21d0d405-900c-ef11-9f89-000d3af44283',
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
      selectedRadio: 1,
      radioOptions: [
        { label: '3 Months', value: 1 },
        { label: '6 Months', value: 2 },
        { label: 'YTD', value: 3 },
        { label: 'Custom', value: 4 },
      ],
      fundingAgreements2: [],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
    await this.getFundingAgreements()
    console.log('Funding Overview View created: ', JSON.stringify(this.fundingAgreements2, null, 2))
  },
  methods: {
    updateSelectedOption(value) {
      this.selectedRadio = value
      console.log('Selected Radio:', value)
    },

    async getFundingAgreements() {
      for (let facility of this.userInfo.facilities) {
        try {
          const result = await FundingAgreementService.getActiveFundingAgreementByFacilityId(facility.facilityId);
          this.fundingAgreements2.push(result);
        } catch (error) {
          console.error(`Error getting funding agreements for facility ID ${facility.facilityId}:`, error);
        }
      }
    },

  },
}
</script>

<style scoped>
.custom-checkbox :deep(.v-input--selection-controls__input) {
  transform: scale(1.33);
}

.custom-checkbox :deep(.v-input--selection-controls__ripple::before) {
  background-color: blue;
}

.custom-checkbox :deep(.v-icon.v-icon--checkbox) {
  color: white;
}
</style>
