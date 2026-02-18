<template>
  <v-form ref="form">
    <div v-if="question?.type === SURVEY_QUESTION_TYPES.NUMBER">
      <div v-if="isFixedResponseQuestion" :class="readonly ? '' : 'mb-6'">
        <strong>{{ question?.fixedResponse || '0' }}</strong>
      </div>
      <AppNumberInput v-else v-model.lazy="updatedResponse.value" :format="NUMBER_FORMAT" maxlength="12" :rules="validationRules" :hide-details="readonly" :disabled="disabled" min-width="150px" />
    </div>

    <div v-if="question?.type === SURVEY_QUESTION_TYPES.PERCENT">
      <div v-if="isFixedResponseQuestion" :class="readonly ? '' : 'mb-6'">
        <strong>{{ question.calculator(allQuestions, allResponses) }}%</strong>
      </div>
      <AppNumberInput v-else v-model.lazy="updatedResponse.value" :format="NUMBER_FORMAT" maxlength="12" :rules="validationRules" :hide-details="readonly" :disabled="disabled" min-width="150px" />
    </div>

    <div v-if="question?.type === SURVEY_QUESTION_TYPES.CURRENCY">
      <div v-if="isFixedResponseQuestion" :class="readonly ? '' : 'mb-6'">
        <strong>$ {{ question?.fixedResponse ? question?.fixedResponse : '0.00' }}</strong>
      </div>
      <AppNumberInput
        v-else
        v-model.lazy="updatedResponse.value"
        :format="CURRENCY_FORMAT"
        maxlength="12"
        prefix="$"
        :rules="validationRules"
        :hide-details="readonly"
        :disabled="disabled"
        min-width="150px" />
    </div>

    <div v-if="question?.type === SURVEY_QUESTION_TYPES.TEXT">
      <div v-if="isFixedResponseQuestion" :class="readonly ? '' : 'mb-6'">
        <strong>{{ question?.fixedResponse }}</strong>
      </div>
      <v-text-field v-else v-model.trim="updatedResponse.value" variant="outlined" density="compact" :rules="validationRules" :hide-details="readonly" :disabled="disabled" min-width="150px" />
    </div>

    <v-textarea
      v-if="question?.type === SURVEY_QUESTION_TYPES.TEXT_AREA"
      v-model.trim="updatedResponse.value"
      variant="outlined"
      min-width="150px"
      :rules="validationRules"
      :hide-details="readonly"
      :disabled="disabled" />

    <AppDateInput
      v-if="question?.type === SURVEY_QUESTION_TYPES.DATE"
      v-model="updatedResponse.value"
      :rules="[...validationRules, rules.MMDDYYYY]"
      :disabled="disabled"
      :hide-details="readonly"
      max-width="auto"
      density="compact" />

    <v-radio-group
      v-if="question?.type === SURVEY_QUESTION_TYPES.TWO_OPTION"
      v-model="updatedResponse.value"
      :rules="rules.required"
      :hide-details="readonly"
      :disabled="disabled"
      inline
      color="primary">
      <v-radio :label="question?.choices[0]" :value="question?.choices[0]"></v-radio>
      <v-radio :label="question?.choices[1]" :value="question?.choices[1]"></v-radio>
    </v-radio-group>

    <v-select
      v-if="question?.type === SURVEY_QUESTION_TYPES.CHOICE"
      v-model="updatedResponse.value"
      :rules="validationRules"
      :hide-details="readonly"
      :disabled="disabled"
      :items="question?.choices"
      density="compact"
      variant="outlined"
      min-width="150px"
      return-object />

    <v-select
      v-if="question?.type === SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE"
      v-model.lazy="updatedResponse.value"
      :rules="validationRules"
      :hide-details="readonly"
      :disabled="disabled"
      variant="outlined"
      min-width="150px"
      chips
      multiple
      :items="question?.choices">
      <template #prepend-item>
        <v-list-item title="Select All" @click="toggleAllItems">
          <template #prepend>
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
import AppDateInput from '@/components/ui/AppDateInput.vue'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import rules from '@/utils/rules'
import { isEmpty, cloneDeep } from 'lodash'
import { convertStringToArray } from '@/utils/common'
import { SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR } from '@/utils/constants'

export default {
  components: { AppDateInput, AppNumberInput },
  mixins: [reportMixin],
  props: {
    allQuestions: {
      type: Array,
      default: () => [],
    },
    allResponses: {
      type: Array,
      default: () => [],
    },
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
    // Note: For now, we can have a fixed response question for these question types: Number, Currency, Text
    isFixedResponseQuestion() {
      return 'fixedResponse' in this.question
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
        this.updatedResponse.value =
          this.question?.type === this.SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE ? convertStringToArray(this.response.value, SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR) : this.response.value
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
      separator: ',',
      decimal: '.',
      precision: 2,
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
      if (this.question?.type === this.SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE) {
        this.updatedResponse.value = convertStringToArray(this.updatedResponse.value, SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR)
      } else if (
        [this.SURVEY_QUESTION_TYPES.NUMBER, this.SURVEY_QUESTION_TYPES.CURRENCY].includes(this.question?.type) &&
        isEmpty(this.updatedResponse.questionResponseId) &&
        this.updatedResponse.value == null
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
