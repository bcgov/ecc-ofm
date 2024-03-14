<template>
  <v-container>
    <div class="min-height-screen">
      <h2 class="pb-6">{{ section?.title }}</h2>
      <v-form ref="form">
        <div v-for="question in section?.questions" :key="question.questionId" class="mt-4 mb-8">
          <div v-if="isDisplayed(question)">
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
      this.$emit('update', response)
    },

    isTableQuestion(question) {
      return this.getReportQuestionTypeNameById(question?.type) === 'Table'
    },

    isDisplayed(question) {
      if (question?.questionId === '5f39784c-3fcc-ee11-9079-000d3af4865d') {
        const res = this.responses.find((res) => res.questionId === 'd2045d80-3dcc-ee11-9078-000d3a0a18e7')
        return res?.value?.includes('Yes')
      }
      if (question?.questionId === 'a19f7745-40cc-ee11-9079-000d3a09d4d4') {
        const res1 = this.responses.find((res) => res.questionId === 'd2045d80-3dcc-ee11-9078-000d3a0a18e7')
        const res2 = this.responses.find((res) => res.questionId === '5f39784c-3fcc-ee11-9079-000d3af4865d')
        return res1?.value?.includes('Yes') && res2?.value?.includes('Other please specify')
      }
      if (question?.questionId === 'f27c0ade-0ec6-ee11-9078-000d3af40780') {
        const res = this.responses.find((res) => res.questionId === '3c00c997-0ec6-ee11-9079-000d3af4865d')
        return res?.value?.includes('Yes')
      }
      if (question?.questionId === 'ff5740a4-42cc-ee11-9078-000d3a0a18e7') {
        const res = this.responses.find((res) => res.questionId === '57c337e4-41cc-ee11-9078-000d3a0a18e7')
        return res?.value?.includes('Yes')
      }
      return true
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
