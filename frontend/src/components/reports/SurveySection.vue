<template>
  <v-container>
    <div class="min-height-screen">
      <h2 class="pb-6">{{ section?.title }}</h2>
      <v-form ref="form">
        <div v-for="question in questions" :key="question.questionId" class="mt-4 mb-8">
          <div v-if="isInstructions(question)" v-html="question?.additionalInfo" />
          <div v-else-if="!question.hide">
            <AppLabel>{{ question?.text }}</AppLabel>
            <div v-if="question?.additionalInfo" class="my-2" v-html="question?.additionalInfo" />
            <SurveyTableQuestion
              v-if="isTableQuestion(question)"
              :questions="getTableQuestionHeaders(question)"
              :responses="getTableQuestionResponses(question)"
              :readonly="readonly"
              :required="question.responseRequired"
              :validation="validation"
              :max-rows="question?.tableMaxRows"
              @update="updateResponses"
              @delete="deleteTableResponses" />
            <SurveyQuestion v-else :question="question" :response="getQuestionResponse(question)" :validation="validation" :readonly="readonly" @update="updateResponses" />
          </div>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import reportMixin from '@/mixins/reportMixin'
import SurveyQuestion from '@/components/reports/SurveyQuestion.vue'
import SurveyTableQuestion from '@/components/reports/SurveyTableQuestion.vue'

export default {
  components: { AppLabel, SurveyQuestion, SurveyTableQuestion },
  mixins: [reportMixin],
  props: {
    section: {
      type: Object,
      default: () => {
        return {}
      },
    },
    responses: {
      type: Array,
      default: () => [],
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

  emits: ['update', 'deleteTableResponses'],

  computed: {
    questions() {
      return this.section?.questions?.filter((question) => !this.isTableQuestionHeader(question))
    },
  },

  methods: {
    getQuestionResponse(question) {
      return this.responses?.find((response) => response.questionId === question?.questionId)
    },

    getTableQuestionHeaders(tableQuestion) {
      const headers = this.section?.questions?.filter((question) => question.tableQuestionId === tableQuestion?.questionId)
      headers.forEach((header) => (header.hide = tableQuestion?.hide))
      return headers
    },

    getTableQuestionResponses(tableQuestion) {
      return this.responses?.filter((response) => !this.isHiddenOrDeleted(response) && response.tableQuestionId === tableQuestion?.questionId)
    },

    updateResponses(response) {
      this.$emit('update', response)
    },

    deleteTableResponses(response) {
      this.$emit('deleteTableResponses', response)
    },

    isInstructions(question) {
      return question?.type === this.SURVEY_QUESTION_TYPES.INSTRUCTIONS
    },
  },
}
</script>
<style scoped>
:deep(.v-label) {
  opacity: 1;
}
.min-height-screen {
  min-height: 60vh;
}
</style>
