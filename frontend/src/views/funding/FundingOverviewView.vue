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
            <v-form ref="faForm" v-model="isFormComplete">
              <v-card class="d-flex ma-1" fluid>
                <v-row>
                  <v-col cols="12" sm="7" md="6" class="pl-0">
                    <v-card class="pa-4 mb-4 ml-1 mr-1 mt-1" elevation="0">
                      <v-row>
                        <v-col cols="12" sm="6" lg="2" xl="2">
                          <AppLabel>Facility:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="9" lg="8" xl="7">
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
                      </v-row>
                      <v-row>
                        <v-col cols="12" lg="2" xl="2">
                          <AppLabel>Payment Type:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="9" lg="9">
                          <v-row>
                            <v-checkbox v-for="(item, index) in PAYMENT_FILTER_TYPES" :key="index" v-model="selectedPaymentFilterTypes" :label="item.label" :value="item.value" :disabled="loading" />
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="10" md="6" class="pl-0 pr-0">
                    <v-card class="pa-4 mb-4 ml-1 mr-1 mt-1" elevation="0">
                      <v-row>
                        <v-col cols="12" sm="5" lg="2" xl="2">
                          <AppLabel>Date:</AppLabel>
                        </v-col>
                        <v-col cols="12" sm="12" lg="9" xl="7">
                          <AppButtonRadioGroup v-model="selectedDateFilterType" :disabled="loading" :options="DATE_FILTER_TYPES" :defaultOption="selectedDateFilterType" />
                        </v-col>
                      </v-row>
                      <v-row>
                        <template v-if="selectedDateFilterType === 'Custom'">
                          <v-col cols="12" sm="7" lg="2">
                            <AppLabel>Date Range:</AppLabel>
                          </v-col>
                          <v-col cols="12" sm="6" lg="5">
                            <v-menu v-model="menuStartDateFrom" :close-on-content-click="false" :nudge-right="800" :nudge-bottom="200" min-width="2">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  id="start-date-from"
                                  v-model="formattedStartDateFrom"
                                  label="Start Date From"
                                  style="width: 194px"
                                  prepend-icon="mdi-calendar"
                                  v-bind="attrs"
                                  :disabled="loading"
                                  :rules="[(v) => (!!v && moment(v, 'MM/DD/YYYY', true).isValid()) || 'Date must be in MM/DD/YYYY format']"
                                  @click="on && on.click"
                                  @click:prepend="menuStartDateFrom = !menuStartDateFrom"></v-text-field>
                              </template>
                              <v-date-picker v-model="startDateFrom" @input="menuStartDateFrom = false"></v-date-picker>
                            </v-menu>
                          </v-col>
                          <v-col cols="12" sm="7" lg="3">
                            <v-menu v-model="menuStartDateTo" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  id="start-date-to"
                                  v-model="formattedStartDateTo"
                                  label="Start Date To"
                                  prepend-icon="mdi-calendar"
                                  style="width: 194px"
                                  v-bind="attrs"
                                  :disabled="loading"
                                  :rules="[
                                    (v) => (!!v && moment(v, 'MM/DD/YYYY', true).isValid()) || 'Date must be in MM/DD/YYYY format',
                                    (v) => isValidEndDate({ startDate: formattedStartDateFrom, endDate: v }) || 'End date must be after start date',
                                  ]"
                                  @click="on && on.click"
                                  @click:prepend="menuStartDateTo = !menuStartDateTo"></v-text-field>
                              </template>
                              <v-date-picker v-model="startDateTo" @input="menuStartDateTo = false"></v-date-picker>
                            </v-menu>
                          </v-col>
                        </template>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
              <v-row class="d-flex justify-end pb-3 mt-1">
                <AppButton id="reset" :primary="false" size="large" width="100px" :loading="loading" class="mr-8" @click="resetFilter()">Reset</AppButton>
                <AppButton id="search" size="large" width="150px" class="mr-4" :loading="loading" @click="search()">Search</AppButton>
              </v-row>
              <h2>Funding Details</h2>
              <v-skeleton-loader :loading="loading" type="table-tbody">
                <v-data-table :headers="headers" :items="fundingAgreements" item-key="guid" :items-per-page="10" density="compact" v-model:sort-by="sortBy">
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
                    <v-btn v-if="['FA Submitted to Ministry', 'Active'].includes(item?.status)" variant="text" @click="this.$router.push({ name: 'funding', params: { fundingGuid: item.fundingId } })">
                      <v-icon size="large">mdi-folder-open-outline</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
              </v-skeleton-loader>
            </v-form>
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
import moment from 'moment'
import { mapState } from 'pinia'

import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppButtonRadioGroup from '@/components/ui/AppButtonRadioGroup.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin.js'
import FundingAgreementService from '@/services/fundingAgreementService'
import { useAuthStore } from '@/stores/auth'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'
import { isValidEndDate } from '@/utils/validation.js'

const STATUS_UNKNOWN = 'Unknown'

const DATE_FILTER_TYPE_VALUES = {
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  YTD: 'YTD',
  CUSTOM: 'Custom',
}

const PAYMENT_FILTER_TYPE_VALUES = {
  BASE_FUNDING: 'Base Funding',
  SUPPLEMENTARY_ALLOWANCES: 'Supplementary Allowances',
  OTHER: 'Other',
}

const statusNameMap = {
  [FUNDING_AGREEMENT_STATUS_CODES.DRAFT]: 'Draft',
  [FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW]: 'FA Review',
  [FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING]: 'FA Signature Pending',
  [FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED]: 'FA Submitted to Ministry',
  [FUNDING_AGREEMENT_STATUS_CODES.FA_IN_REVIEW]: 'In Review with Ministry EA',
  [FUNDING_AGREEMENT_STATUS_CODES.ACTIVE]: 'Active',
  [FUNDING_AGREEMENT_STATUS_CODES.EXPIRED]: 'Expired',
  [FUNDING_AGREEMENT_STATUS_CODES.TERMINATED]: 'Terminated',
}

export default {
  name: 'FundingOverviewView',
  components: { AppButton, AppBackButton, AppLabel, AppButtonRadioGroup, OrganizationHeader },
  mixins: [alertMixin],
  data() {
    return {
      format,
      moment,
      tab: null,
      isFormComplete: false,
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
        { title: 'Signing Expense Authority', key: 'expenseAuthority' },
        { title: 'Start Date', key: 'startDate' },
        { title: 'End Date', key: 'endDate' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions' },
      ],
      sortBy: [{ key: 'priority', order: 'desc' }],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    startDateThreshold() {
      switch (this.selectedDateFilterType) {
        case DATE_FILTER_TYPE_VALUES.THREE_MONTHS:
          return this.dateByMonthsInPast(3)
        case DATE_FILTER_TYPE_VALUES.SIX_MONTHS:
          return this.dateByMonthsInPast(6)
        case DATE_FILTER_TYPE_VALUES.YTD:
          return this.dateByMonthsInPast(12)
        default:
          return null
      }
    },
    formattedStartDateFrom: {
      get() {
        if (moment(this.startDateFrom, true).isValid()) {
          return this.startDateFrom ? moment(this.startDateFrom).format('MM/DD/YYYY') : null
        }
        return this.startDateFrom
      },
      set(value) {
        this.startDateFrom = value
      },
    },
    formattedStartDateTo: {
      get() {
        if (moment(this.startDateTo, true).isValid()) {
          return this.startDateTo ? moment(this.startDateTo).format('MM/DD/YYYY') : null
        }
        return this.startDateTo
      },
      set(value) {
        this.startDateTo = value
      },
    },
  },

  async created() {
    this.PAYMENT_FILTER_TYPES = [
      { label: PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING, value: PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING },
      { label: PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES, value: PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES },
      { label: PAYMENT_FILTER_TYPE_VALUES.OTHER, value: PAYMENT_FILTER_TYPE_VALUES.OTHER },
    ]

    this.DATE_FILTER_TYPES = [
      { label: DATE_FILTER_TYPE_VALUES.THREE_MONTHS, value: DATE_FILTER_TYPE_VALUES.THREE_MONTHS },
      { label: DATE_FILTER_TYPE_VALUES.SIX_MONTHS, value: DATE_FILTER_TYPE_VALUES.SIX_MONTHS },
      { label: DATE_FILTER_TYPE_VALUES.YTD, value: DATE_FILTER_TYPE_VALUES.YTD },
      { label: DATE_FILTER_TYPE_VALUES.CUSTOM, value: DATE_FILTER_TYPE_VALUES.CUSTOM },
    ]

    this.resetFilter()
    await this.loadFundingAgreements()
  },
  methods: {
    isValidEndDate,

    resetFilter() {
      this.selectedFacility = null
      this.selectedDateFilterType = DATE_FILTER_TYPE_VALUES.THREE_MONTHS
      this.selectedPaymentFilterTypes = [PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING, PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES, PAYMENT_FILTER_TYPE_VALUES.OTHER]
      this.startDateFrom = null
      this.startDateTo = null
    },

    /**
     * TODO: Payment type is displayed in UI but is not yet integrated into this method as required CRM data is not yet in place.
     * This is a know issue and postponed to a future sprint.
     */
    async loadFundingAgreements() {
      try {
        this.loading = true
        this.fundingAgreements = []
        const facilities = this.selectedFacility ? [this.selectedFacility] : this.userInfo.facilities

        await Promise.all(
          facilities?.map(async (facility) => {
            let facilityFas = []
            if (this.selectedDateFilterType === 'Custom') {
              facilityFas = await FundingAgreementService.getFAsByFacilityIdAndStartDate(facility.facilityId, this.startDateFrom, this.startDateTo)
            } else {
              facilityFas = await FundingAgreementService.getFAsByFacilityIdAndStartDate(facility.facilityId, this.startDateThreshold)
            }
            if (facilityFas) {
              facilityFas.forEach((fa) => {
                fa.fundingAgreementType = PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING
                fa.facility = facility.facilityName
                fa.status = statusNameMap[fa.statusCode] ?? STATUS_UNKNOWN
              })
              this.fundingAgreements.push(...facilityFas)
            }
          }),
        )

        this.fundingAgreements.forEach((fa) => {
          if (fa.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING) {
            fa.priority = 1
          } else {
            fa.priority = 0
          }
        })

        console.log(this.fundingAgreements)
      } catch (error) {
        this.setFailureAlert('Failed to load funding agreements', error)
      } finally {
        this.loading = false
      }
    },

    async search() {
      this.$refs.faForm?.validate()
      if (!this.isFormComplete) {
        return
      }
      await this.loadFundingAgreements()
    },

    dateByMonthsInPast(months) {
      const date = new Date()
      date.setMonth(date.getMonth() - months)
      return date.toISOString().split('T')[0]
    },

    getStatusClass(statusCode) {
      return {
        'status-gray': [FUNDING_AGREEMENT_STATUS_CODES.DRAFT, FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(statusCode),
        'status-yellow': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING,
        'status-green': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED,
        'status-purple': statusCode === FUNDING_AGREEMENT_STATUS_CODES.EXPIRED,
        'status-red': statusCode === FUNDING_AGREEMENT_STATUS_CODES.TERMINATED,
      }
    },
  },
}
</script>
