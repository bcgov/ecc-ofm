<template>
  <OrganizationHeader :showFacility="false" />
  <v-container fluid v-bind="$attrs">
    <h1 class="mb-6">Reporting</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366">
        <v-tab value="pending-reports-table">
          <v-icon size="large">mdi-history</v-icon>
          <strong class="ml-1">Pending Reports</strong>
        </v-tab>
        <v-tab value="reporting-history-table">
          <v-icon size="large">mdi-finance</v-icon>
          <strong class="ml-1">Reporting History</strong>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-skeleton-loader :loading="loading" type="table-tbody">
          <v-container fluid class="pa-0">
            <v-window v-model="tab">
              <v-window-item value="pending-reports-table">
                <AppAlertBanner v-if="isEmpty(pendingReports)" type="info" class="mt-4">
                  <div>You are up to date with your monthly reports.</div>
                </AppAlertBanner>
                <PendingReportsTab v-else :loading="loading" :pendingReports="pendingReports" :facilities="facilities" />
              </v-window-item>
              <v-window-item value="reporting-history-table">
                <AppAlertBanner v-if="isEmpty(submittedReports)" type="info" class="mt-4">
                  <div>You have no submitted reports.</div>
                </AppAlertBanner>
                <ReportingHistoryTab v-else :loading="loading" :submittedReports="submittedReports" :facilities="facilities" />
              </v-window-item>
            </v-window>
          </v-container>
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
import moment from 'moment'
import { isEmpty } from 'lodash'
import { SURVEY_IDS, BLANK_FIELD, SURVEY_RESPONSE_STATUSES, SURVEY_RESPONSE_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import PendingReportsTab from '@/components/reports/PendingReportsTab.vue'
import ReportingHistoryTab from '@/components/reports/ReportingHistoryTab.vue'
import FundingAgreementService from '@/services/fundingAgreementService'
import ReportsService from '@/services/reportsService'
import alertMixin from '@/mixins/alertMixin'
import reportMixin from '@/mixins/reportMixin'
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export default {
  name: 'ReportingView',
  components: { AppAlertBanner, AppBackButton, OrganizationHeader, PendingReportsTab, ReportingHistoryTab },
  mixins: [alertMixin, reportMixin],
  data() {
    return {
      loading: false,
      processing: false,
      facilities: [],
      tab: undefined,
      surveyResponses: [],
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getMonthIdByName', 'getFiscalYearIdByDate', 'getFiscalYearIdsByDates', 'getFiscalYearNameById']),

    pendingReports() {
      const pendingReports = []
      this.facilities?.forEach((facility) => {
        const reportingMonths = this.getMonthsBetweenDates(facility.fundingAgreement?.startDate, facility.fundingAgreement?.endDate)
        reportingMonths?.forEach((month) => {
          const monthName = moment(month).format('MMMM')
          const monthId = this.getMonthIdByName(monthName)
          const fiscalYearId = this.getFiscalYearIdByDate(month)
          const fiscalYearName = this.getFiscalYearNameById(fiscalYearId)
          const surveyResponse = this.surveyResponses?.find((item) => item.facilityId === facility.facilityId && item.fiscalYearId === fiscalYearId && item.reportingMonthId === monthId)
          const isPreviousMonth = moment().startOf('month').isAfter(moment(month))
          const hasNotSubmittedResponse = isEmpty(surveyResponse) || !this.isResponseSubmitted(surveyResponse)
          if (isPreviousMonth && hasNotSubmittedResponse) {
            pendingReports.push({
              contactId: this.userInfo?.contactId,
              surveyResponseId: surveyResponse?.surveyResponseId,
              surveyResponseReferenceNumber: surveyResponse?.surveyResponseReferenceNumber ?? BLANK_FIELD,
              alertType: this.getSurveyResponseAlertType(month),
              title: `Monthly Report - ${monthName} ${fiscalYearName}`,
              facilityId: facility.facilityId,
              facilityName: facility.facilityName,
              reportingMonthId: monthId,
              reportingMonthName: monthName,
              fiscalYearId: fiscalYearId,
              status: !isEmpty(surveyResponse) ? SURVEY_RESPONSE_STATUSES.DRAFT : BLANK_FIELD,
              latestActivity: surveyResponse?.latestActivity ? format.formatDate(surveyResponse?.latestActivity) : BLANK_FIELD,
            })
          }
        })
      })
      return pendingReports
    },

    submittedReports() {
      const submittedReports = this.surveyResponses?.filter((response) => this.isResponseSubmitted(response))
      submittedReports?.forEach((response) => {
        response.submittedDate = format.formatDate(response?.endDate)
        response.status = response?.isSubmittedLate ? SURVEY_RESPONSE_STATUSES.COMPLETED_LATE : SURVEY_RESPONSE_STATUSES.COMPLETED
      })
      submittedReports?.sort((a, b) => {
        const dateA = new Date(a.submittedDate)
        const dateB = new Date(b.submittedDate)
        return dateB - dateA // descending order (most recent Submitted Date at the top)
      })
      return submittedReports
    },
  },

  async created() {
    this.facilities = this.userInfo?.facilities
    await this.loadData()
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        await this.getFundingAgreementsForFacilities()
        await this.getSurveyResponsesForFacilities()
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

    async getSurveyResponsesForFacilities() {
      try {
        await Promise.all(
          this.facilities?.map(async (facility) => {
            const fiscalYearIds = this.getFiscalYearIdsByDates(facility.fundingAgreement?.startDate, facility.fundingAgreement?.endDate)
            await Promise.all(
              fiscalYearIds?.map(async (fiscalYearId) => {
                const responses = await ReportsService.getSurveyResponsesBySurveyAndFacilityAndFiscalYear(SURVEY_IDS.MONTHLY_REPORTING, facility?.facilityId, fiscalYearId)
                if (!isEmpty(responses)) {
                  this.surveyResponses = this.surveyResponses.concat(responses)
                }
              }),
            )
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to get survey responses for facilities ', error)
      }
    },

    getSurveyResponseAlertType(month) {
      const monthName = moment(month).format('MMMM')
      const previousMonth = moment().subtract(1, 'month').format('MMMM')
      const year = moment(month).format('yyyy')
      const currentYear = moment().format('yyyy')
      return monthName === previousMonth && year === currentYear ? 'Due' : 'Overdue'
    },

    getMonthsBetweenDates(start, end) {
      const startDate = moment(start)
      const endDate = moment(end)
      const result = []
      while (startDate?.isBefore(endDate)) {
        result.push(startDate.format('YYYY-MM-01'))
        startDate.add(1, 'month')
      }
      return result
    },

    isResponseSubmitted(surveyResponse) {
      return [SURVEY_RESPONSE_STATUS_CODES.COMPLETED, SURVEY_RESPONSE_STATUS_CODES.CLOSED].includes(surveyResponse?.statusCode)
    },
  },
}
</script>
