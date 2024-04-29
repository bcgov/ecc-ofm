<template>
  <v-data-table :headers="headers" :items="pendingReports" item-key="reportId" :items-per-page="15" density="compact">
    <template #[`item.alertType`]="{ item }">
      <span v-if="item.alertType === 'Due'">
        <v-icon color="warning">mdi-alert</v-icon>
        Due
      </span>
      <span v-else-if="item.alertType === 'Overdue'">
        <v-icon color="error">mdi-alert-circle</v-icon>
        Overdue
      </span>
    </template>
    <!-- <template #[`item.status`]="{ item }">
        <span :class="getStatusClass(item.statusCode)" class="pt-1 pb-1 pl-2 pr-2">{{ item.status }}</span>
      </template> -->
    <template #[`item.actions`]="{ item }">
      <v-btn icon="mdi-folder-open-outline" variant="text" class="pa-0" @click="openSurveyResponse(item)" />
      <v-btn icon="mdi-trash-can-outline" variant="text" class="pa-0" @click="false" />
    </template>
  </v-data-table>
</template>

<script>
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import { mapState, mapActions } from 'pinia'

export default {
  mixins: [alertMixin],
  props: {
    pendingReports: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      format,
      headers: [
        { title: 'Alert', key: 'alertType' },
        { title: 'Report ID', key: 'surveyResponseReferenceNumber' },
        { title: 'Title', key: 'title' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'status' },
        { title: 'Latest Activity', key: 'latestActivity' },
        { title: 'Actions', key: 'actions' },
      ],
    }
  },
  computed: {},
  async created() {},
  methods: {
    async openSurveyResponse(surveyResponse) {
      console.log(surveyResponse)
      // if (!(surveyResponse?.surveyResponseId)) {
      //   this.createSurveyResponse(surveyResponse)
      // }
    },

    async createSurveyResponse() {
      // try {
      //   this.processing = true
      //   const payload = {
      //     contactId: this.userInfo?.contactId,
      //     facilityId: this.selectedFacility,
      //     surveyId: '16fb81de-6dc1-ee11-9079-000d3af4865d',
      //     fiscalYearId: this.selectedFiscalYear?.fiscalYearId,
      //     reportingMonthId: this.selectedReportingMonth?.monthId,
      //     surveyResponseType: this.surveyResponseType,
      //   }
      //   const response = await ReportsService.createSurveyResponse(payload)
      //   if (response?.surveyResponseId) {
      //     this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: response?.surveyResponseId } })
      //   }
      // } catch (error) {
      //   this.setFailureAlert('Failed to create new report response', error)
      // } finally {
      //   this.processing = false
      // }
    },
  },
}
</script>

<style scoped>
.soft-outline {
  border: 1px solid #dee2e6 !important;
}

.status-gray {
  background-color: #e0e0e0;
  border-radius: 5px;
}

.status-green {
  background-color: #c8e6c9;
  border-radius: 5px;
}

.status-blue {
  background-color: #bbdefb;
  border-radius: 5px;
}

.status-yellow {
  background-color: #ffe082;
  border-radius: 5px;
}
</style>
