<template>
  <v-container fluid class="pa-0 ma-0">
    <ReportingSearchCard :loading="loading" class="mb-6" @search="loadSubmittedReports" />
    <v-row no-gutters class="my-4">
      <v-col cols="12" md="5">
        <h2>Report Details</h2>
      </v-col>
      <v-col cols="12" md="7">
        <FacilityFilter v-if="!isEmpty(submittedReports)" :loading="loading" :default-show-input="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <AppAlertBanner v-if="isEmpty(submittedReports)" type="info" class="mt-4">
        <div>You have no submitted reports.</div>
      </AppAlertBanner>
      <v-data-table v-else :headers="headers" :items="filteredSubmittedReports" item-key="surveyResponseId" density="compact" :mobile="null" mobile-breakpoint="md" class="soft-outline">
        <template #[`item.title`]="{ item }">
          <span>{{ getReportTitle(item) }}</span>
        </template>
        <template #[`item.status`]="{ item }">
          <span :class="getStatusClass(item)">{{ getStatusText(item) }}</span>
        </template>
        <template #[`item.submittedDate`]="{ item }">
          {{ format.formatDate(item?.submittedDate) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn icon="mdi-eye-outline" variant="text" @click="viewSurveyResponse(item)" />
          <v-btn icon="mdi-tray-arrow-down" variant="text" @click="false" />
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import ReportingSearchCard from '@/components/reports/ReportingSearchCard.vue'
import { SURVEY_RESPONSE_STATUSES } from '@/utils/constants'
import alertMixin from '@/mixins/alertMixin.js'
import reportMixin from '@/mixins/reportMixin'
import ReportsService from '@/services/reportsService'

export default {
  components: { AppAlertBanner, FacilityFilter, ReportingSearchCard },
  mixins: [alertMixin, reportMixin],
  data() {
    return {
      headers: [
        { title: 'Report ID', key: 'surveyResponseReferenceNumber' },
        { title: 'Title', key: 'title' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'status' },
        { title: 'Submitted Date', key: 'submittedDate' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      loading: false,
      facilities: [],
      submittedReports: [],
      facilityNameFilter: undefined,
      searchQueries: {},
    }
  },

  computed: {
    filteredSubmittedReports() {
      let filteredReports = this.submittedReports
      if (!isEmpty(this.facilityNameFilter)) {
        filteredReports = filteredReports?.filter((report) => this.filteredFacilityIds?.includes(report.facilityId))
      }
      if (!isEmpty(this.searchQueries)) {
        filteredReports = filteredReports?.filter((report) => this.searchQueries?.statuses?.includes(this.getStatusText(report)))
      }
      return filteredReports
    },

    filteredFacilityIds() {
      const filteredFacilities = this.userInfo?.facilities?.filter((facility) => facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()))
      return !isEmpty(filteredFacilities) ? filteredFacilities?.map((facility) => facility.facilityId) : []
    },
  },

  methods: {
    async loadSubmittedReports(searchQueries) {
      try {
        this.loading = true
        this.submittedReports = []
        this.searchQueries = searchQueries
        await Promise.all(
          this.userInfo?.facilities?.map(async (facility) => {
            const response = await ReportsService.getSubmittedSurveyResponsesByFacilityAndSubmittedDate(facility.facilityId, searchQueries?.dateFrom, searchQueries?.dateTo)
            if (!isEmpty(response)) {
              this.submittedReports = this.submittedReports?.concat(response)
            }
          }),
        )
        this.sortSubmittedReports()
      } catch (error) {
        this.setFailureAlert('Failed to get submitted reports for facilities ', error)
      } finally {
        this.loading = false
      }
    },

    sortSubmittedReports() {
      this.submittedReports?.sort((a, b) => {
        const dateA = new Date(a.submittedDate)
        const dateB = new Date(b.submittedDate)
        return dateB - dateA // descending order (the most recent Submitted reports at the top)
      })
    },

    async viewSurveyResponse(surveyResponse) {
      if (!surveyResponse?.surveyResponseId) return
      this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: surveyResponse?.surveyResponseId } })
    },

    getStatusText(surveyResponse) {
      if (surveyResponse?.isSubmittedLate) {
        return SURVEY_RESPONSE_STATUSES.COMPLETED_LATE
      }
      return SURVEY_RESPONSE_STATUSES.COMPLETED
      // TODO (vietle-cgi) - Add "Re-Submitted" status - pending on CRM team to add it.
    },

    getStatusClass(surveyResponse) {
      if (surveyResponse?.isSubmittedLate) {
        return 'status-red'
      }
      return 'status-green'
      // TODO (vietle-cgi) - Add "Re-Submitted" status - pending on CRM team to add it.
    },

    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },
  },
}
</script>
