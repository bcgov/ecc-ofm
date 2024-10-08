<template>
  <AppAlertBanner v-if="isWarningDisplayed" type="info">You have already received the Indigenous Programming Allowance for the current year.</AppAlertBanner>
  <v-row no-gutters class="mr-2 my-4">
    <v-col cols="12">
      <AppLabel>Purpose of the fund:</AppLabel>

      To provide additional funds to support the delivery of Indigenous curriculum in collaboration with Indigenous Peoples in their community.
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Eligible expenses:</AppLabel>
      Eligible expenses: Expenses to enhance the participant's delivery of Indigenous curriculum in collaboration with Indigenous Peoples in their communities.
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Ineligible expenses include:</AppLabel>
      Staffing enhancements
    </v-col>
  </v-row>
  <br />
  <v-row no-gutters class="mr-2 my-2">
    <v-col cols="12">
      <AppLabel>Funding Amount:</AppLabel>
      Child care facilities may access the Indigenous Programming Allowance annually, as follows:

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
      Indicate how you plan to use this funding. Select all that apply.
      <strong>Eligible Expences may include, but are not limited to:</strong>
    </v-col>
  </v-row>

  <v-row v-for="item in INDIG_CHECKBOX_LABELS" :key="item.value" no-gutters>
    <v-checkbox v-model="model.indigenousFundingModel" density="compact" :disabled="readOnly" class="pl-8" prepend-icon :label="item.label" :value="item.value"></v-checkbox>
  </v-row>

  <v-row v-if="isOtherBoxDisplayed" no-gutters class="ml-10 mr-2 my-0">
    <v-textarea
      v-model.trim="model.indigenousOtherDescription"
      :disabled="readOnly"
      placeholder="Detailed description of other expenses"
      counter
      maxlength="1000"
      variant="outlined"
      :rules="rules.required"></v-textarea>
  </v-row>
</template>

<script>
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import rules from '@/utils/rules'
import { INDIG_CHECKBOX_LABELS } from '@/utils/constants/suppConstants'
import { isApplicationLocked } from '@/utils/common'

export default {
  components: { AppAlertBanner, AppLabel },
  props: {
    indigenousProgrammingModel: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    formDisabled: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update'],
  data() {
    return {
      model: {},
      rules,
    }
  },
  computed: {
    isOtherBoxDisplayed() {
      return this.model?.indigenousFundingModel?.includes(this.INDIG_CHECKBOX_LABELS.find((item) => item.label === 'Other').value)
    },
    readOnly() {
      return isApplicationLocked(this.indigenousProgrammingModel?.statusCode) || this.formDisabled
    },
    isWarningDisplayed() {
      return isApplicationLocked(this.indigenousProgrammingModel?.statusCode)
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
    this.INDIG_CHECKBOX_LABELS = INDIG_CHECKBOX_LABELS
  },
}
</script>
