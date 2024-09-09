<template>
  <v-card v-if="isRentLease" class="my-4 px-6 pt-4 pb-6">
    <h4>Rent/Lease Information</h4>
    <p class="mt-2 mb-4">Please select the start and end date of your facility's rental or lease agreement.</p>
    <v-card variant="outlined" class="pa-2">
      <v-row no-gutters class="pa-2 mt-4">
        <AppLabel class="pt-4">Rent/Lease Date Range:</AppLabel>
        <AppDateInput
          id="date-from"
          v-model="model.rentLeaseStartDate"
          :rules="model.monthToMonthRentLease ? [...rules.required, rules.MMDDYYYY] : [rules.MMDDYYYY]"
          :disabled="loading"
          :hide-details="loading"
          label="Start"
          class="mx-3" />
        <AppDateInput
          id="date-to"
          v-model="model.rentLeaseEndDate"
          :rules="model.monthToMonthRentLease ? [...rules.required, rules.MMDDYYYY, rules.validEndDate(model.rentLeaseStartDate)] : [rules.MMDDYYYY, rules.validEndDate(model.dateFrom)]"
          :disabled="loading"
          :hide-details="loading"
          label="End"
          class="mx-3" />
      </v-row>
      <v-checkbox id="month-to-month-rent" v-model="model.monthToMonthRentLease" color="primary" :true-value="YES_NO_CHOICE_CRM_MAPPING.YES" :disabled="readonly" :hide-details="true">
        <template #label>My facility's rent/lease is on a month-to-month basis.</template>
      </v-checkbox>
      <div id="arm-length" class="arm-length">
        <v-checkbox v-model="model.armsLength" color="primary" :true-value="YES_NO_CHOICE_CRM_MAPPING.YES" :rules="rules.required" :disabled="readonly" :hide-details="readonly">
          <template #label>I attest that the rent/lease agreement is at Arm's Length.</template>
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
import AppLabel from '@/components/ui/AppLabel.vue'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import rules from '@/utils/rules'

export default {
  components: { AppLabel, AppNumberInput },
  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update'],
  data() {
    return {
      rules,
      fieldNumberFormat: {
        nullValue: '0.00',
        min: 0,
        decimal: '.',
        separator: ',',
        precision: 2,
      },
      totalNumberFormat: {
        decimal: '.',
        separator: ',',
        prefix: '$ ',
      },
      model: {},
    }
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    totalYearlyCost() {
      const totalYearlyCost = Object.values(this.model)?.reduce((total, cost) => total + Number(cost), 0)
      return totalYearlyCost.toFixed(2)
    },
  },
  watch: {
    model: {
      handler(value) {
        this.$emit('update', value)
      },
      deep: true,
    },
  },
  created() {
    this.model = {
      rentLeaseStartDate: this.currentApplication?.rentLeaseStartDate,
      rentLeaseEndDate: this.currentApplication?.rentLeaseEndDate,
      monthToMonthRentLease: this.currentApplication?.monthToMonthRentLease,
      armsLength: this.currentApplication?.armsLength,
    }
  },
}
</script>
<style scoped>
.totalYearlyCost {
  font-weight: 700;
}
</style>
