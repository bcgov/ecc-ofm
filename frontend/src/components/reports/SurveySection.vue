<template>
  <v-container>
    <div class="min-height-screen">
      <h2 class="pb-6">{{ section?.title }}</h2>
      <v-form ref="form">
        <div v-for="question in section?.questions" :key="question.questionId" class="mt-4 mb-8">
          <div v-if="!question.hide">
            <AppLabel>{{ question?.text }}</AppLabel>
            <SurveyTableQuestion v-if="isTableQuestion(question)" :question="question" :response="getTableQuestionResponse(question)" @update="updateResponses" />
            <SurveyQuestion v-else :question="question" :response="getQuestionResponse(question)" @update="updateResponses" />
          </div>
        </div>
      </v-form>
    </div>
  </v-container>
</template>

<script>
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
  },

  emits: ['update'],

  computed: {
    ...mapState(useAppStore, ['getReportQuestionTypeNameById']),
  },

  methods: {
    getQuestionResponse(question) {
      return this.responses?.find((response) => response.questionId === question?.questionId)
    },

    getTableQuestionResponse(question) {
      // console.log('getTableQuestionResponse')
      // console.log(this.responses?.filter((response) => response.tableQuestionId === question?.questionId))
      return this.responses?.filter((response) => response.tableQuestionId === question?.questionId)
    },

    updateResponses(response) {
      console.log('SECTION --------------> VIEW')
      this.$emit('update', response)
    },

    isTableQuestion(question) {
      return this.getReportQuestionTypeNameById(question?.type) === 'Table'
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
