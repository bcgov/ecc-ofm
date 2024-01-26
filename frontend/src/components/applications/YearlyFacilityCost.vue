<template>
  <v-container fluid class="pa-0">
    <AppLabel>Yearly Facility Cost</AppLabel>
    <v-card class="my-2" variant="outlined">
      <!-- RENT/LEASE -->
      <v-row v-if="facilityType === FACILITY_TYPES.RENT_LEASE" no-gutters class="pt-4">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Rent/Lease</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.rentLeaseCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('rentLeaseCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITH MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Mortgage</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.mortgageCost"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('mortgageCost')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Property/municipal Tax</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.propertyTax"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('propertyTax')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.strataFee"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('strataFee')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITHOUT MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITHOUT_MORTGAGE" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Property/municipal Tax</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.propertyTax"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('propertyTax')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.strataFee"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('strataFee')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- PROVIDED FREE OF CHARGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.PROVIDED_FREE_OF_CHARGE" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Fee (If Applicable)</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.applicableFee"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('applicableFee')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Property/municipal Tax</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.propertyTax"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('propertyTax')"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="6" xl="5" class="pt-2">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="6" xl="7" align="center" class="px-2">
              <v-text-field
                v-model.lazy="model.strataFee"
                v-number="fieldNumberFormat"
                variant="outlined"
                density="compact"
                :disabled="readonly"
                prefix="$"
                maxlength="12"
                :rules="[rules.max(5000000)]"
                @input="sanitizeNumber('strataFee')"></v-text-field>
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
import { FACILITY_TYPES } from '@/utils/constants'

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
    facilityType: {
      type: Number,
      default: 0,
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
    facilityType: {
      handler() {
        this.model = {
          rentLeaseCost: 0,
          mortgageCost: 0,
          propertyTax: 0,
          strataFee: 0,
          applicableFee: 0,
        }
      },
    },
  },
  created() {
    this.model = {
      rentLeaseCost: this.currentApplication?.rentLeaseCost ?? 0,
      mortgageCost: this.currentApplication?.mortgageCost ?? 0,
      propertyTax: this.currentApplication?.propertyTax ?? 0,
      strataFee: this.currentApplication?.strataFee ?? 0,
      applicableFee: this.currentApplication?.applicableFee ?? 0,
    }
    this.FACILITY_TYPES = FACILITY_TYPES
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
