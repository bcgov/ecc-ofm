<template>
  <v-container>
    <div class="min-height-screen">
      <h2 class="pb-6">{{ section?.title }}</h2>
      <v-form ref="form">
        <div v-for="question in questions" :key="question.questionId" class="mt-4 mb-8">
          <div v-if="!question.hide">
            <AppLabel>{{ question?.text }}</AppLabel>
            <SurveyTableQuestion
              v-if="isTableQuestion(question)"
              :questions="getTableQuestionHeaders(question)"
              :responses="getTableQuestionResponses(question)"
              :readonly="readonly"
              :maxRows="question?.tableMaxRows"
              @update="updateResponses"
              @delete="deleteTableResponses" />
            <SurveyQuestion v-else :question="question" :response="getQuestionResponse(question)" :readonly="readonly" @update="updateResponses" />
          </div>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'

import AppLabel from '@/components/ui/AppLabel.vue'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import SurveyQuestion from '@/components/reports/SurveyQuestion.vue'
import SurveyTableQuestion from '@/components/reports/SurveyTableQuestion.vue'

export default {
  components: { AppLabel, SurveyQuestion, SurveyTableQuestion },

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
  },

  emits: ['update', 'deleteTableResponses'],

  computed: {
    ...mapState(useAppStore, ['getReportQuestionTypeNameById']),
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
      return this.responses?.filter((response) => !response.hide && !response.delete && response.tableQuestionId === tableQuestion?.questionId)
    },

    updateResponses(response) {
      this.$emit('update', response)
    },

    deleteTableResponses(response) {
      this.$emit('deleteTableResponses', response)
    },

    isTableQuestion(question) {
      return this.getReportQuestionTypeNameById(question?.type) === 'Table'
    },

    isTableQuestionHeader(question) {
      return !isEmpty(question?.tableQuestionId)
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
