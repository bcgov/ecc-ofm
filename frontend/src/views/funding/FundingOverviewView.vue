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
                  <AppButtonRadioGroup v-model="selectedDateFilterType" :options="dateFilterTypes" :defaultOption="selectedDateFilterType" />
                </v-col>
              </v-row>
              <v-row>
                <v-col class="v-col-1">
                  <AppLabel>Payment Type:</AppLabel>
                </v-col>
                <v-col class="v-col-4">
                  <v-row>
                    <v-checkbox
                      v-for="(item, index) in paymentFilterTypes"
                      :key="index"
                      v-model="selectedPaymentFilterTypes"
                      :label="item.label"
                      :value="item.value" />
                  </v-row>
                </v-col>
                <v-col class="v-col-2" />
                <template v-if="selectedDateFilterType === 'Custom'">
                  <v-col class="v-col-1">
                    <AppLabel>Date Range:</AppLabel>
                  </v-col>
                  <v-col cols="auto">
                    <v-menu
                      v-model="menuStartDateFrom"
                      :close-on-content-click="false"
                      :nudge-right="800"
                      :nudge-bottom="200"
                      min-width="auto">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          id="start-date-from"
                          v-model="formattedStartDateFrom"
                          label="Start Date From"
                          style="width: 194px;"
                          prepend-icon="mdi-calendar"
                          v-bind="attrs"
                          @click="on && on.click"
                          @click:prepend="menuStartDateFrom = !menuStartDateFrom"></v-text-field>
                      </template>
                      <v-date-picker v-model="startDateFrom" @input="menuStartDateFrom = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="v-col-2">
                    <v-menu
                      v-model="menuStartDateTo"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          id="start-date-to"
                          v-model="formattedStartDateTo"
                          label="Start Date To"
                          prepend-icon="mdi-calendar"
                          style="width: 194px;"
                          v-bind="attrs"
                          @click="on && on.click"
                          @click:prepend="menuStartDateTo = !menuStartDateTo"></v-text-field>
                      </template>
                      <v-date-picker v-model="startDateTo" @input="menuStartDateTo = false"></v-date-picker>
                    </v-menu>
                  </v-col>
                </template>
              </v-row>
            </v-card>
            <v-row class="d-flex justify-end pb-3">
              <AppButton id="reset" :primary="false" size="large" width="100px" class="mr-8" @click="initialize()">Reset</AppButton>
              <AppButton id="search" size="large" width="150px" class="mr-4" @click="getFundingAgreements()">Search</AppButton>
            </v-row>
            <h2>Funding Details</h2>
            <v-data-table :headers="headers" :items="fundingAgreements" item-key="guid" :items-per-page="10" density="compact">
              <template #item.startDate="{ item }">
                {{ format.formatDate(item?.startDate) }}
              </template>
              <template #item.endDate="{ item }">
                {{ format.formatDate(item?.endDate) }}
              </template>
              <template #item.status="{ item }">
                <span :class="getStatusClass(item?.statusCode)" class="pt-1 pb-1 pl-2 pr-2">{{ item?.status }}</span>
              </template>
              <template #[`item.actions`]="{ item }">
                <v-btn v-if="item?.status === 'FA Signature Pending'" variant="text" @click="this.$router.push({ name: 'funding', params: { fundingGuid: item.fundingId } })">
                  <v-icon size="large">mdi-signature-freehand</v-icon>
                </v-btn>
                <v-btn v-if="['FA Submitted to Ministry', 'Active'].includes(item?.status)" variant="text" @click="this.$router.push({ name: 'funding', params: { fundingGuid: item.guid } })">
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
import ApplicationService from '@/services/applicationService'
import format from '@/utils/format'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { ApiRoutes } from '@/utils/constants'
import ApiService from '@/common/apiService'

export default {
  name: 'FundingOverviewView',
  components: { AppButton, AppBackButton, AppLabel, AppButtonRadioGroup, OrganizationHeader },
  data() {
    return {
      format,
      tab: null,
      loading: false,
      fundingAgreements: [],
      orgUsers: [],
      selectedFacility: null,
      selectedDateFilterType: null,
      selectedPaymentFilterTypes: [],
      startDateFrom: null,
      startDateTo: null,
      menuStartDateFrom: false,
      menuStartDateTo: false,
      headers: [
        { title: 'Funding Agreement Number', key: 'fundingAgreementNumber' },
        { title: 'Funding Agreement Type', key: 'fundingAgreementType' },
        { title: 'Facility Name', key: 'facility' },
        { title: 'Signing Expense Authority', key: 'expenseAuthorityName' },
        { title: 'Start Date', key: 'startDate' },
        { title: 'End Date', key: 'endDate' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions' },
      ],
      dateFilterTypes: [
        { label: '3 Months', value: '3Months' },
        { label: '6 Months', value: '6Months' },
        { label: 'YTD', value: 'YTD' },
        { label: 'Custom', value: 'Custom' },
      ],
      paymentFilterTypes: [
        { label: 'Base Funding', value: 'baseFunding' },
        { label: 'Supplementary Allowances', value: 'supplementaryAllowances' },
        { label: 'Other', value: 'other' },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    formattedStartDateFrom() {
      return this.startDateFrom ? format.formatDate(this.startDateFrom) : ''
    },
    formattedStartDateTo() {
      return this.startDateTo ? format.formatDate(this.startDateTo) : ''
    }

  },
  async created() {
    this.FUNDING_AGREEMENT_STATUS_CODES = FUNDING_AGREEMENT_STATUS_CODES
    this.initialize()
    await this.getOrgUsers() // Retrieve the list of users to retrieve the expense authority name
    await this.getFundingAgreements()
    console.log('this.fundingAgreements = ', JSON.stringify(this.fundingAgreements, null, 2))
  },
  methods: {
    initialize() {
      this.selectedFacility = null
      this.selectedDateFilterType = '3Months'
      this.selectedPaymentFilterTypes = ['baseFunding', 'supplementaryAllowances', 'other']
      this.startDateFrom = null
      this.startDateTo = null
    },

    async getOrgUsers() {
      try {
        this.loading = true
        const res = await ApiService.apiAxios.get(ApiRoutes.USER_PERMISSIONS_FACILITIES + '/' + this.userInfo.organizationId)
        this.orgUsers = res.data
      } catch (error) {
        this.setFailureAlert('Failed to get the list of users by organization id: ' + this.userInfo.organizationId, error)
      } finally {
        this.loading = false
      }
    },

    async getFundingAgreements() {
      try {
        this.fundingAgreements = []
        const startDateThreshold = this.startDateThreshold()
        const facilities = this.selectedFacility ? [this.selectedFacility] : this.userInfo.facilities
        for (let facility of facilities) {
          try {
            let payload
            if (this.selectedDateFilterType === 'Custom') {
              payload = await FundingAgreementService.getFAByFacilityIdAndStartFromEndDates(facility.facilityId, this.startDateFrom, this.startDateTo)
            } else {
              payload = await FundingAgreementService.getFAByFacilityIdAndStartDateThreshold(facility.facilityId, startDateThreshold)
            }
            if (!payload) continue
            await this.enrichFundingAgreementData(payload)
            this.fundingAgreements.push(payload)
          } catch (error) {
            console.error(`Error getting funding agreements for facility ID ${facility.facilityId}:`, error)
          }
        }
      } catch (error) {
        console.error(`Error getting funding agreements:`, error)
      }
    },

    async enrichFundingAgreementData(result) {
      if (result) {
        result.fundingAgreementType = 'Base Funding'
        result.facility = this.facilityName(result.facilityId)
        result.status = this.statusName(result.statusCode)
        result.expenseAuthorityName = await this.getExpenseAuthorityName(result.applicationId)
      }
    },

    async getExpenseAuthorityName(applicationId) {
      try {
        const application = await ApplicationService.getApplication(applicationId)
        if (!application?.expenseAuthorityId) return ''
        const expenseAuthorityUser = this.orgUsers.find(user => user.contactId === application.expenseAuthorityId)
        return `${expenseAuthorityUser?.firstName} ${expenseAuthorityUser?.lastName}`
      } catch (error) {
        console.error('Error getting expense authority name:', error)
        return ''
      }
    },

    updateSelectedDateFilterType(value) {
      this.selectedDateFilterType = value
      console.log('selectedDateFilterType = ', this.selectedDateFilterType)
    },

    startDateThreshold() {
      switch (this.selectedDateFilterType) {
        case '3Months':
          return this.dateByMonthsInPast(3)
        case '6Months':
          return this.dateByMonthsInPast(6)
        case 'YTD':
          return this.dateByMonthsInPast(12)
        default:
          return null
      }
    },

    dateByMonthsInPast(months) {
      const date = new Date()
      date.setMonth(date.getMonth() - months)
      return date.toISOString().split('T')[0]
    },

    facilityName(facilityId) {
      return this.userInfo.facilities.find(facility => facility.facilityId === facilityId).facilityName
    },

    statusName(statusCode) {
      switch (statusCode) {
        case FUNDING_AGREEMENT_STATUS_CODES.DRAFT:
          return 'Draft'
        case FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW:
          return 'FA Review'
        case FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING:
          return 'FA Signature Pending'
        case FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED:
          return 'FA Submitted to Ministry'
        case FUNDING_AGREEMENT_STATUS_CODES.FA_IN_REVIEW:
          return 'In Review with Ministry EA'
        case FUNDING_AGREEMENT_STATUS_CODES.ACTIVE:
          return 'Active'
        case FUNDING_AGREEMENT_STATUS_CODES.EXPIRED:
          return 'Expired'
        default:
          console.log('Unknown status code:', statusCode)
          return 'Unknown'
      }
    },

    getStatusClass(statusCode) {
      if (this.FUNDING_AGREEMENT_STATUS_CODES.DRAFT === statusCode) {
        return 'status-gray'
      } else if ([FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(statusCode)) {
        return 'status-green'
      } else if ([FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING].includes(statusCode)) {
        return 'status-yellow'
      } else if ([FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW, FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED].includes(statusCode)) {
        return 'status-blue'
      }
    },

  }
}
</script>
