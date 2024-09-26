<template>
  <v-container fluid class="pa-0">
    <h4>Yearly Operating Cost</h4>
    <v-card class="my-1 px-4 py-2" variant="outlined">
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Maintenance and Minor Repairs</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">$ {{ format.formatDecimalNumber(currentApplication?.insuranceCost) }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Upkeep</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">$ {{ format.formatDecimalNumber(currentApplication?.upkeepLabourCost) }}</v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Office Furniture and Equipment</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">$ {{ format.formatDecimalNumber(currentApplication?.furnitureEquipmentsCost) }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Facility Maintenance and Minor Improvements</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">$ {{ format.formatDecimalNumber(currentApplication?.maintenanceRepairsCost) }}</v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Janitorial Services</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">$ {{ format.formatDecimalNumber(currentApplication?.suppliesCost) }}</v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <p>Utilities</p>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2">$ {{ format.formatDecimalNumber(currentApplication?.utilitiesCost) }}</v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12" lg="6">
          <v-row no-gutters class="pa-1">
            <v-col cols="12" sm="7">
              <AppLabel>Total Yearly Costs</AppLabel>
            </v-col>
            <v-col cols="12" sm="5" class="px-sm-2 total-yearly-cost">$ {{ format.formatDecimalNumber(currentApplication?.totalYearlyOperatingCosts) }}</v-col>
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
import format from '@/utils/format'

export default {
  components: { AppLabel },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
  },
  created() {
    this.format = format
  },
}
</script>

<style scoped>
.total-yearly-cost {
  font-weight: 700;
}
</style>
