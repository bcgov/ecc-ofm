<template>
  <v-form ref="form">
    <div v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.NUMBER">
      <strong v-if="isFixedResponseQuestion">{{ !question?.fixedResponses ? '0' : question?.fixedResponses }}</strong>
      <AppNumberInput v-else v-model.lazy="updatedResponse.value" :format="NUMBER_FORMAT" maxlength="12" :rules="validationRules" :hide-details="isEmpty(validationRules)" :disabled="disabled" />
    </div>

    <div v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.CURRENCY">
      <strong v-if="isFixedResponseQuestion">$ {{ !question?.fixedResponses ? '0.00' : question?.fixedResponses }}</strong>
      <AppNumberInput
        v-else
        v-model.lazy="updatedResponse.value"
        :format="CURRENCY_FORMAT"
        maxlength="12"
        prefix="$"
        :rules="validationRules"
        :hide-details="isEmpty(validationRules)"
        :disabled="disabled" />
    </div>

    <div v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.TEXT">
      <strong v-if="isFixedResponseQuestion">{{ question?.fixedResponses }}</strong>
      <v-text-field v-else v-model.trim="updatedResponse.value" variant="outlined" density="compact" :rules="validationRules" :hide-details="isEmpty(validationRules)" :disabled="disabled" />
    </div>

    <v-textarea
      v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.TEXT_AREA"
      v-model.trim="updatedResponse.value"
      variant="outlined"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled" />

    <v-date-picker v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.DATE" v-model="updatedResponse.value" locale="en" :disabled="readonly"></v-date-picker>

    <v-radio-group
      v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.TWO_OPTION"
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
      v-if="getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.CHOICE"
      v-model="updatedResponse.value"
      :rules="validationRules"
      :hide-details="isEmpty(validationRules)"
      :disabled="disabled"
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
  </v-form>
</template>

<script>
import reportMixin from '@/mixins/reportMixin'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import rules from '@/utils/rules'
import { isEmpty, cloneDeep } from 'lodash'
import { convertStringToArray } from '@/utils/common'

export default {
  components: { AppNumberInput },
  mixins: [reportMixin],
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
    validation: {
      type: Boolean,
      default: false,
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
    disabled() {
      return this.readonly || !isEmpty(this.question?.inheritanceValues) || this.isFixedResponseQuestion
    },
    isFixedResponseQuestion() {
      return !isEmpty(this.question?.fixedResponseQuery)
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
    'updatedResponse.value': {
      handler() {
        if ((isEmpty(this.response) && isEmpty(this.updatedResponse?.value)) || this.response?.value === this.updatedResponse?.value) return
        this.$emit('update', cloneDeep(this.updatedResponse))
      },
      deep: true,
    },
  },

  created() {
    this.initializeResponse()
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

  async mounted() {
    await this.validateQuestionResponse()
  },

  methods: {
    initializeResponse() {
      if (this.isFixedResponseQuestion) return
      this.updatedResponse = cloneDeep(this.response)
      this.updatedResponse.questionId = this.question?.questionId
      this.updatedResponse.questionType = this.question?.type
      this.updatedResponse.hasConditionalChildren = this.question?.hasConditionalChildren
      this.updatedResponse.hasValueInheritanceChildren = this.question?.hasValueInheritanceChildren
      this.updatedResponse.surveyResponseId = this.$route.params.surveyResponseGuid
      if (this.isMultipleChoiceQuestion(this.question?.type)) {
        this.updatedResponse.value = convertStringToArray(this.updatedResponse.value)
      } else if (
        [this.SURVEY_QUESTION_TYPES.NUMBER, this.SURVEY_QUESTION_TYPES.CURRENCY].includes(this.getReportQuestionTypeNameById(this.question?.type)) &&
        isEmpty(this.updatedResponse.questionResponseId)
      ) {
        this.updatedResponse.value = '0'
      }
    },

    toggleAllItems() {
      if (this.allItemsSelected) {
        this.updatedResponse.value = []
      } else {
        this.updatedResponse.value = this.question?.choices?.slice()
      }
    },

    async validateQuestionResponse() {
      if (!this.validation || this.readonly) return
      await this.$refs.form?.validate()
    },
  },
}
</script>
