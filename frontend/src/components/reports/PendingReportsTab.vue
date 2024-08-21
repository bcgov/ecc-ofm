<template>
  <v-container fluid class="pa-0">
    <div class="mt-2">Complete, manage or submit current reports for your facilities. Request to unlock or view overdue reports and past submissions.</div>
    <v-row class="mt-1 mb-4">
      <v-col cols="12" md="5">
        <h2>Report Details</h2>
      </v-col>
      <v-col cols="12" md="7">
        <FacilityFilter v-if="!isEmpty(pendingReports)" :loading="loading" :default-show-input="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>

    <v-skeleton-loader :loading="loading" type="table-tbody">
      <AppAlertBanner v-if="isEmpty(pendingReports)" type="info">You are up to date with your monthly reports.</AppAlertBanner>
      <v-data-table
        v-else
        id="pending-reports-table"
        :headers="headers"
        :items="filteredPendingReports"
        item-key="surveyTemplateId"
        density="compact"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline">
        <template #[`item.alert`]="{ item }">
          <template v-if="item.alert">
            <v-icon color="error">mdi-alert-circle</v-icon>
            Overdue
          </template>
          <template v-else>
            <v-icon color="warning">mdi-alert</v-icon>
            Due
          </template>
        </template>
        <template #[`item.statusName`]="{ item }">
          <span class="status-gray">{{ item.statusCode === SURVEY_RESPONSE_STATUS_CODES.ACTIVE ? SURVEY_RESPONSE_STATUSES.DRAFT : item.statusName }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
            <AppButton v-if="showUpdate(item)" :primary="false" size="small" height="30px" @click="openSurveyResponse(item)">Update</AppButton>
            <AppButton v-else-if="showView()" :primary="false" size="small" height="30px" @click="openSurveyResponse(item)">View</AppButton>
            <AppButton
              v-if="showUnlock(item)"
              :primary="false"
              size="small"
              height="30px"
              class="ml-2 ml-md-0 ml-lg-2"
              :disabled="hasInProgressAssistanceRequest(item)"
              @click="toggleAssistanceRequestDialog(item)">
              Unlock
            </AppButton>
            <v-btn v-if="showTrash(item)" variant="text" @click="toggleDeleteDialog(item)">
              <v-icon aria-label="Delete" size="large">mdi-trash-can-outline</v-icon>
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
      :lock-request-category="true"
      :lock-subject="true"
      :lock-facility="true"
      return-to="reporting"
      @close="toggleAssistanceRequestDialog" />
    <DeleteSurveyResponseDialog :show="showDeleteResponseDialog" :survey-response-id="surveyResponseIdToDelete" @close="toggleDeleteDialog" />
  </v-container>
</template>

<script>
import moment from 'moment'
import { isEmpty } from 'lodash'

import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import DeleteSurveyResponseDialog from '@/components/reports/DeleteSurveyResponseDialog.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import alertMixin from '@/mixins/alertMixin.js'
import reportMixin from '@/mixins/reportMixin'
import ReportsService from '@/services/reportsService'
import { REQUEST_CATEGORY_NAMES, SURVEY_RESPONSE_STATUSES, SURVEY_RESPONSE_STATUS_CODES } from '@/utils/constants'

export default {
  components: { AppAlertBanner, AppButton, FacilityFilter, DeleteSurveyResponseDialog, NewRequestDialog },
  mixins: [alertMixin, reportMixin],
  data() {
    return {
      headers: [
        { title: 'Alerts', key: 'alert' },
        { title: 'Report ID', key: 'surveyResponseReferenceNumber' },
        { title: 'Title', key: 'title' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'statusName' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      loading: false,
      showAssistanceRequestDialog: false,
      showDeleteResponseDialog: false,
      surveyResponseToUnlock: undefined,
      surveyResponseIdToDelete: undefined,
      facilityNameFilter: undefined,
      pendingReports: [],
    }
  },

  computed: {
    filteredPendingReports() {
      return isEmpty(this.facilityNameFilter) ? this.pendingReports : this.pendingReports?.filter((report) => this.filteredFacilityIds?.includes(report.facilityId))
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

  async created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
    this.SURVEY_RESPONSE_STATUSES = SURVEY_RESPONSE_STATUSES
    this.SURVEY_RESPONSE_STATUS_CODES = SURVEY_RESPONSE_STATUS_CODES
    await this.loadPendingReports()
  },

  methods: {
    async loadPendingReports() {
      try {
        this.loading = true
        this.facilityNameFilter = null
        this.pendingReports = []
        await Promise.all(
          this.userInfo?.facilities?.map(async (facility) => {
            const response = await ReportsService.getDraftSurveyResponsesByFacility(facility.facilityId)
            if (!isEmpty(response)) {
              this.pendingReports = this.pendingReports?.concat(response)
            }
          }),
        )
        this.pendingReports?.forEach((report) => {
          report.alert = this.isOverdue(report)
          report.title = this.getReportTitle(report)
        })
        this.sortPendingReports()
      } catch (error) {
        this.setFailureAlert('Failed to get pending reports for facilities ', error)
      } finally {
        this.loading = false
      }
    },

    // All Over Due reports are at top of the list.
    sortPendingReports() {
      this.pendingReports?.sort((a, b) => {
        const isOverdueA = this.isOverdue(a) ? -1 : 1
        const isOverdueB = this.isOverdue(b) ? -1 : 1
        const overDueComparison = isOverdueA - isOverdueB
        const facilityNameComparison = a.facilityName?.localeCompare(b.facilityName)
        const surveyResponseNumberComparison = a.surveyResponseReferenceNumber?.localeCompare(b.surveyResponseReferenceNumber)
        return overDueComparison || facilityNameComparison || surveyResponseNumberComparison
      })
    },

    openSurveyResponse(surveyResponse) {
      this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: surveyResponse?.surveyResponseId } })
    },

    toggleDeleteDialog(surveyResponse) {
      this.surveyResponseIdToDelete = surveyResponse?.surveyResponseId
      this.showDeleteResponseDialog = !this.showDeleteResponseDialog
    },

    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },

    showTrash(surveyResponse) {
      return this.isActiveReportResponse(surveyResponse) && this.hasPermission(this.PERMISSIONS.DELETE_DRAFT_REPORTS)
    },

    isOverdue(report) {
      return moment(report.dueDate).isBefore(moment())
    },

    toggleAssistanceRequestDialog(surveyResponse) {
      this.surveyResponseToUnlock = surveyResponse ?? this.surveyResponseToUnlock
      this.showAssistanceRequestDialog = !this.showAssistanceRequestDialog
    },
  },
}
</script>
