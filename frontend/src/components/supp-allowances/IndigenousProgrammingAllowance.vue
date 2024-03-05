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

  <v-row v-for="item in CHECKBOX_LABELS" :key="item.value">
    <v-checkbox v-model="model.indigenousFundingModel" density="compact" class="pl-8" prepend-icon :label="item.label" :value="item.value"></v-checkbox>
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
      return this.model.indigenousFundingModel.includes('8')
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
    this.model = { ...this.indigenousProgrammingModel }

    this.CHECKBOX_LABELS = [
      { label: 'Honoraria for Elder involment, language revitalization and/ or other resource people including curriculum development resource', value: '1' },
      { label: 'Culturally based meals and traditional foods.', value: '2' },
      { label: 'Materials for a cultural program (beads, wood, food, etc.).', value: '3' },
      { label: 'Books, music, videos, and arts and crafts materials.', value: '4' },
      { label: 'Facility decor enhancement-picture, including artwork, outdoor play, and natural materials.', value: '5' },
      { label: 'Field trips and outings.', value: '6' },
      { label: 'Land-based play support.', value: '7' },
      { label: 'Other', value: '8' },
    ]
  },
}
</script>
