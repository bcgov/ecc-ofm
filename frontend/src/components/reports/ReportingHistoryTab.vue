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

    <v-data-table :headers="headers" :items="filteredSubmittedReports" item-key="surveyResponseId" density="compact">
      <template #[`item.status`]="{ item }">
        <span :class="getStatusClass(item.status)" class="px-2 py-1">{{ item.status }}</span>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn icon="mdi-eye-outline" variant="text" @click="viewSurveyResponse(item)" />
        <v-btn icon="mdi-tray-arrow-down" variant="text" @click="false" />
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { SURVEY_RESPONSE_STATUSES } from '@/utils/constants'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'

export default {
  components: { FacilityFilter },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    submittedReports: {
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
        { title: 'Report ID', key: 'surveyResponseReferenceNumber' },
        { title: 'Title', key: 'surveyResponseTitle' },
        { title: 'Facility', key: 'facilityName' },
        { title: 'Status', key: 'status' },
        { title: 'Submitted Date', key: 'submittedDate' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      facilityNameFilter: undefined,
    }
  },

  computed: {
    filteredSubmittedReports() {
      if (!isEmpty(this.facilityNameFilter)) {
        return this.submittedReports?.filter((report) => this.filteredFacilityIds?.includes(report.facilityId))
      }
      return this.submittedReports
    },

    filteredFacilityIds() {
      const filteredFacilities = this.facilities?.filter((facility) => facility.facilityName?.toLowerCase().includes(this.facilityNameFilter?.toLowerCase()))
      return !isEmpty(filteredFacilities) ? filteredFacilities?.map((facility) => facility.facilityId) : []
    },
  },

  methods: {
    async viewSurveyResponse(surveyResponse) {
      if (!surveyResponse?.surveyResponseId) return
      this.$router.push({ name: 'survey-form', params: { surveyResponseGuid: surveyResponse?.surveyResponseId } })
    },

    getStatusClass(status) {
      switch (status) {
        case SURVEY_RESPONSE_STATUSES.COMPLETED_LATE:
          return 'status-red'
        case SURVEY_RESPONSE_STATUSES.COMPLETED:
          return 'status-green'
      }
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
