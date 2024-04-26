<template>
  <v-container fluid v-bind="$attrs">
    <h1 class="mb-6">Reporting</h1>

    <h2 class="mb-6">{{ userInfo?.organizationName }}</h2>

    <p class="mb-6">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
      sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>

    <h2 class="mt-8 mb-4">Report Details</h2>
    <!-- 
    <v-card class="px-4 pt-4 pb-2" variant="outlined">
      <v-row no-gutters class="mb-6">
        <v-col cols="12" md="3" lg="2">
          <AppLabel>Select a facility:</AppLabel>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-select
            v-model="selectedFacility"
            :items="userInfo.facilities"
            item-title="facilityName"
            item-value="facilityId"
            label="Select facility to report on"
            density="compact"
            hide-details
            variant="outlined" />
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-6">
        <v-col cols="12" md="3" lg="2">
          <AppLabel>Select a fiscal year:</AppLabel>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-select v-model="selectedFiscalYear" :items="fiscalYears" item-title="name" density="compact" variant="outlined" hide-details return-object />
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-6">
        <v-col cols="12" md="3" lg="2">
          <AppLabel>Select reporting month:</AppLabel>
        </v-col>
        <v-col cols="12" md="4" lg="3">
          <v-select v-model="selectedReportingMonth" :items="months" item-title="name" density="compact" variant="outlined" hide-details return-object />
        </v-col>
      </v-row>
      <AppButton id="create-survey" :loading="processing" class="my-4" size="large" width="400px" @click="createSurveyResponse">Submit Monthly Report</AppButton>
    </v-card>
    <hr class="my-8" />
    <v-row>
      <v-col cols="12" sm="2" lg="1">
        <AppLabel>Facility:</AppLabel>
      </v-col>
      <v-col cols="12" sm="8" lg="5" xl="4">
        <v-select v-model="selectedFacility" :items="userInfo.facilities" item-title="facilityName" item-value="facilityId" label="Select facility to report on" density="compact" variant="outlined" />
      </v-col>
    </v-row> -->
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366">
        <v-tab value="history">
          <v-icon size="large">mdi-history</v-icon>
          Pending Reports
        </v-tab>
        <v-tab value="analytics">
          <v-icon size="large">mdi-finance</v-icon>
          Reporting History
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-skeleton-loader :loading="loading" type="table-tbody">
          <v-window v-model="tab">
            <v-window-item value="history">
              <!-- <v-card variant="outlined" class="pa-4 mb-4">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-row no-gutters>
                    <v-col cols="12" md="3" lg="2" class="mt-2">
                      <AppLabel>Report Types:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="9" lg="8">
                      <v-row no-gutters>
                        <v-col cols="6" sm="3">
                          <v-checkbox v-model="isCheckedMonthly" hide-details density="compact" label="Monthly" color="primary"></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox v-model="isCheckedAnnual" hide-details density="compact" label="Annual" color="primary"></v-checkbox>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-checkbox v-model="isCheckedOther" hide-details density="compact" label="Other" color="primary"></v-checkbox>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row>
                <v-col cols="auto" class="pb-0 pt-0" />
                <v-col cols="12" xs="12" sm="3" md="2" lg="1" xl="1" class="pb-0 pt-0">
                  <AppLabel>Date Range:</AppLabel>
                </v-col>
                <v-col cols="12" xs="12" sm="3" md="2" lg="2" xl="2" class="pb-0 pt-0">
                  <v-menu
                    ref="menuFromDate"
                    v-model="menuFromDate"
                    :close-on-content-click="false"
                    @update:model-value="(val) => (menuFromDate = val)"
                    transition="scale-transition"
                    offset-y
                    min-width="auto">
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="formattedFromDate"
                        label="From Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="{ ...on }"
                        density="compact"
                        variant="outlined"
                        @click:prepend="menuFromDate = !menuFromDate"></v-text-field>
                    </template>
                    <v-date-picker v-model="fromDate" @input="menuFromDate = false" :locale="locale"></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" xs="12" sm="3" md="2" lg="2" xl="2" class="pb-0 pt-0">
                  <v-menu ref="menuEndDate" v-model="menuEndDate" :close-on-content-click="false" @update:model-value="(val) => (menuEndDate = val)" transition="scale-transition" offset-y min-width="auto">
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="formattedEndDate"
                        label="To Date"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="{ ...on }"
                        density="compact"
                        variant="outlined"
                        @click:prepend="menuEndDate = !menuEndDate"></v-text-field>
                    </template>
                    <v-date-picker v-model="endDate" @input="menuEndDate = false" :locale="locale"></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
                  <v-row no-gutters class="mt-4">
                    <v-col cols="12" md="3" lg="2" class="my-2">
                      <AppLabel>Status:</AppLabel>
                    </v-col>
                    <v-col cols="12" md="9" lg="8">
                      <v-select v-model="selectedStatus" :items="statusTypes" item-title="title" item-value="id" label="Select status to report on" density="compact" variant="outlined" clearable />
                    </v-col>
                  </v-row>  -->
              <!-- <v-row>
                <v-col cols="4">
                  <AppLabel>Include Submitted:</AppLabel>
                </v-col>
                <v-col cols="1">
                  <v-checkbox v-model="includeSubmitted" density="compact"></v-checkbox>
                </v-col>
              </v-row>
              
                </v-col>
                <v-col cols="12" lg="6">
                  <AppDateFilter />
                </v-col>
              </v-row>
            </v-card> 
             <div no-gutters class="d-flex justify-end">
              <AppButton id="reset" :primary="false" size="large" width="100px" class="mr-8" @click="resetFilters()">Reset</AppButton>
              <AppButton id="run-report" size="large" :disabled="!selectedFacility" width="150px" @click="search()">Search</AppButton>
            </div> 
            <div align="right">
              <AppButton id="run-report" size="large" :disabled="!selectedFacility" width="150px" @click="search()">Search</AppButton>
            </div>-->

              <!-- <v-skeleton-loader :loading="loading" type="table-tbody">
              <v-data-table :headers="headers" :items="displayedFacilities" item-key="reportId" :items-per-page="15" density="compact">
                <template #[`item.alertType`]="{ item }">
                  <v-icon v-if="item.alertType === 'Due'" color="#c48600" size="34" title="Due now">mdi-alert</v-icon>
                  <v-icon v-else-if="item.alertType === 'Overdue'" color="error" size="34" title="Overdue">mdi-alert-octagon</v-icon>
                  <v-icon v-else-if="item.alertType === 'Completed'" color="success" size="34" title="Completed">mdi-check-circle</v-icon>
                </template>
                <template #[`item.actions`]="{ item }">
                  <router-link to="">
                    {{ item.actions }}
                  </router-link>
                </template>
              </v-data-table>
            </v-skeleton-loader> -->
              <AppAlertBanner v-if="isEmpty(pendingReports)" type="info" class="mt-4">
                <div>You are up to date with your monthly reports.</div>
              </AppAlertBanner>
              <PendingReportsTable v-else :pendingReports="pendingReports" />
            </v-window-item>
            <v-window-item value="analytics">Reporting History</v-window-item>
          </v-window>
        </v-skeleton-loader>
      </v-card-text>
    </v-card>

    <v-row class="my-2">
      <v-col cols="5">
        <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { SURVEY_RESPONSE_TYPES } from '@/utils/constants'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'

import AppLabel from '@/components/ui/AppLabel.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDateFilter from '@/components/ui/AppDateFilter.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import PendingReportsTable from '@/components/reports/PendingReportsTable.vue'

import FundingAgreementService from '@/services/fundingAgreementService'

import ReportsService from '@/services/reportsService'
import alertMixin from '@/mixins/alertMixin'
import reportMixin from '@/mixins/reportMixin'

import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export default {
  name: 'ReportingView',
  components: { AppAlertBanner, AppLabel, AppButton, AppBackButton, AppDateFilter, PendingReportsTable },
  mixins: [alertMixin, reportMixin],
  data() {
    return {
      loading: false,
      processing: false,
      facilities: [],
      displayedFacilities: [],
      annualFacilities: [],
      monthlyFacilities: [],
      otherFacilities: [],
      selectedFacility: null,
      selectedStatus: null,
      isCheckedAnnual: true,
      isCheckedMonthly: true,
      isCheckedOther: true,
      isSearched: false,
      includeSubmitted: false,
      fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      endDate: new Date(),
      menuFromDate: false,
      menuEndDate: false,
      locale: 'en',
      tab: undefined,
      selectedFiscalYear: undefined,
      selectedReportingMonth: undefined,
      statusTypes: [
        { id: 1, title: 'Draft' },
        { id: 2, title: 'Submitted' },
        { id: 3, title: 'Approved' },
      ],
      headers: [
        { title: 'Alert', key: 'alertType', width: '2%' },
        { title: 'Report ID', key: 'reportId' },

        { title: 'Title', key: 'title' },
        { title: 'Status', key: 'status' },

        { title: 'Report Type', key: 'reportType' },
        { title: 'Latest Activity', key: 'lastActivityDate' },
        { title: 'Actions', key: 'actions' },
      ],
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo', 'currentFacility']),
    ...mapState(useAppStore, ['fiscalYears', 'months']),
    formattedFromDate: {
      get() {
        return this.formatDate(this.fromDate)
      },
      set(val) {
        this.fromDate = this.parseDateString(val)
      },
    },

    formattedEndDate: {
      get() {
        return this.formatDate(this.endDate)
      },
      set(val) {
        this.endDate = this.parseDateString(val)
      },
    },

    defaultFiscalYear() {
      return this.fiscalYears?.find((fiscalYear) => fiscalYear.statusCode === 1)
    },

    defaultReportingMonth() {
      const currentMonthName = new Date().toLocaleString('en-ca', { month: 'long' })
      return this.months?.find((month) => month.name === currentMonthName)
    },

    surveyResponseType() {
      let responseType = SURVEY_RESPONSE_TYPES.MONTHLY
      if (['November'].includes(this.selectedReportingMonth?.name)) {
        responseType = SURVEY_RESPONSE_TYPES.QUARTERLY
      } else if (['December'].includes(this.selectedReportingMonth?.name)) {
        responseType = SURVEY_RESPONSE_TYPES.BI_ANNUAL
      }
      // TODO (vietle-cgi) Add ANNUAL type when we know which month to use
      return responseType
    },

    pendingReports() {
      let pendingReports = []

      return pendingReports
    },
  },

  async created() {
    this.selectedFacility = this.currentFacility.facilityId
    this.selectedFiscalYear = this.defaultFiscalYear
    this.selectedReportingMonth = this.defaultReportingMonth
    this.facilities = this.userInfo?.facilities
    await this.loadData()
    console.log(this.facilities)
    // this.search()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        await this.getFundingAgreementsForFacilities()
      } catch (error) {
        this.setFailureAlert('Failed to get funding agreement info for facilities ', error)
      } finally {
        this.loading = false
      }
    },

    async getFundingAgreementsForFacilities() {
      try {
        await Promise.all(
          this.facilities?.map(async (facility) => {
            facility.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByFacilityId(facility.facilityId)
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to get funding agreement info for facilities ', error)
      }
    },

    async getFacilityReportsSummary(selectedFacility) {
      try {
        this.facilities = await ReportsService.getFacilityReports(selectedFacility)
      } catch (error) {
        this.setFailureAlert('Failed to get latest reporting activity for facility = ' + selectedFacility, error)
      }
    },

    formatDate(date) {
      if (!(date instanceof Date)) return ''
      let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear()
      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day
      return [day, month, year].join('/')
    },

    parseDateString(dateStr) {
      const [day, month, year] = dateStr.split('/')
      return new Date(year, month - 1, day)
    },

    async search() {
      try {
        await this.getFacilityReportsSummary(this.selectedFacility)
        this.filter()
        this.isSearched = true
      } catch (error) {
        this.setFailureAlert('Failed to get latest reporting activity for facility = ' + this.selectedFacility, error)
      } finally {
        this.loading = false
      }
    },

    filter() {
      const reportTypes = []
      if (this.isCheckedAnnual) reportTypes.push('Annual')
      if (this.isCheckedMonthly) reportTypes.push('Monthly')
      if (this.isCheckedOther) reportTypes.push('Other')
      this.displayedFacilities = this.facilities.filter((facility) => reportTypes.includes(facility.reportType))

      if (this.selectedStatus) {
        const statusTitle = this.statusTypes.find(({ id }) => id === this.selectedStatus)?.title
        this.displayedFacilities = this.selectedStatus === 3 ? [] : this.facilities.filter(({ status }) => status === statusTitle)
      }
    },

    resetFilters() {
      this.facilities = []
      this.displayedFacilities = []
      this.selectedFacility = null
      this.selectedStatus = null
      this.isCheckedAnnual = true
      this.isCheckedMonthly = true
      this.isCheckedOther = true
      this.isSearched = false
      this.includeSubmitted = false
      this.fromDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      this.endDate = new Date()
      this.menuFromDate = false
      this.menuEndDate = false
      this.selectedFacility = this.currentFacility.facilityId
    },

    async createSurveyResponse() {
      try {
        this.processing = true
        const payload = {
          contactId: this.userInfo?.contactId,
          facilityId: this.selectedFacility,
          surveyId: '16fb81de-6dc1-ee11-9079-000d3af4865d',
          fiscalYearId: this.selectedFiscalYear?.fiscalYearId,
          reportingMonthId: this.selectedReportingMonth?.monthId,
          surveyResponseType: this.surveyResponseType,
        }
        const response = await ReportsService.createSurveyResponse(payload)
        if (response?.surveyResponseId) {
          this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: response?.surveyResponseId } })
        }
      } catch (error) {
        this.setFailureAlert('Failed to create new report response', error)
      } finally {
        this.processing = false
      }
    },
  },
}
</script>
