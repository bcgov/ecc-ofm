<template>
  <v-card elevation="2" class="ma-2">
    <v-card-title class="card-title"><strong>Base Funding</strong></v-card-title>
    <v-skeleton-loader :loading="loading" type="table-tbody" class="pa-6">
      <v-container fluid class="pa-0">
        <div>The base funding shown is only from the current funding year.</div>
        <v-row no-gutters class="my-4">
          <v-col cols="12" lg="6">
            <v-card class="pa-4 mb-2 mb-sm-0 mr-lg-4">
              <div>
                <h5 class="mb-4">Instructional Human Resources</h5>
                <h3>$ {{ format.formatDecimalNumber(envelopes.HRTotal) }}</h3>
                <v-row no-gutters class="my-1">
                  <v-col cols="12" sm="8">> Wages and paid time off</v-col>
                  <v-col cols="12" sm="4">
                    <strong>${{ format.formatDecimalNumber(envelopes.HRWagePaidTimeOff) }}</strong>
                  </v-col>
                </v-row>
                <v-row no-gutters class="my-1">
                  <v-col cols="12" sm="8">> Benefits</v-col>
                  <v-col cols="12" sm="4">
                    <strong>${{ format.formatDecimalNumber(envelopes.HRBenefits) }}</strong>
                  </v-col>
                </v-row>
                <v-row no-gutters class="my-1">
                  <v-col cols="12" sm="8">> Employer Health Tax</v-col>
                  <v-col cols="12" sm="4">
                    <strong>${{ format.formatDecimalNumber(envelopes.HREmployerHealthTax) }}</strong>
                  </v-col>
                </v-row>
                <v-row no-gutters class="my-1">
                  <v-col cols="12" sm="8">> Professional Development Hours</v-col>
                  <v-col cols="12" sm="4">
                    <strong>${{ format.formatDecimalNumber(envelopes.HRProDevHours) }}</strong>
                  </v-col>
                </v-row>
                <v-row no-gutters class="my-1">
                  <v-col cols="12" sm="8">> Professional Development Expenses</v-col>
                  <v-col cols="12" sm="4">
                    <strong>${{ format.formatDecimalNumber(envelopes.HRProDevExpenses) }}</strong>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" lg="6" class="mb-sm-4 mb-lg-0">
            <v-row no-gutters>
              <v-col cols="12" sm="6">
                <v-card class="pa-4 mt-2 mt-sm-4 mt-lg-0 mr-sm-2 ml-lg-2">
                  <h5 class="mb-4">Programming</h5>
                  <h3>$ {{ format.formatDecimalNumber(envelopes.Programming) }}</h3>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="pa-4 mt-4 mt-lg-0 ml-sm-2 ml-lg-4">
                  <h5 class="mb-4">Administrative</h5>
                  <h3>$ {{ format.formatDecimalNumber(envelopes.Administrative) }}</h3>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="pa-4 mt-4 mt-lg-6 ml-lg-2 mr-sm-2">
                  <h5 class="mb-4">Facility</h5>
                  <h3>$ {{ format.formatDecimalNumber(envelopes.Facility) }}</h3>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6">
                <v-card class="pa-4 mt-4 mt-lg-6 ml-sm-2 ml-lg-4">
                  <h5 class="mb-4">Operational</h5>
                  <h3>$ {{ format.formatDecimalNumber(envelopes.Operational) }}</h3>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </v-card>
</template>

<script>
import format from '@/utils/format'

export default {
  name: 'BaseFundingCard',
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    fundingDetails: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    envelopes() {
      const envs = Object.keys(this.fundingDetails).reduce((allEnvelopes, currentKey) => {
        if (!currentKey.startsWith('envelope_')) return allEnvelopes

        const envelopeName = currentKey.split('_')[1]
        const baseOnlyTotal = this.fundingDetails[currentKey]
        const reallocationTotalWithBase = this.fundingDetails[`reallocation_${envelopeName}`]
        const totalToUse = reallocationTotalWithBase || baseOnlyTotal || 0

        return {
          ...allEnvelopes,
          [envelopeName]: totalToUse,
        }
      }, {})
      return envs
    },
  },
  created() {
    this.format = format
  },
}
</script>
<style scoped>
.card-title {
  background-color: lightgray;
}
</style>
