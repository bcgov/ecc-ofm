<template>
  <v-container fluid class="pa-0 ma-0">
    <AppNumberInput
      v-if="getReportQuestionTypeNameById(question?.type) === 'Number'"
      v-model.lazy="updatedResponse.value"
      :format="NUMBER_FORMAT"
      maxlength="12"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled" />

    <AppNumberInput
      v-if="getReportQuestionTypeNameById(question?.type) === 'Currency'"
      v-model.lazy="updatedResponse.value"
      :format="CURRENCY_FORMAT"
      maxlength="12"
      prefix="$"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled" />

    <v-text-field
      v-if="getReportQuestionTypeNameById(question?.type) === 'Text'"
      v-model.trim="updatedResponse.value"
      :placeholder="RESPONSE_PLACEHOLDER"
      variant="outlined"
      density="compact"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled" />

    <v-textarea
      v-if="getReportQuestionTypeNameById(question?.type) === 'Text Area'"
      v-model.trim="updatedResponse.value"
      :placeholder="RESPONSE_PLACEHOLDER"
      counter
      variant="outlined"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled" />

    <v-date-picker v-if="getReportQuestionTypeNameById(question?.type) === 'Date'" v-model="updatedResponse.value" locale="en" :disabled="readonly"></v-date-picker>

    <v-radio-group
      v-if="getReportQuestionTypeNameById(question?.type) === 'Two Option'"
      v-model="updatedResponse.value"
      :rules="rules.required"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled"
      inline
      color="primary">
      <v-radio :label="question?.choices[0]" :value="question?.choices[0]"></v-radio>
      <v-radio :label="question?.choices[1]" :value="question?.choices[1]"></v-radio>
    </v-radio-group>

    <v-select
      v-if="getReportQuestionTypeNameById(question?.type) === 'Choice'"
      v-model="updatedResponse.value"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled"
      :placeholder="RESPONSE_PLACEHOLDER"
      :items="question?.choices"
      density="compact"
      variant="outlined"
      return-object />

    <v-select
      v-if="isMultipleChoiceQuestion(question?.type)"
      v-model.lazy="updatedResponse.value"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled"
      :placeholder="RESPONSE_PLACEHOLDER"
      variant="outlined"
      chips
      multiple
      :items="question?.choices">
      <template v-slot:prepend-item>
        <v-list-item title="Select All" @click="toggleAllItems">
          <template v-slot:prepend>
            <v-checkbox-btn :color="someItemsSelected ? '#003366' : undefined" :indeterminate="someItemsSelected && !allItemsSelected" :model-value="someItemsSelected"></v-checkbox-btn>
          </template>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
    </v-select>
  </v-container>
</template>

<script>
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import rules from '@/utils/rules'
import { isEmpty } from 'lodash'
import { convertStringToArray } from '@/utils/common'

export default {
  components: { AppNumberInput },

  props: {
    question: {
      type: Object,
      default: () => {
        return {}
      },
    },
    response: {
      type: Object,
      default: () => {
        return {}
      },
    },
    readonly: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['update'],

  data() {
    return {
      rules,
      updatedResponse: {},
    }
  },

  computed: {
    ...mapState(useAppStore, ['getReportQuestionTypeNameById']),
    disabled() {
      return this.readonly || !isEmpty(this.question?.inheritedValues)
    },
    validationRules() {
      return this.question?.responseRequired ? [...rules.required] : []
    },
    allItemsSelected() {
      return this.updatedResponse?.value?.length === this.question?.choices?.length
    },
    someItemsSelected() {
      return this.updatedResponse?.value?.length > 0
    },
  },

  watch: {
    response: {
      handler() {
        this.updatedResponse.value = this.isMultipleChoiceQuestion(this.question?.type) ? convertStringToArray(this.response.value) : this.response.value
      },
      deep: true,
    },
    updatedResponse: {
      handler() {
        if ((isEmpty(this.response) && isEmpty(this.updatedResponse?.value)) || this.response?.value === this.updatedResponse?.value) return
        this.$emit('update', Object.assign({}, this.updatedResponse))
      },
      deep: true,
    },
  },

  created() {
    this.initializeResponse()
    this.RESPONSE_PLACEHOLDER = ''
    this.CURRENCY_FORMAT = {
      nullValue: '0.00',
      min: 0,
      decimal: '.',
      separator: ',',
    }
    this.NUMBER_FORMAT = {
      nullValue: '0',
      min: 0,
      separator: ',',
      precision: 0,
    }
  },

  methods: {
    isEmpty,

    initializeResponse() {
      this.updatedResponse = Object.assign({}, this.response)
      this.updatedResponse.questionId = this.question?.questionId
      this.updatedResponse.questionType = this.question?.type
      this.updatedResponse.hasConditionalChildren = this.question?.hasConditionalChildren
      this.updatedResponse.hasValueInheritanceChildren = this.question?.hasValueInheritanceChildren
      this.updatedResponse.surveyResponseId = this.$route.params.surveyResponseGuid
      this.updatedResponse.value = this.isMultipleChoiceQuestion(this.question?.type) ? convertStringToArray(this.updatedResponse.value) : this.updatedResponse.value
    },

    toggleAllItems() {
      if (this.allItemsSelected) {
        this.updatedResponse.value = []
      } else {
        this.updatedResponse.value = this.question?.choices?.slice()
      }
    },

    isMultipleChoiceQuestion(questionType) {
      return ['Multiple Choice'].includes(this.getReportQuestionTypeNameById(questionType))
    },
  },
}
</script>