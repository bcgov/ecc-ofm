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
      <AppAlertBanner v-if="isEmpty(submittedReports)" type="info" class="mt-4">You have no submitted reports.</AppAlertBanner>
      <v-data-table v-else :headers="headers" :items="filteredSubmittedReports" item-key="surveyResponseId" density="compact" :mobile="null" mobile-breakpoint="md" class="soft-outline">
        <template #[`item.status`]="{ item }">
          <span :class="getStatusClass(item)">{{ item.status }}</span>
        </template>
        <template #[`item.submittedDate`]="{ item }">
          {{ format.formatDate(item?.submittedDate) }}
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
            <AppButton :primary="false" btn-size="small" class="mr-2" @click="openSurveyResponse(item)">
              {{ isActiveReportResponse(item) ? 'Update' : 'View' }}
            </AppButton>
            <AppButton v-if="!isActiveReportResponse(item)" :primary="false" btn-size="small" :disabled="hasInProgressAssistanceRequest(item)" @click="toggleAssistanceRequestDialog(item)">
              Unlock
            </AppButton>
            <v-btn variant="text" @click="false">
              <v-icon aria-label="Download" size="large">mdi-tray-arrow-down</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <NewRequestDialog
      :show="showAssistanceRequestDialog"
      :default-request-category-id="getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.REPORTING)"
      :default-subject="defaultAssistanceRequestSubject"
      :default-facility="defaultAssistanceRequestFacility"
      return-to="reporting"
      @close="toggleAssistanceRequestDialog" />
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'

import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import ReportingSearchCard from '@/components/reports/ReportingSearchCard.vue'
import { REQUEST_CATEGORY_NAMES, SURVEY_RESPONSE_STATUSES } from '@/utils/constants'
import alertMixin from '@/mixins/alertMixin.js'
import reportMixin from '@/mixins/reportMixin'
import ReportsService from '@/services/reportsService'

export default {
  components: { AppAlertBanner, AppButton, FacilityFilter, NewRequestDialog, ReportingSearchCard },
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
      showAssistanceRequestDialog: false,
      surveyResponseToUnlock: undefined,
      facilities: [],
      submittedReports: [],
      facilityNameFilter: undefined,
      searchQueries: {},
    }
  },

  computed: {
    filteredSubmittedReports() {
      return isEmpty(this.facilityNameFilter) ? this.submittedReports : this.submittedReports?.filter((report) => this.filteredFacilityIds?.includes(report.facilityId))
    },
    filteredFacilityIds() {
      const filteredFacilities = this.userInfo?.facilities?.filter((facility) => facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()))
      return !isEmpty(filteredFacilities) ? filteredFacilities?.map((facility) => facility.facilityId) : []
    },
    defaultAssistanceRequestSubject() {
      return `Unlock ${this.surveyResponseToUnlock?.surveyResponseReferenceNumber} ${this.surveyResponseToUnlock?.title}`
    },
    defaultAssistanceRequestFacility() {
      return this.userInfo?.facilities?.find((facility) => facility.facilityId === this.surveyResponseToUnlock?.facilityId)
    },
  },

  created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
  },

  methods: {
    async loadSubmittedReports(searchQueries) {
      try {
        this.loading = true
        this.facilityNameFilter = null
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
        this.submittedReports?.forEach((report) => {
          report.title = this.getReportTitle(report)
          report.status = this.getStatusText(report)
        })
        this.submittedReports = this.submittedReports?.filter((report) => this.searchQueries?.statuses?.includes(this.getStatusText(report)))
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

    openSurveyResponse(surveyResponse) {
      if (!surveyResponse?.surveyResponseId) return
      this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: surveyResponse?.surveyResponseId } })
    },

    getStatusText(surveyResponse) {
      if (surveyResponse?.isSubmittedLate) {
        return SURVEY_RESPONSE_STATUSES.COMPLETED_LATE
      }
      return this.isActiveReportResponse(surveyResponse) ? SURVEY_RESPONSE_STATUSES.COMPLETED : SURVEY_RESPONSE_STATUSES.COMPLETED_CLOSED
    },

    getStatusClass(surveyResponse) {
      return surveyResponse?.isSubmittedLate ? 'status-red' : 'status-green'
    },

    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },

    toggleAssistanceRequestDialog(surveyResponse) {
      this.surveyResponseToUnlock = surveyResponse ?? this.surveyResponseToUnlock
      this.showAssistanceRequestDialog = !this.showAssistanceRequestDialog
    },
  },
}
</script>
