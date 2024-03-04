<template>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li><AppLabel>Purpose of the Fund:</AppLabel></li>
      </ul>
      The Indigenous Programming Allowance is intended to provide additional funds to child care providers to support the participant’s delivery of Indigenous curriculum in collaboration with
      Indigenous Peoples in their community. To reduce barriers to accessing these funds, all expenses are considered eligible, except for staffing enhancements for the purpose of reducing ratio. 
      Providers may reach out to BC Aboriginal Child Care Society (BCACCS), Métis Nation of BC (MNBC), and/or the Indigenous Perspectives Society (IPS) for resources that support child care providers
      to enhance the their programs.
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li>
          <AppLabel>Funding Amount:</AppLabel>
          Child care facilities may access the Indigenous Programming Allowance annually, as follows:
        </li>
      </ul>
      <v-row no-gutters>
        <v-col cols="12" class="ml-10 my-2">
          <ul>
            <li>$5,000 for Facilities with an Operational Capacity of more than 20 children</li>
            <li>$3,500 for Facilities with an Operational Capacity of between 10-20 children</li>
            <li>$2,000 for Facilities with an Operational Capacity of 9 or less children</li>
          </ul>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-divider class="mt-2"></v-divider>

  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      Ineligible expences include: Staffing enhencements for the purposes of reducing ratio.
      <br />
      <br />
      Please describe how you intend to use this funding
      <strong>(Eligible Expences may include, but are not limited to):</strong>
    </v-col>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox
      v-model="model.indigenousFundingModel"
      density="compact"
      class="pl-8"
      prepend-icon
      label="Honoraria for Elder involment, language revitalization and/ or other resource people including curriculum develpment resource"
      value="1"></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="2" density="compact" class="pl-8" prepend-icon label="Culturally based meals and traditional foods."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="3" density="compact" class="pl-8" prepend-icon label="Materials for a cultural program (beads, wood, food, etc.)."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="4" density="compact" class="pl-8" prepend-icon label="Books, music, videos, and arts and crafts materials."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="5" density="compact" class="pl-8" prepend-icon label="Culturally relevant toys and games."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox
      v-model="model.indigenousFundingModel"
      value="6"
      density="compact"
      class="pl-8"
      prepend-icon
      label="Facility decore enhancement-picture, including artwork, outdoor play, and natural materials."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="7" density="compact" class="pl-8" prepend-icon label="Field trips and outings."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="8" density="compact" class="pl-8" prepend-icon label="Land-based play support."></v-checkbox>
  </v-row>
  <v-row no-gutters class="mr-2 my-0">
    <v-checkbox v-model="model.indigenousFundingModel" value="9" density="compact" class="pl-8" prepend-icon label="Other"></v-checkbox>
  </v-row>

  <v-row v-if="isOtherBoxDisplayed" no-gutters class="ml-10 mr-2 my-0">
    <v-textarea v-model.trim="model.indigenousOtherDescription" placeholder="Detailed description of other expenses" counter maxlength="1000" variant="outlined" :rules="rules.required"></v-textarea>
  </v-row>
  <!--Other should pop up with a memo box-->
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'

export default {
  components: { AppLabel },
  props: {
    indigenousProgrammingModel: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  emits: ['update'],
  data() {
    return {
      panel: [],
      model: {},
      rules,
    }
  },
  computed: {
    isOtherBoxDisplayed() {
      return this.model.indigenousFundingModel.includes('9')
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
  async created() {
    this.model = this.indigenousProgrammingModel
  },
  methods: {},
}
</script>
