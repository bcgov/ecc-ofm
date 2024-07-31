<template>
  <v-form ref="form" v-model="isFormComplete" class="ma-2">
    <v-card class="pa-6">
      <v-row no-gutters>
        <v-col cols="12" lg="6" class="mb-6 mb-lg-0">
          <!-- <v-row>
            <v-col cols="12" sm="6" lg="2" xl="3" class="pb-0">
              <AppLabel>Report Type(s):</AppLabel>
            </v-col>
            <v-col cols="12" sm="9" lg="8" xl="7">
              <v-select
                v-model.lazy="selectedReportTypes"
                :items="reportTemplates"
                :disabled="loading"
                :rules="rules.required"
                item-title="surveyTemplateName"
                variant="outlined"
                label="Select Report Type(s)"
                chips
                multiple
                return-object>
                <template #prepend-item>
                  <v-list-item title="Select All" @click="toggleAllReportTypes">
                    <template #prepend>
                      <v-checkbox-btn
                        :color="someReportTypesSelected ? '#003366' : undefined"
                        :indeterminate="someReportTypesSelected && !allReportTypesSelected"
                        :model-value="someReportTypesSelected" />
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2" />
                </template>
              </v-select>
            </v-col>
          </v-row> -->
          <v-row>
            <v-col cols="12" sm="6" lg="3" xl="2" class="pb-0">
              <AppLabel>Status(es):</AppLabel>
            </v-col>
            <v-col cols="12" sm="9" lg="8">
              <v-select v-model.lazy="selectedStatuses" :items="STATUS_FILTER_OPTIONS" :disabled="loading" :rules="rules.required" variant="outlined" label="Select Status(es)" chips multiple>
                <template #prepend-item>
                  <v-list-item title="Select All" @click="toggleAllStatuses">
                    <template #prepend>
                      <v-checkbox-btn :color="someStatusesSelected ? '#003366' : undefined" :indeterminate="someStatusesSelected && !allStatusesSelected" :model-value="someStatusesSelected" />
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2" />
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" sm="5" lg="2" xl="2" class="pb-0">
              <AppLabel>Date:</AppLabel>
            </v-col>
            <v-col cols="12" sm="12" lg="9" xl="7">
              <AppButtonRadioGroup v-model="selectedDateFilterType" :disabled="loading" :options="DATE_FILTER_OPTIONS" :default-option="selectedDateFilterType" />
            </v-col>
          </v-row>
          <v-row v-if="selectedDateFilterType === 'Custom'">
            <v-col cols="12" sm="12" lg="2" class="pb-0">
              <AppLabel>Date Range:</AppLabel>
            </v-col>
            <v-col cols="12" sm="12" lg="10">
              <v-row class="mt-2">
                <AppDateInput id="date-from" v-model="selectedDateFrom" :rules="[...rules.required, rules.MMDDYYYY]" :disabled="loading" :hide-details="loading" label="From" class="mx-3" />
                <AppDateInput
                  id="date-to"
                  v-model="selectedDateTo"
                  :rules="[...rules.required, rules.MMDDYYYY, rules.validEndDate(selectedDateFrom)]"
                  :disabled="loading"
                  :hide-details="loading"
                  label="To"
                  class="mx-3" />
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-row no-gutters class="mt-2" justify="end">
      <AppButton id="reset" :primary="false" size="large" width="100px" :loading="loading" class="mr-8" @click="resetFilter">Reset</AppButton>
      <AppButton id="search" size="large" width="150px" :loading="loading" @click="search">Search</AppButton>
    </v-row>
  </v-form>
</template>

<script>
import moment from 'moment'

import AppButton from '@/components/ui/AppButton.vue'
import AppButtonRadioGroup from '@/components/ui/AppButtonRadioGroup.vue'
import AppDateInput from '@/components/ui/AppDateInput.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { DATE_FILTER_TYPES, SURVEY_RESPONSE_STATUSES } from '@/utils/constants'
import reportMixin from '@/mixins/reportMixin'
import rules from '@/utils/rules'

export default {
  name: 'ReportingSearchCard',
  components: { AppButton, AppButtonRadioGroup, AppDateInput, AppLabel },
  mixins: [reportMixin],
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['search'],

  data() {
    return {
      isFormComplete: false,
      selectedDateFilterType: null,
      // selectedReportTypes: [],
      selectedStatuses: null,
      selectedDateFrom: null,
      selectedDateTo: null,
    }
  },

  computed: {
    dateFrom() {
      switch (this.selectedDateFilterType) {
        case DATE_FILTER_TYPES.THREE_MONTHS:
          return moment().subtract(3, 'months').startOf('day')
        case DATE_FILTER_TYPES.SIX_MONTHS:
          return moment().subtract(6, 'months').startOf('day')
        case DATE_FILTER_TYPES.YTD:
          return moment().startOf('year')
        case DATE_FILTER_TYPES.CUSTOM:
          return moment(this.selectedDateFrom).startOf('day')
        default:
          return null
      }
    },
    dateTo() {
      switch (this.selectedDateFilterType) {
        case DATE_FILTER_TYPES.CUSTOM:
          return moment(this.selectedDateTo).endOf('day')
        default:
          return null
      }
    },
    /* TODO (vietle-cgi) - We comment out these functions because we currently have only the Monthly Report template. We will add this function back once we have some new report templates.
    allReportTypesSelected() {
      return this.selectedReportTypes?.length === this.reportTemplates?.length
    },
    someReportTypesSelected() {
      return this.selectedReportTypes?.length > 0
    },
    */
    allStatusesSelected() {
      return this.selectedStatuses?.length === this.STATUS_FILTER_OPTIONS?.length
    },
    someStatusesSelected() {
      return this.selectedStatuses?.length > 0
    },
  },

  created() {
    this.rules = rules
    this.DATE_FILTER_OPTIONS = [
      { label: DATE_FILTER_TYPES.THREE_MONTHS, value: DATE_FILTER_TYPES.THREE_MONTHS },
      { label: DATE_FILTER_TYPES.SIX_MONTHS, value: DATE_FILTER_TYPES.SIX_MONTHS },
      { label: DATE_FILTER_TYPES.YTD, value: DATE_FILTER_TYPES.YTD },
      { label: DATE_FILTER_TYPES.CUSTOM, value: DATE_FILTER_TYPES.CUSTOM },
    ]
    this.STATUS_FILTER_OPTIONS = [SURVEY_RESPONSE_STATUSES.COMPLETED, SURVEY_RESPONSE_STATUSES.COMPLETED_LATE, SURVEY_RESPONSE_STATUSES.COMPLETED_CLOSED]
    this.resetFilter()
  },

  async mounted() {
    await this.search()
  },

  methods: {
    resetFilter() {
      // this.selectedReportTypes = this.reportTemplates
      this.selectedStatuses = this.STATUS_FILTER_OPTIONS
      this.selectedDateFilterType = DATE_FILTER_TYPES.THREE_MONTHS
      this.selectedDateFrom = null
      this.selectedDateTo = null
    },

    async search() {
      await this.$refs.form?.validate()
      if (!this.isFormComplete) return
      const searchQueries = {
        // reportTypes: this.selectedReportTypes,
        statuses: this.selectedStatuses,
        dateFilterType: this.selectedDateFilterType,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      }
      this.$emit('search', searchQueries)
    },

    /* TODO (vietle-cgi) - We comment out this function because we currently have only the Monthly Report template. We will add this function back once we have some new report templates.
    toggleAllReportTypes() {
      this.selectedReportTypes = this.allReportTypesSelected ? [] : this.reportTemplates
    },
    */

    toggleAllStatuses() {
      this.selectedStatuses = this.allStatusesSelected ? [] : this.STATUS_FILTER_OPTIONS
    },
  },
}
</script>
