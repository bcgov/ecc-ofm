<template>
  <v-container fluid>
    <v-row v-if="loading" justify="center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen"></v-progress-circular>
    </v-row>
    <v-row v-else no-gutters>
      <v-col cols="12" md="3" lg="2">
        <SurveyNavBar :sections="sections" :currentSection="currentSection" @update="updateCurrentSection" />
      </v-col>
      <v-col cols="12" md="9" lg="10">
        <SurveySection :section="currentSection" :responses="clonedResponses" @update="updateResponses" @process="process" />
        <AppNavButtons :loading="loading || processing" :showBack="true" :showSave="true" :showNext="true" @back="back" @save="save(true)" @next="next"></AppNavButtons>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty, cloneDeep } from 'lodash'
import ReportsService from '@/services/reportsService'
import SurveyNavBar from '@/components/reports/SurveyNavBar.vue'
import SurveySection from '@/components/reports/SurveySection.vue'

import rules from '@/utils/rules'

export default {
  name: 'SupplementaryAllowanceView',
  components: { AppNavButtons, SurveyNavBar, SurveySection },
  mixins: [alertMixin],
  data() {
    return {
      rules,
      loading: false,
      processing: false,
      sections: [],
      currentSection: undefined,
      originalResponses: [],
      clonedResponses: [],
    }
  },

  computed: {
    ...mapState(useAppStore, ['getReportQuestionTypeNameById']),
    currentSectionIndex() {
      return this.sections?.findIndex((section) => section?.sectionId === this.currentSection?.sectionId)
    },
    showBack() {
      return true
    },
    showCancel() {
      return true
    },
    showSave() {
      return true
    },
    showNext() {
      return true
    },
    showSubmit() {
      return false
    },
  },

  async created() {
    await this.loadData()
    this.currentSection = this.sections[0]
  },

  methods: {
    isEmpty,
    async loadData() {
      try {
        this.loading = true
        const surveyResponse = await ReportsService.getSurveyResponse(this.$route.params.surveyResponseGuid)
        await this.getQuestionsResponses()
        this.sections = await ReportsService.getSurveySections(surveyResponse?.surveyId)
        await Promise.all(
          this.sections?.map(async (section) => {
            section.questions = await this.getSectionQuestions(section?.sectionId)
          }),
        )
        console.log(this.sections)
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      } finally {
        this.loading = false
      }
    },

    async getQuestionsResponses() {
      try {
        this.originalResponses = await ReportsService.getQuestionResponses(this.$route.params.surveyResponseGuid)
        this.clonedResponses = cloneDeep(this.originalResponses)
      } catch (error) {
        this.setFailureAlert('Failed to get questions responses', error)
      }
    },

    async getSectionQuestions(sectionId) {
      try {
        const questions = await ReportsService.getSurveyQuestions(sectionId)
        this.getQuestionsChoices(questions)
        await Promise.all(
          questions.map(async (question) => {
            if (this.getReportQuestionTypeNameById(question?.type) === 'Table') {
              question.headers = await ReportsService.getSurveyQuestionHeaders(question?.questionId)
              this.getQuestionsChoices(question.headers)
            }
          }),
        )
        return questions
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      }
    },

    getQuestionsChoices(questions) {
      questions?.forEach((question) => {
        if (['Two Option', 'Choice', 'Multiple Choice'].includes(this.getReportQuestionTypeNameById(question?.type))) {
          question.choices = question.choices?.replace(/[\\"]/g, '')?.split(',')
        }
      })
    },

    back() {
      if (this.currentSectionIndex === 0) return
      this.currentSection = this.sections[this.currentSectionIndex - 1]
    },

    next() {
      if (this.currentSectionIndex === this.sections?.length - 1) return
      this.currentSection = this.sections[this.currentSectionIndex + 1]
    },

    async save(showAlert) {
      try {
        this.processing = true
        console.log('===================== SAVE ======================')
        await Promise.all(
          this.clonedResponses?.map(async (response) => {
            const originalResponse = this.getOriginalResponse(response)
            if (!originalResponse && response?.value) {
              console.log('CREATE')
              console.log(response)
              await ReportsService.createQuestionResponse(response)
            } else if (originalResponse?.value != response?.value) {
              await ReportsService.updateQuestionResponse(originalResponse?.questionResponseId, response)
              console.log('UPDATE')
              console.log(response)
            }
          }),
        )
        await this.getQuestionsResponses()
        if (showAlert) {
          this.setSuccessAlert('Survey response saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your survey responses', error)
      } finally {
        this.processing = false
      }
    },

    getOriginalResponse(response) {
      if (this.isTableQuestionResponse(response)) {
        return this.originalResponses.find(
          (originalResponse) => originalResponse.questionId === response?.questionId && originalResponse.tableQuestionId === response?.tableQuestionId && originalResponse.rowId === response?.rowId,
        )
      }
      return this.originalResponses.find((originalResponse) => originalResponse.questionId === response?.questionId)
    },

    updateResponses(updatedResponse) {
      console.log('SURVEY VIEW')
      console.log(updatedResponse)
      const index = this.getClonedResponseIndex(updatedResponse)
      if (index > -1) {
        this.clonedResponses[index] = updatedResponse
      } else {
        this.clonedResponses.push(updatedResponse)
      }
      // console.log(this.clonedResponses)
    },

    getClonedResponseIndex(response) {
      if (this.isTableQuestionResponse(response)) {
        return this.clonedResponses.findIndex(
          (clonedResponse) => clonedResponse.questionId === response?.questionId && clonedResponse.tableQuestionId === response?.tableQuestionId && clonedResponse.rowId === response?.rowId,
        )
      }
      return this.clonedResponses.findIndex((clonedResponse) => clonedResponse.questionId === response?.questionId)
    },

    isTableQuestionResponse(response) {
      return 'tableQuestionId' in response
    },

    updateCurrentSection(section) {
      this.currentSection = section
    },

    process(value) {
      this.processing = value
    },
  },
}
</script>
<style scoped>
.min-height-screen {
  min-height: 55vh;
}
</style>
