<template>
  <v-container fluid class="pa-0">
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
      <v-data-table v-else :headers="headers" :items="filteredPendingReports" item-key="surveyTemplateId" density="compact" :mobile="null" mobile-breakpoint="md" class="soft-outline">
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
          <span class="status-gray">{{ item.statusCode === SURVEY_RESPONSE_STATUS_CODES.ACTIVE ? 'Draft' : item.statusName }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
            <AppButton :primary="false" btn-size="small" class="mr-2" @click="openSurveyResponse(item)">
              <template v-if="isActiveReport(item)">Update</template>
              <template v-else>View</template>
            </AppButton>
            <AppButton v-if="!isActiveReport(item)" :primary="false" btn-size="small" @click="openSurveyResponse(item)">Unlock</AppButton>
            <v-btn v-if="showTrash(item)" variant="text" @click="toggleCancelDialog(item)">
              <v-icon aria-label="Delete" size="large">mdi-trash-can-outline</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CancelSurveyResponseDialog :show="showCancelDialog" :survey-response-id="surveyResponseIdToCancel" @close="toggleCancelDialog" @cancel="cancel" />
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import moment from 'moment'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import CancelSurveyResponseDialog from '@/components/reports/CancelSurveyResponseDialog.vue'
import alertMixin from '@/mixins/alertMixin.js'
import reportMixin from '@/mixins/reportMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import ReportsService from '@/services/reportsService'
import { SURVEY_RESPONSE_STATUS_CODES } from '@/utils/constants'

export default {
  components: { AppAlertBanner, AppButton, FacilityFilter, CancelSurveyResponseDialog },
  mixins: [alertMixin, reportMixin, permissionsMixin],
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
      showCancelDialog: false,
      surveyResponseIdToCancel: undefined,
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
  },

  async created() {
    this.SURVEY_RESPONSE_STATUS_CODES = SURVEY_RESPONSE_STATUS_CODES
    await this.loadPendingReports()
    console.log(this.pendingReports)
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
        return isOverdueA - isOverdueB
      })
    },

    openSurveyResponse(surveyResponse) {
      this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: surveyResponse?.surveyResponseId } })
    },

    cancel(surveyResponseId) {
      this.$emit('cancel', surveyResponseId)
    },

    toggleCancelDialog(surveyResponse) {
      this.surveyResponseIdToCancel = surveyResponse?.surveyResponseId
      this.showCancelDialog = !this.showCancelDialog
    },

    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },

    showTrash(surveyResponse) {
      return this.isActiveReport(surveyResponse) && this.hasPermission(this.PERMISSIONS.DELETE_DRAFT_REPORTS)
    },

    isOverdue(report) {
      return moment(report.dueDate).isBefore(moment())
    },
  },
}
</script>
