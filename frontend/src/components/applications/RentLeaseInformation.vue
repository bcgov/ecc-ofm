<template>
  <v-card class="my-4 px-6 pt-4 pb-6">
    <h4>Rent/Lease Information</h4>
    <p class="mt-2 mb-4">Please select the start and end date of your facility's rental or lease agreement.</p>
    <v-card variant="outlined" class="pa-2">
      <v-row no-gutters class="px-2">
        <AppLabel class="pt-8">Rent/Lease Date Range:</AppLabel>
        <v-row no-gutters class="mt-4">
          <AppDateInput
            id="start-date"
            v-model="model.rentLeaseStartDate"
            :rules="isMonthToMonthRentLease ? [] : [...rules.required, rules.MMDDYYYY]"
            :disabled="readonly"
            :hide-details="readonly || isMonthToMonthRentLease"
            label="Start"
            class="mx-3" />
          <AppDateInput
            id="end-date"
            v-model="model.rentLeaseEndDate"
            :rules="isMonthToMonthRentLease ? [] : [...rules.required, rules.MMDDYYYY, rules.validEndDate(model.rentLeaseStartDate)]"
            :disabled="readonly"
            :hide-details="readonly || isMonthToMonthRentLease"
            label="End"
            class="mx-3 mt-4 mt-sm-0" />
        </v-row>
      </v-row>
      <v-checkbox
        id="month-to-month-rent"
        v-model="model.monthToMonthRentLease"
        color="primary"
        :true-value="YES_NO_CRM_MAPPING.YES"
        :false-value="YES_NO_CRM_MAPPING.NO"
        :disabled="readonly"
        hide-details
        class="mt-6">
        <template #label>My facility's rent/lease is on a month-to-month basis.</template>
      </v-checkbox>
      <div id="arm-length" class="d-flex mt-2">
        <v-checkbox v-model="model.armsLength" color="primary" :true-value="YES_NO_CHOICE_CRM_MAPPING.YES" :rules="rules.required" :disabled="readonly" :hide-details="readonly">
          <template #label>I attest that my rent/lease is at arm's length lease, or my lease is not at arm's length and I understand it is not an eligible expense.</template>
        </v-checkbox>
        <v-tooltip content-class="tooltip" max-width="300px" text="Third-parties dealing with each other at arm's length are independent and unrelated to each other.">
          <template #activator="{ props }">
            <v-icon size="large" v-bind="props" class="ml-2 pt-7">mdi-information-slab-circle-outline</v-icon>
          </template>
        </v-tooltip>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import AppDateInput from '@/components/ui/AppDateInput.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import rules from '@/utils/rules'
import { YES_NO_CHOICE_CRM_MAPPING, YES_NO_CRM_MAPPING } from '@/utils/constants'

export default {
  components: { AppDateInput, AppLabel },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update'],
  data() {
    return {
      model: {},
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    isMonthToMonthRentLease() {
      return this.model.monthToMonthRentLease === YES_NO_CRM_MAPPING.YES
    },
  },
  watch: {
    model: {
      handler() {
        this.model.rentLeaseStartDate = this.model.rentLeaseStartDate ? this.model.rentLeaseStartDate : null
        this.model.rentLeaseEndDate = this.model.rentLeaseEndDate && this.model.rentLeaseEndDate > this.model.rentLeaseStartDate ? this.model.rentLeaseEndDate : null
        this.model.armsLength = this.model.armsLength ? this.model.armsLength : null
        this.$emit('update', this.model)
      },
      deep: true,
    },
  },
  created() {
    this.rules = rules
    this.YES_NO_CHOICE_CRM_MAPPING = YES_NO_CHOICE_CRM_MAPPING
    this.YES_NO_CRM_MAPPING = YES_NO_CRM_MAPPING
    this.model = {
      rentLeaseStartDate: this.currentApplication?.rentLeaseStartDate,
      rentLeaseEndDate: this.currentApplication?.rentLeaseEndDate,
      monthToMonthRentLease: this.currentApplication?.monthToMonthRentLease,
      armsLength: this.currentApplication?.armsLength,
    }
  },
}
</script>
