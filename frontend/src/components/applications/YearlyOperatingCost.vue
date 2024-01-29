<template>
  <v-container fluid class="pa-0">
    <AppLabel>Yearly Operating Cost</AppLabel>
    <v-card class="my-2" variant="outlined">
      <v-row no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Insurance</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.insuranceCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('insuranceCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>
                Upkeep And Labour Supplies
                <v-tooltip content-class="tooltip" :text="UPKEEP_INFO_TXT">
                  <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.upkeepLabourSuppliesCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('upkeepLabourSuppliesCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>
                Utilities
                <v-tooltip content-class="tooltip" :text="UTILITIES_INFO_TXT">
                  <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.utilitiesCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('utilitiesCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>
                Maintenance And Repairs
                <v-tooltip content-class="tooltip" :text="MAINTENANCE_INFO_TXT">
                  <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.maintenanceRepairsCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('maintenanceRepairsCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>
                Furniture And Equipments
                <v-tooltip content-class="tooltip" :text="FURNITURE_INFO_TXT">
                  <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
                  </template>
                </v-tooltip>
              </p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.furnitureEquipmentsCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('furnitureEquipmentsCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <AppLabel>Total Yearly Costs</AppLabel>
            </v-col>
            <v-col cols="6" xl="7" class="pl-6">
              <v-text-field v-number="totalNumberFormat" class="totalYearlyCost" :value="totalYearlyCost" variant="plain" density="compact" readonly></v-text-field>
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
import { directive as VNumber } from '@coders-tm/vue-number-format'
import rules from '@/utils/rules'

export default {
  components: { AppLabel },
  directives: {
    number: VNumber,
  },
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
        nullValue: 0,
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
      // show decimal point only if totalYearlyCost is a decimal number
      return totalYearlyCost % 1 != 0 ? totalYearlyCost.toFixed(2) : totalYearlyCost
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
      insuranceCost: this.currentApplication?.insuranceCost ?? 0,
      upkeepLabourSuppliesCost: this.currentApplication?.upkeepLabourSuppliesCost ?? 0,
      utilitiesCost: this.currentApplication?.utilitiesCost ?? 0,
      maintenanceRepairsCost: this.currentApplication?.maintenanceRepairsCost ?? 0,
      furnitureEquipmentsCost: this.currentApplication?.furnitureEquipmentsCost ?? 0,
    }
    this.UTILITIES_INFO_TXT = 'This is a placeholder message'
    this.FURNITURE_INFO_TXT = 'This is a placeholder message'
    this.UPKEEP_INFO_TXT = 'This is a placeholder message'
    this.MAINTENANCE_INFO_TXT = 'This is a placeholder message'
  },
  methods: {
    sanitizeNumber(key) {
      if (typeof this.model[key] === 'number') return
      this.model[key] = this.model[key]?.replace(/,/g, '')
    },
  },
}
</script>
<style scoped>
.totalYearlyCost {
  font-weight: 700;
}
</style>
