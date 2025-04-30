<template>
  <v-container fluid class="pa-0 my-8">
    <h4>Yearly Facility Cost</h4>
    <p v-if="facilityType === FACILITY_TYPES.RENT_LEASE">Enter the amount as indicated in your rent/lease agreement, excluding GST.</p>
    <v-card class="my-2" variant="outlined">
      <!-- RENT/LEASE -->
      <v-row v-if="facilityType === FACILITY_TYPES.RENT_LEASE" no-gutters class="pt-4">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Rent/Lease</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.rentLeaseCost" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITH MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Mortgage</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.mortgageCost" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.propertyTax" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.strataFee" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- OWNED WITHOUT MORTGAGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.OWNED_WITHOUT_MORTGAGE" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.propertyTax" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.strataFee" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- PROVIDED FREE OF CHARGE -->
      <v-row v-if="facilityType === FACILITY_TYPES.PROVIDED_FREE_OF_CHARGE" no-gutters class="mt-2 pt-2">
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Fee (If Applicable)</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.applicableFee" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Property/Municipal Tax</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.propertyTax" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6" class="px-4">
          <v-row no-gutters>
            <v-col cols="12" sm="7" class="pt-2">
              <p>Strata Fees</p>
            </v-col>
            <v-col cols="12" sm="5" align="center" class="px-sm-2">
              <AppNumberInput v-model.lazy="model.strataFee" :format="fieldNumberFormat" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
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
              <AppNumberInput :value="totalYearlyCost" :format="totalNumberFormat" variant="plain" readonly class="totalYearlyCost"></AppNumberInput>
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
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import rules from '@/utils/rules'
import { FACILITY_TYPES } from '@/utils/constants'

export default {
  components: { AppLabel, AppNumberInput },
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
    facilityType: {
      handler() {
        this.model = {
          rentLeaseCost: '0.00',
          mortgageCost: '0.00',
          propertyTax: '0.00',
          strataFee: '0.00',
          applicableFee: '0.00',
        }
      },
    },
  },
  created() {
    this.model = {
      rentLeaseCost: this.currentApplication?.rentLeaseCost ? this.currentApplication?.rentLeaseCost?.toFixed(2) : '0.00',
      mortgageCost: this.currentApplication?.mortgageCost ? this.currentApplication?.mortgageCost?.toFixed(2) : '0.00',
      propertyTax: this.currentApplication?.propertyTax ? this.currentApplication?.propertyTax?.toFixed(2) : '0.00',
      strataFee: this.currentApplication?.strataFee ? this.currentApplication?.strataFee?.toFixed(2) : '0.00',
      applicableFee: this.currentApplication?.applicableFee ? this.currentApplication?.applicableFee?.toFixed(2) : '0.00',
    }
    this.FACILITY_TYPES = FACILITY_TYPES
  },
}
</script>
<style scoped>
.totalYearlyCost {
  font-weight: 700;
}
</style>
