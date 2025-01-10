<template>
  <v-container fluid class="pa-0">
    <h4>Yearly Operating Cost</h4>
    <v-card class="my-2" variant="outlined">
      <v-row no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>
                Maintenance and Minor Repairs
                <v-tooltip
                  content-class="tooltip"
                  text="Costs directly related to third-party labour costs, property insurance, utilities and garbage disposal."
                  max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput
                v-model.lazy="model.insuranceCost"
                :format="fieldNumberFormat"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>
                Upkeep
                <v-tooltip
                  content-class="tooltip"
                  text="Costs may include garbage removal, recycling charges, applicable supplies."
                  max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput
                v-model.lazy="model.upkeepLabourCost"
                :format="fieldNumberFormat"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>
                Office Furniture and Equipment
                <v-tooltip
                  content-class="tooltip"
                  text="Costs may include laptops, tablets, cell phones used for the operation of the business, desks, chairs, tables."
                  max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput
                v-model.lazy="model.furnitureEquipmentsCost"
                :format="fieldNumberFormat"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>
                Facility Maintenance and Minor Improvements
                <v-tooltip
                  content-class="tooltip"
                  text="Costs may include repairs, appliance/furniture replacement, snow removal."
                  max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput
                v-model.lazy="model.maintenanceRepairsCost"
                :format="fieldNumberFormat"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>
                Janitorial Services
                <v-tooltip content-class="tooltip" text="Provided by arm's length third party." max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput
                v-model.lazy="model.suppliesCost"
                :format="fieldNumberFormat"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>
                Utilities
                <v-tooltip
                  content-class="tooltip"
                  text="Costs may include gas, electricity, water, phone, internet."
                  max-width="300px">
                  <template #activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput
                v-model.lazy="model.utilitiesCost"
                :format="fieldNumberFormat"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <AppLabel>Total Yearly Costs</AppLabel>
            </v-col>
            <v-col cols="12" sm="5" class="pl-sm-6">
              <AppNumberInput
                :value="totalYearlyCost"
                :format="totalNumberFormat"
                variant="plain"
                readonly
                class="totalYearlyCost"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
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
      insuranceCost: this.currentApplication?.insuranceCost
        ? this.currentApplication?.insuranceCost?.toFixed(2)
        : '0.00',
      upkeepLabourCost: this.currentApplication?.upkeepLabourCost
        ? this.currentApplication?.upkeepLabourCost?.toFixed(2)
        : '0.00',
      suppliesCost: this.currentApplication?.suppliesCost ? this.currentApplication?.suppliesCost?.toFixed(2) : '0.00',
      utilitiesCost: this.currentApplication?.utilitiesCost
        ? this.currentApplication?.utilitiesCost?.toFixed(2)
        : '0.00',
      maintenanceRepairsCost: this.currentApplication?.maintenanceRepairsCost
        ? this.currentApplication?.maintenanceRepairsCost?.toFixed(2)
        : '0.00',
      furnitureEquipmentsCost: this.currentApplication?.furnitureEquipmentsCost
        ? this.currentApplication?.furnitureEquipmentsCost?.toFixed(2)
        : '0.00',
    }
  },
}
</script>
<style scoped>
.totalYearlyCost {
  font-weight: 700;
}
</style>
