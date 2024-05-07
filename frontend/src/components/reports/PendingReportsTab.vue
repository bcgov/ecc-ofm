<template>
  <v-container fluid class="pa-0">
    <v-row class="mt-1 mb-4">
      <v-col cols="12" md="5">
        <h2>Report Details</h2>
      </v-col>
      <v-col cols="12" md="7">
        <FacilityFilter :loading="loading" :defaultShowInput="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>

    <v-skeleton-loader :loading="processing" type="table-tbody">
      <v-data-table :headers="headers" :items="filteredPendingReports" item-key="surveyResponseReferenceNumber" density="compact">
        <template #[`item.alertType`]="{ item }">
          <v-icon v-if="item.alertType === 'Due'" color="warning">mdi-alert</v-icon>
          <v-icon v-else-if="item.alertType === 'Overdue'" color="error">mdi-alert-circle</v-icon>
          <span class="pl-1">{{ item.alertType }}</span>
        </template>
        <template #[`item.status`]="{ item }">
          <span :class="{ 'status-gray': item.status === SURVEY_RESPONSE_STATUSES.DRAFT }" class="px-2 py-1">{{ item.status }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn v-if="showOpen(item)" icon="mdi-folder-open-outline" variant="text" @click="openSurveyResponse(item)" />
          <v-btn v-if="showTrash(item)" icon="mdi-trash-can-outline" variant="text" @click="toggleCancelDialog" />
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CancelSurveyResponseDialog :show="showCancelDialog" @close="toggleCancelDialog" />
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'

import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import CancelSurveyResponseDialog from '@/components/reports/CancelSurveyResponseDialog.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import ReportsService from '@/services/reportsService'
import { SURVEY_IDS, SURVEY_RESPONSE_TYPES, SURVEY_RESPONSE_STATUSES } from '@/utils/constants'

export default {
  components: { FacilityFilter, CancelSurveyResponseDialog },
  mixins: [alertMixin, permissionsMixin],

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    pendingReports: {
      type: Array,
      default: () => [],
    },
    facilities: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      headers: [
        { title: 'Alerts', key: 'alertType' },
        { title: 'Report ID', key: 'surveyResponseReferenceNumber' },
        { title: 'Title', key: 'title' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'status' },
        { title: 'Latest Activity', key: 'latestActivity' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      processing: false,
      showCancelDialog: false,
      facilityNameFilter: undefined,
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
      const filteredFacilities = this.facilities?.filter((facility) => facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()))
      return !isEmpty(filteredFacilities) ? filteredFacilities?.map((facility) => facility.facilityId) : []
    },
  },

  created() {
    this.SURVEY_RESPONSE_STATUSES = SURVEY_RESPONSE_STATUSES
  },

  methods: {
    async openSurveyResponse(surveyResponse) {
      if (surveyResponse?.surveyResponseId) {
        this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: surveyResponse?.surveyResponseId } })
      } else {
        this.createSurveyResponse(surveyResponse)
      }
    },

    async createSurveyResponse(surveyResponse) {
      try {
        this.processing = true
        const payload = {
          contactId: surveyResponse?.contactId,
          facilityId: surveyResponse?.facilityId,
          surveyId: SURVEY_IDS.MONTHLY_REPORTING,
          surveyResponseTitle: surveyResponse?.title,
          fiscalYearId: surveyResponse?.fiscalYearId,
          reportingMonthId: surveyResponse?.reportingMonthId,
          surveyResponseType: this.getSurveyResponseType(surveyResponse?.reportingMonthName),
        }
        const response = await ReportsService.createSurveyResponse(payload)
        this.setSuccessAlert('Started a new report response successfully')
        if (response?.surveyResponseId) {
          this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: response?.surveyResponseId } })
        }
      } catch (error) {
        this.setFailureAlert('Failed to start new report response', error)
      } finally {
        this.processing = false
      }
    },

    // TODO (vietle-cgi) Update the reporting month once we get the confirmation from the business
    getSurveyResponseType(reportingMonthName) {
      let responseType = SURVEY_RESPONSE_TYPES.MONTHLY
      if (['November'].includes(reportingMonthName)) {
        responseType = SURVEY_RESPONSE_TYPES.QUARTERLY
      } else if (['December'].includes(reportingMonthName)) {
        responseType = SURVEY_RESPONSE_TYPES.BI_ANNUAL
      }
      // TODO (vietle-cgi) Add ANNUAL type when we know which month to use
      return responseType
    },

    toggleCancelDialog() {
      this.showCancelDialog = !this.showCancelDialog
    },

    /**
     * Facility filter component value changed.
     */
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },

    showOpen(surveyResponse) {
      // Always allow navigation to an existing report. It will be readonly for users without 'Submit Draft Reports'
      if (surveyResponse?.surveyResponseId) {
        return true
      }
      // Only users with 'Submit Draft Reports' can start a new report
      return this.hasPermission(this.PERMISSIONS.SUBMIT_DRAFT_REPORTS)
    },

    showTrash(surveyResponse) {
      return surveyResponse.surveyResponseId && this.hasPermission(this.PERMISSIONS.DELETE_DRAFT_REPORTS)
    },
  },
}
</script>

<style scoped>
.status-gray {
  background-color: #e0e0e0;
  border-radius: 5px;
}
</style>
