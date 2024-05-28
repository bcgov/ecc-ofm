<template>
  <v-form ref="form" v-model="isFormComplete" class="ma-2">
    <v-card class="pa-6">
      <v-row no-gutters>
        <v-col cols="12" lg="6" class="mb-6 mb-lg-0">
          <v-row>
            <v-col cols="12" sm="6" lg="2" xl="3" class="pb-0">
              <AppLabel>Facility(s):</AppLabel>
            </v-col>
            <v-col cols="12" sm="9" lg="8" xl="7">
              <v-select
                v-model="selectedFacilities"
                :items="userInfo.facilities"
                item-title="facilityName"
                label="Select Facility(s)"
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
          <v-row v-if="showPaymentTypesFilter">
            <v-col cols="12" sm="6" lg="2" xl="3" class="pb-0">
              <AppLabel>Payment Type(s):</AppLabel>
            </v-col>
            <v-col cols="12" sm="9" lg="8" xl="7">
              <v-select
                v-model.lazy="selectedPaymentFilterTypes"
                :items="paymentTypes"
                :disabled="loading"
                :rules="rules.required"
                item-title="description"
                variant="outlined"
                label="Select Payment Type(s)"
                chips
                multiple
                return-object>
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
            <v-col cols="12" sm="6" lg="5">
              <v-date-input id="date-from" v-model="selectedDateFrom" :rules="[...rules.required, rules.MMDDYYYY]" :disabled="loading" hide-actions label="From" variant="outlined" />
            </v-col>
            <v-col cols="12" sm="6" lg="5">
              <v-date-input
                id="date-to"
                v-model="selectedDateTo"
                :rules="[...rules.required, rules.MMDDYYYY, rules.validEndDate(selectedDateFrom)]"
                :disabled="loading"
                hide-actions
                label="To"
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
import moment from 'moment'
import { mapState } from 'pinia'

import AppButton from '@/components/ui/AppButton.vue'
import AppButtonRadioGroup from '@/components/ui/AppButtonRadioGroup.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { DATE_FILTER_TYPES } from '@/utils/constants'
import rules from '@/utils/rules'

export default {
  name: 'FundingSearchCard',
  components: { AppButton, AppLabel, AppButtonRadioGroup },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    showPaymentTypesFilter: {
      type: Boolean,
      default: false,
    },
    defaultDateFilter: {
      type: String,
      default: DATE_FILTER_TYPES.THREE_MONTHS,
    },
  },

  emits: ['search'],

  data() {
    return {
      isFormComplete: false,
      selectedFacilities: null,
      selectedDateFilterType: null,
      selectedPaymentFilterTypes: [],
      selectedDateFrom: null,
      selectedDateTo: null,
    }
  },

  computed: {
    ...mapState(useAppStore, ['paymentTypes']),
    ...mapState(useAuthStore, ['userInfo']),
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
    allPaymentTypesSelected() {
      return this.selectedPaymentFilterTypes?.length === this.paymentTypes?.length
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
    this.DATE_FILTER_OPTIONS = [
      { label: DATE_FILTER_TYPES.THREE_MONTHS, value: DATE_FILTER_TYPES.THREE_MONTHS },
      { label: DATE_FILTER_TYPES.SIX_MONTHS, value: DATE_FILTER_TYPES.SIX_MONTHS },
      { label: DATE_FILTER_TYPES.YTD, value: DATE_FILTER_TYPES.YTD },
      { label: DATE_FILTER_TYPES.CUSTOM, value: DATE_FILTER_TYPES.CUSTOM },
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
      this.selectedDateFilterType = this.defaultDateFilter
      this.selectedPaymentFilterTypes = this.paymentTypes
      this.selectedDateFrom = null
      this.selectedDateTo = null
    },

    async search() {
      await this.$refs.form?.validate()
      if (!this.isFormComplete) return
      const searchQueries = {
        facilities: this.selectedFacilities,
        dateFilterType: this.selectedDateFilterType,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      }
      if (this.showPaymentTypesFilter) {
        searchQueries.paymentFilterTypes = this.selectedPaymentFilterTypes?.map((paymentType) => paymentType.id)
      }
      this.$emit('search', searchQueries)
    },

    toggleAllPaymentTypes() {
      this.selectedPaymentFilterTypes = this.allPaymentTypesSelected ? [] : this.paymentTypes
    },

    toggleAllFacilities() {
      this.selectedFacilities = this.allFacilitiesSelected ? [] : this.userInfo?.facilities
    },
  },
}
</script>
