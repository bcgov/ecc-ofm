<template>
  <div v-if="isReadOnly">
    <AppWarningMessage>
      <slot>
        <div>You have already received the Indigenous Programming Allowance for the current term.</div>
      </slot>
    </AppWarningMessage>
  </div>
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

      To reduce barriers to accessing these funds, all expenses are eligible except for staffing enhancements for the purpose of reducing ratio.
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
    <v-checkbox v-model="model.indigenousFundingModel" density="compact" :disabled="isReadOnly" class="pl-8" prepend-icon :label="item.label" :value="item.value"></v-checkbox>
  </v-row>

  <v-row v-if="isOtherBoxDisplayed" no-gutters class="ml-10 mr-2 my-0">
    <v-textarea
      v-model.trim="model.indigenousOtherDescription"
      :disabled="isReadOnly"
      placeholder="Detailed description of other expenses"
      counter
      maxlength="1000"
      variant="outlined"
      :rules="rules.required"></v-textarea>
  </v-row>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppWarningMessage from '@/components/ui/AppWarningMessage.vue'
import rules from '@/utils/rules'
import { INDIG_CHECKBOX_LABELS } from '@/utils/constants/suppConstants'
import { SUPPLEMENTARY_APPLICATION_STATUS_CODES } from '@/utils/constants'
import { isApplicationLocked } from '@/utils/common'

export default {
  components: { AppLabel, AppWarningMessage },
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
    isReadOnly() {
      return isApplicationLocked(this.indigenousProgrammingModel?.statusCode, SUPPLEMENTARY_APPLICATION_STATUS_CODES)
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
