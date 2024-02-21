<template>
  <v-container fluid class="pa-0">
    <h4>Yearly Facility Cost</h4>
    <v-card class="my-1 px-4 py-2" variant="outlined">
      <!-- RENT/LEASE -->
      <v-row v-if="facilityType === FACILITY_TYPES.RENT_LEASE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Rent/Lease</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.rentLeaseCost) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITH MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Mortgage</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.mortgageCost) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.propertyTax) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="pa-1">
          <v-row no-gutters>
            <v-col cols="6" xl="5">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.strataFee) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITHOUT MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITHOUT_MORTGAGE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.propertyTax) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.strataFee) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- PROVIDED FREE OF CHARGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.PROVIDED_FREE_OF_CHARGE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Fee (If Applicable)</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.applicableFee) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.propertyTax) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.strataFee) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <AppLabel>Total Yearly Costs</AppLabel>
            </v-col>
            <v-col cols="6" xl="7" class="px-2 totalYearlyCost">
              {{ formatDecimalNumber(currentApplication?.totalYearlyFacilityCosts) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { FACILITY_TYPES } from '@/utils/constants'
import { formatDecimalNumber } from '@/utils/common'

export default {
  components: { AppLabel },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
  },
  created() {
    this.facilityType = this.currentApplication?.facilityType
    this.FACILITY_TYPES = FACILITY_TYPES
  },
  methods: {
    formatDecimalNumber,
  },
}
</script>
<style scoped>
.totalYearlyCost {
  font-weight: 700;
}
</style>
