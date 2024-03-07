<template>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li>
          <AppLabel>Eligibility:</AppLabel>
          Participants are eligible if using a designated vehicle to safely transport children:
        </li>
      </ul>
      <v-row no-gutters>
        <v-col cols="12" class="ml-10 my-2">
          <ul>
            <li>Between school and their offsite child care location;</li>
            <li>
              To and from the child care location and a collective point of access where geographical distance or obstacle (e.g. a body of water) creates an ongoing barrier for families and
              Participants.
            </li>
          </ul>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li>
          <AppLabel>Eligible expenses:</AppLabel>
          Mileage of the Participant's designated vehicle will be reimbursed at the B.C. government standard mileage rate for private vehicles. This includes
          <strong>funding for the Participant's routine vehicle costs, including financing costs, fuel, insurance, depreciation, and routine maintenance.</strong>
          The Participant's actual lease or financing costs for the designed vehicle used to transport children for the purpose stated in the Eligibility section above. The Participant is required to
          submit supporting information and documentation relating to the actual mileage and lease/purchase costs of the designated vehicle to the Province.
        </li>
      </ul>
    </v-col>
  </v-row>
  <br />
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li>
          <AppLabel>Ineligible expenses include:</AppLabel>
          Travel related to operations (e.g., grocery store), driver wages, other transportation, tickets or traffic fines, licensing costs.
        </li>
      </ul>
    </v-col>
  </v-row>
  <v-divider class="mt-2"></v-divider>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">Please describe how you intend to use this funding</v-col>
  </v-row>

  {{ models }}

  <div v-for="model in models" :key="model.supplementaryApplicationId ? model.supplementaryApplicationId : model.id" @input="update(model)">
    <v-row no-gutters class="mt-2 pt-2">
      <v-col cols="12" lg="7" class="px-4">
        <v-row no-gutters>
          <v-col cols="6" xl="5" class="pt-2">
            <p>VIN:</p>
          </v-col>
          <v-col cols="6" xl="7" align="center" class="px-2">
            <v-text-field v-model="model.VIN" variant="outlined" density="compact" :disabled="readonly" maxlength="20"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="7" class="px-4">
        <v-row no-gutters>
          <v-col cols="6" xl="5" class="pt-2">
            <p>Vehicle usage in KM/month at time of Application:</p>
          </v-col>
          <v-col cols="6" xl="7" align="center" class="px-2">
            <v-text-field v-model="model.estimatedMileage" type="number" variant="outlined" density="compact" :disabled="readonly" maxlength="20"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="7" class="px-4">
        <v-row no-gutters>
          <v-col cols="6" xl="5" class="pt-2">
            <p>Estimated mileage of the year:</p>
          </v-col>
          <v-col cols="6" xl="7" align="center" class="px-2">
            <v-text-field v-model="model.odometer" type="number" variant="outlined" density="compact" :disabled="readonly" maxlength="20"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="7" class="px-4">
        <v-row no-gutters>
          <v-col cols="6" xl="5" class="pt-2">
            <p>Vehicle financing/Lease cost per month: (If any)</p>
          </v-col>
          <v-col cols="6" xl="7" align="center" class="px-2">
            <AppNumberInput v-model.lazy="model.monthlyLease" :disabled="readonly" prefix="$" maxlength="12" :rules="[rules.max(5000000)]"></AppNumberInput>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="mt-2"></v-divider>
  </div>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'

export default {
  components: { AppLabel, AppNumberInput },
  props: {
    transportModels: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
  },
  emits: ['update'],
  data() {
    return {
      panel: [],
      models: {},
      rules,
      readonly: false, //update later when we have submitted forms
    }
  },
  computed: {},
  watch: {
    // models: {
    //   handler(value) {
    //     this.$emit('update', value)
    //   },
    //   deep: true,
    // },
  },
  async created() {
    this.models = { ...this.transportModels }
  },
  methods: {
    update(model) {
      this.$emit('update', model)
      //console.log(model)
    },
  },
}
</script>
