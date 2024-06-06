<template>
  <v-container fluid class="pa-0">
    <v-row class="mt-1 mb-4">
      <v-col cols="12" md="5">
        <h2>Report Details</h2>
      </v-col>
      <v-col cols="12" md="7">
        <FacilityFilter v-if="!isEmpty(pendingReports)" :loading="loading" :defaultShowInput="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>

    <v-skeleton-loader :loading="loading" type="table-tbody">
      <AppAlertBanner v-if="isEmpty(pendingReports)" type="info">
        <div>You are up to date with your monthly reports.</div>
      </AppAlertBanner>
      <v-data-table v-else :headers="headers" :items="filteredPendingReports" item-key="surveyTemplateId" density="compact">
        <template #[`item.alert`]="{ item }">
          <span v-if="isOverdue(item)">
            <v-icon color="error">mdi-alert</v-icon>
            Overdue
          </span>
          <span v-else>
            <v-icon color="warning">mdi-alert</v-icon>
            Due
          </span>
        </template>
        <template #[`item.title`]="{ item }">
          <span>{{ getReportTitle(item) }}</span>
        </template>
        <template #[`item.status`]>
          <span class="status-gray">Draft</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" @click="openSurveyResponse(item)">
            <v-icon size="large">mdi-folder-open-outline</v-icon>
          </v-btn>
          <v-btn v-if="showTrash" variant="text" @click="toggleCancelDialog(item)">
            <v-icon size="large">mdi-trash-can-outline</v-icon>
          </v-btn>
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
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import CancelSurveyResponseDialog from '@/components/reports/CancelSurveyResponseDialog.vue'
import alertMixin from '@/mixins/alertMixin.js'
import reportMixin from '@/mixins/reportMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import ReportsService from '@/services/reportsService'
import { SURVEY_RESPONSE_STATUSES } from '@/utils/constants'

export default {
  components: { AppAlertBanner, FacilityFilter, CancelSurveyResponseDialog },
  mixins: [alertMixin, reportMixin, permissionsMixin],
  data() {
    return {
      headers: [
        { title: 'Alerts', key: 'alert' },
        { title: 'Report ID', key: 'surveyResponseReferenceNumber' },
        { title: 'Title', key: 'title' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'status' },
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
      if (!isEmpty(this.facilityNameFilter)) {
        return this.pendingReports?.filter((report) => this.filteredFacilityIds?.includes(report.facilityId))
      }
      return this.pendingReports
    },

    filteredFacilityIds() {
      const filteredFacilities = this.userInfo?.facilities?.filter((facility) => facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()))
      return !isEmpty(filteredFacilities) ? filteredFacilities?.map((facility) => facility.facilityId) : []
    },

    showTrash() {
      return this.hasPermission(this.PERMISSIONS.DELETE_DRAFT_REPORTS)
    },
  },

  async created() {
    this.SURVEY_RESPONSE_STATUSES = SURVEY_RESPONSE_STATUSES
    await this.loadPendingReports()
  },

  methods: {
    async loadPendingReports() {
      try {
        this.loading = true
        this.pendingReports = []
        await Promise.all(
          this.userInfo?.facilities?.map(async (facility) => {
            const response = await ReportsService.getDraftSurveyResponsesByFacility(facility.facilityId)
            if (!isEmpty(response)) {
              this.pendingReports = this.pendingReports?.concat(response)
            }
          }),
        )
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

    isOverdue(report) {
      return moment(report.dueDate).isBefore(moment())
    },
  },
}
</script>
