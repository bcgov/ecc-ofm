<template>
  <v-container fluid class="pa-0">
    <h4>Yearly Facility Cost</h4>
    <v-card class="my-1 px-4 py-2" variant="outlined">
      <!-- RENT/LEASE -->
      <v-row v-if="facilityType === FACILITY_TYPES.RENT_LEASE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Rent/Lease</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.rentLeaseCost) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITH MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Mortgage</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.mortgageCost) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.propertyTax) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="pa-1">
          <v-row no-gutters>
            <v-col cols="12" sm="7">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.strataFee) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITHOUT MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITHOUT_MORTGAGE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.propertyTax) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.strataFee) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- PROVIDED FREE OF CHARGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.PROVIDED_FREE_OF_CHARGE" no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Fee (If Applicable)</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.applicableFee) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.propertyTax) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">
              $ {{ format.formatDecimalNumber(currentApplication?.strataFee) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <AppLabel>Total Yearly Costs</AppLabel>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2 totalYearlyCost">
              $ {{ format.formatDecimalNumber(currentApplication?.totalYearlyFacilityCosts) }}
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
import format from '@/utils/format'

export default {
  components: { AppLabel },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    facilityType() {
      return this.currentApplication?.facilityType
    },
  },
  created() {
    this.FACILITY_TYPES = FACILITY_TYPES
    this.format = format
  },
}
</script>
<style scoped>
.totalYearlyCost {
  font-weight: 700;
}
</style>
