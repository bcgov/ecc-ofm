<template>
  <v-container fluid class="pa-0 ma-0">
    <AppNumberInput
      v-if="getReportQuestionTypeNameById(question?.type) === 'Number'"
      v-model.lazy="updatedResponse.value"
      :format="NUMBER_FORMAT"
      maxlength="12"
      :rules="rules.required"
      hide-details />

    <AppNumberInput
      v-if="getReportQuestionTypeNameById(question?.type) === 'Currency'"
      v-model.lazy="updatedResponse.value"
      :format="CURRENCY_FORMAT"
      maxlength="12"
      prefix="$"
      :rules="rules.required"
      hide-details />

    <v-text-field
      v-if="getReportQuestionTypeNameById(question?.type) === 'Text'"
      v-model.trim="updatedResponse.value"
      :placeholder="RESPONSE_PLACEHOLDER"
      variant="outlined"
      density="compact"
      :rules="rules.required"
      hide-details />

    <v-textarea
      v-if="getReportQuestionTypeNameById(question?.type) === 'Text Area'"
      v-model.trim="updatedResponse.value"
      :placeholder="RESPONSE_PLACEHOLDER"
      counter
      variant="outlined"
      :rules="rules.required"
      hide-details />

    <v-date-picker v-if="getReportQuestionTypeNameById(question?.type) === 'Date'" v-model="updatedResponse.value" locale="en"></v-date-picker>

    <v-radio-group v-if="getReportQuestionTypeNameById(question?.type) === 'Two Option'" v-model="updatedResponse.value" :rules="rules.required" inline hide-details color="primary">
      <v-radio :label="question?.choices[0]" :value="question?.choices[0]"></v-radio>
      <v-radio :label="question?.choices[1]" :value="question?.choices[1]"></v-radio>
    </v-radio-group>

    <v-select
      v-if="getReportQuestionTypeNameById(question?.type) === 'Choice'"
      v-model="updatedResponse.value"
      :rules="rules.required"
      :placeholder="RESPONSE_PLACEHOLDER"
      :items="question?.choices"
      density="compact"
      variant="outlined"
      hide-details
      return-object />

    <v-select
      v-if="isMultipleChoiceQuestion(question?.type)"
      v-model.lazy="updatedResponse.value"
      :rules="rules.required"
      :placeholder="RESPONSE_PLACEHOLDER"
      variant="outlined"
      chips
      multiple
      :items="question?.choices"
      hide-details>
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
        this.updatedResponse.value = this.response.value
      },
      deep: true,
    },
    updatedResponse: {
      handler() {
        if ((isEmpty(this.response) && isEmpty(this.updatedResponse?.value)) || this.response?.value === this.updatedResponse?.value) return
        const response = Object.assign({}, this.updatedResponse)
        if (this.isMultipleChoiceQuestion(response?.questionType)) {
          response.value = response.value?.toString()
        }
        console.log('QUESTION --------------> SECTION')
        this.$emit('update', response)
      },
      deep: true,
    },
  },

  created() {
    this.updatedResponse = Object.assign({}, this.response)
    this.updatedResponse.questionId = this.question?.questionId
    this.updatedResponse.questionType = this.question?.type
    this.updatedResponse.hasConditionalChildren = this.question?.hasConditionalChildren
    this.updatedResponse.hasValueInheritedChildren = this.question?.hasValueInheritedChildren
    this.updatedResponse.surveyResponseId = this.$route.params.surveyResponseGuid
    if (!isEmpty(this.response)) {
      if (this.isMultipleChoiceQuestion(this.question?.type)) {
        this.updatedResponse.value = this.updatedResponse.value?.split(',')
      }
    }
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
