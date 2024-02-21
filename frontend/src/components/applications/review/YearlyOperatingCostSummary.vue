<template>
  <v-container fluid class="pa-0">
    <h4>Yearly Operating Cost</h4>
    <v-card class="my-1 px-4 py-2" variant="outlined">
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Insurance</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.insuranceCost) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Upkeep and Labour</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.upkeepLabourCost) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Utilities</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.utilitiesCost) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Maintenance and Repairs</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.maintenanceRepairsCost) }}
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Furniture and Equipment</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.furnitureEquipmentsCost) }}
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="6" xl="5">
              <p>Supplies</p>
            </v-col>
            <v-col cols="6" xl="7" class="px-2">
              {{ formatDecimalNumber(currentApplication?.suppliesCost) }}
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
              {{ formatDecimalNumber(currentApplication?.totalYearlyOperatingCosts) }}
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
import { formatDecimalNumber } from '@/utils/common'

export default {
  components: { AppLabel },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
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
