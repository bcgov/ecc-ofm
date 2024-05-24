<template>
  <v-form ref="form" v-model="isFormComplete" class="ma-2">
    <v-card class="pa-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" sm="6" lg="2" xl="3">
              <AppLabel>Facility:</AppLabel>
            </v-col>
            <v-col cols="12" sm="9" lg="8" xl="7">
              <v-select
                v-model="selectedFacilities"
                :items="userInfo.facilities"
                item-title="facilityName"
                label="Select Facility"
                :disabled="loading"
                :rules="rules.required"
                density="compact"
                variant="outlined"
                multiple
                return-object>
                <template #prepend-item>
                  <v-list-item title="Select All" @click="toggleAllFacilities">
                    <template #prepend>
                      <v-checkbox-btn :color="someFacilitiesSelected ? '#003366' : undefined" :indeterminate="someFacilitiesSelected && !allFacilitiesSelected" :model-value="someFacilitiesSelected" />
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2" />
                </template>
                <template #selection="{ item, index }">
                  <v-chip v-if="index < MAX_NUMBER_FACILITIES_DISPLAY">
                    <span>{{ item.title }}</span>
                  </v-chip>
                  <span v-if="index === MAX_NUMBER_FACILITIES_DISPLAY" class="text-grey text-caption align-self-center">(+{{ selectedFacilities.length - MAX_NUMBER_FACILITIES_DISPLAY }} others)</span>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" lg="2" xl="3">
              <AppLabel>Payment Type:</AppLabel>
            </v-col>
            <v-col cols="12" sm="9" lg="8" xl="7">
              <v-select
                v-model.lazy="selectedPaymentFilterTypes"
                :items="PAYMENT_FILTER_TYPES"
                :disabled="loading"
                :rules="rules.required"
                item-title="label"
                variant="outlined"
                label="Select Payment Types"
                chips
                multiple>
                <template #prepend-item>
                  <v-list-item title="Select All" @click="toggleAllPaymentTypes">
                    <template #prepend>
                      <v-checkbox-btn
                        :color="somePaymentTypesSelected ? '#003366' : undefined"
                        :indeterminate="somePaymentTypesSelected && !allPaymentTypesSelected"
                        :model-value="somePaymentTypesSelected" />
                    </template>
                  </v-list-item>
                  <v-divider class="mt-2" />
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" sm="5" lg="2" xl="2">
              <AppLabel>Date:</AppLabel>
            </v-col>
            <v-col cols="12" sm="12" lg="9" xl="7">
              <AppButtonRadioGroup v-model="selectedDateFilterType" :disabled="loading" :options="DATE_FILTER_TYPES" :default-option="selectedDateFilterType" />
            </v-col>
          </v-row>
          <v-row v-if="selectedDateFilterType === 'Custom'">
            <v-col cols="12" sm="12" lg="2">
              <AppLabel>Date Range:</AppLabel>
            </v-col>
            <v-col cols="12" sm="6" lg="5">
              <v-date-input id="start-date-from" v-model="startDateFrom" :rules="[...rules.required, rules.MMDDYYYY]" :disabled="loading" label="Start Date From" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" lg="5">
              <v-date-input
                id="start-date-to"
                v-model="startDateTo"
                :rules="[...rules.required, rules.MMDDYYYY, rules.validEndDate(startDateFrom)]"
                :disabled="loading"
                label="Start Date To"
                variant="outlined" />
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
import rules from '@/utils/rules'
import { mapState } from 'pinia'

import AppButton from '@/components/ui/AppButton.vue'
import AppButtonRadioGroup from '@/components/ui/AppButtonRadioGroup.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin.js'
import { useAuthStore } from '@/stores/auth'

const DATE_FILTER_TYPE_VALUES = {
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  YTD: 'YTD',
  CUSTOM: 'Custom',
}

const PAYMENT_FILTER_TYPE_VALUES = {
  BASE_FUNDING: 'Base Funding',
  SUPPLEMENTARY_ALLOWANCES: 'Supplementary Allowances',
  OTHER: 'Other',
}

export default {
  name: 'FundingSearchCard',
  components: { AppButton, AppLabel, AppButtonRadioGroup },
  mixins: [alertMixin],
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
      selectedFacilities: null,
      selectedDateFilterType: null,
      selectedPaymentFilterTypes: [],
      startDateFrom: null,
      startDateTo: null,
      menuStartDateFrom: false,
      menuStartDateTo: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    startDateThreshold() {
      switch (this.selectedDateFilterType) {
        case DATE_FILTER_TYPE_VALUES.THREE_MONTHS:
          return this.dateByMonthsInPast(3)
        case DATE_FILTER_TYPE_VALUES.SIX_MONTHS:
          return this.dateByMonthsInPast(6)
        case DATE_FILTER_TYPE_VALUES.YTD:
          return this.dateByMonthsInPast(12)
        default:
          return null
      }
    },
    allPaymentTypesSelected() {
      return this.selectedPaymentFilterTypes?.length === this.PAYMENT_FILTER_TYPES?.length
    },
    somePaymentTypesSelected() {
      return this.selectedPaymentFilterTypes?.length > 0
    },
    allFacilitiesSelected() {
      return this.selectedFacilities?.length === this.userInfo?.facilities?.length
    },
    someFacilitiesSelected() {
      return this.selectedFacilities?.length > 0
    },
  },

  created() {
    this.rules = rules
    this.PAYMENT_FILTER_TYPES = [
      { label: PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING, value: PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING },
      { label: PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES, value: PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES },
      { label: PAYMENT_FILTER_TYPE_VALUES.OTHER, value: PAYMENT_FILTER_TYPE_VALUES.OTHER },
    ]
    this.DATE_FILTER_TYPES = [
      { label: DATE_FILTER_TYPE_VALUES.THREE_MONTHS, value: DATE_FILTER_TYPE_VALUES.THREE_MONTHS },
      { label: DATE_FILTER_TYPE_VALUES.SIX_MONTHS, value: DATE_FILTER_TYPE_VALUES.SIX_MONTHS },
      { label: DATE_FILTER_TYPE_VALUES.YTD, value: DATE_FILTER_TYPE_VALUES.YTD },
      { label: DATE_FILTER_TYPE_VALUES.CUSTOM, value: DATE_FILTER_TYPE_VALUES.CUSTOM },
    ]
    this.MAX_NUMBER_FACILITIES_DISPLAY = 4
    this.resetFilter()
  },

  async mounted() {
    await this.search()
  },

  methods: {
    resetFilter() {
      this.selectedFacilities = this.userInfo?.facilities
      this.selectedDateFilterType = DATE_FILTER_TYPE_VALUES.THREE_MONTHS
      this.selectedPaymentFilterTypes = [PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING, PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES, PAYMENT_FILTER_TYPE_VALUES.OTHER]
      this.startDateFrom = null
      this.startDateTo = null
    },

    async search() {
      await this.$refs.form?.validate()
      if (!this.isFormComplete) return
      const searchQueries = {
        facilities: this.selectedFacilities,
        dateFilterType: this.selectedDateFilterType,
        paymentFilterTypes: this.selectedPaymentFilterTypes,
        startDateThreshold: this.startDateThreshold,
        startDateFrom: this.formatDate(this.startDateFrom),
        startDateTo: this.formatDate(this.startDateTo),
      }
      this.$emit('search', searchQueries)
    },

    dateByMonthsInPast(months) {
      const date = new Date()
      date.setMonth(date.getMonth() - months)
      return date.toISOString().split('T')[0]
    },

    toggleAllPaymentTypes() {
      if (this.allPaymentTypesSelected) {
        this.selectedPaymentFilterTypes = []
      } else {
        this.selectedPaymentFilterTypes = [PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING, PAYMENT_FILTER_TYPE_VALUES.SUPPLEMENTARY_ALLOWANCES, PAYMENT_FILTER_TYPE_VALUES.OTHER]
      }
    },

    toggleAllFacilities() {
      if (this.allFacilitiesSelected) {
        this.selectedFacilities = []
      } else {
        this.selectedFacilities = this.userInfo?.facilities
      }
    },

    formatDate(date) {
      return date?.toISOString().split('T')[0]
    },
  },
}
</script>
