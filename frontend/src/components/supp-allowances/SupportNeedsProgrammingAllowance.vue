<template>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li><AppLabel>Purpose of the Fund:</AppLabel></li>
      </ul>
      Children with support needs, including those with disabilities, neurodiversity, or behaviors that challenge staff, may need additional support, accommodations, or program modifications to
      participate meaningfully alongside other children. The Support Needs Programming Allowance is intended to help childcare providers increase their program's ability to welcome children and
      families of all abilities by covering costs related to inclusion that may not be sufficiently covered by base funding or other provincial funding sources.
      <br />
      Childcare providers are encouraged to use this funding most effectively with their local Supported Child Development (SCD) and/or Aboriginal Supported Child Development (ASCD) programs.
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <ul>
        <li>
          <AppLabel>Inclusion Policy Requirement:</AppLabel>
          Childcare providers participating in the OFM are required to have an Inclusion Policy for their program.
          <strong>Providers participating in the OFM Test must have, or be working on, an Inclusion Policy to receive this funding.</strong>
        </li>
      </ul>
    </v-col>
  </v-row>
  <v-divider class="mt-2"></v-divider>
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">Please describe how you intend to use this funding:</v-col>
  </v-row>

  <v-row v-for="item in CHECKBOX_LABELS" :key="item.value" no-gutters>
    <v-col cols="11" lg="6">
      <v-checkbox v-model="model.supportFundingModel" density="compact" class="pl-lg-8 mr-0" prepend-icon :label="item.label" :value="item.value"></v-checkbox>
    </v-col>

    <v-col cols="1">
      <v-tooltip v-if="item.tooltip" content-class="tooltip" :text="item.tooltip">
        <template #activator="{ props }">
          <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>

  <v-row v-if="isOtherBoxDisplayed" no-gutters class="ml-10 mr-2 my-0">
    <v-textarea v-model.trim="model.supportOtherDescription" placeholder="Detailed description of other expenses" counter maxlength="1000" variant="outlined" :rules="rules.required"></v-textarea>
  </v-row>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'

export default {
  components: { AppLabel },
  props: {
    supportModel: {
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
      return this.model?.supportFundingModel.includes('4')
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
    this.model = { ...this.supportModel }

    this.CHECKBOX_LABELS = [
      { label: 'Resources and materials with the intention of increasing accessibility and inclusion for all children', value: '1', tooltip: 'e.g. Toileting step stool' },
      { label: 'Resources to proactively support inclusion of children with diverse needs', value: '2', tooltip: 'e.g. Sensory toys' },
      { label: 'Accessibility enhancements in the facility', value: '3', tooltip: 'e.g. Wheelchair ramps, automatic door installations, bathroom renovations for accessibility' },
      { label: 'Other', value: '4' },
    ]
  },
}
</script>
