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
    updatedResponses() {
      return this.clonedResponses?.filter((updatedResponse) => {
        let originalResponse
        if (this.isTableQuestionResponse(updatedResponse)) {
          originalResponse = this.originalResponses.find(
            (item) => item.questionId === updatedResponse.questionId && item.tableQuestionId === updatedResponse.tableQuestionId && item.rowId === updatedResponse.rowId,
          )
        } else {
          originalResponse = this.originalResponses.find((item) => item.questionId === updatedResponse.questionId)
        }
        return !originalResponse || updatedResponse?.value != originalResponse.value
      })
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
        console.log(this.updatedResponses)
        await Promise.all(
          this.updatedResponses?.map(async (updatedResponse) => {
            if (['Multiple Choice'].includes(this.getReportQuestionTypeNameById(updatedResponse?.questionType))) {
              updatedResponse.value = updatedResponse.value?.toString()
            }
            let originalResponse
            if ('rowId' in updatedResponse) {
              originalResponse = this.originalResponses.find(
                (originalResponse) =>
                  originalResponse.questionId === updatedResponse.questionId &&
                  originalResponse.tableQuestionId === updatedResponse.tableQuestionId &&
                  originalResponse.rowId === updatedResponse.rowId,
              )
            } else {
              originalResponse = this.originalResponses.find((originalResponse) => originalResponse.questionId === updatedResponse.questionId)
            }

            if (originalResponse) {
              await ReportsService.updateQuestionResponse(originalResponse?.questionResponseId, updatedResponse)
            } else {
              await ReportsService.createQuestionResponse(updatedResponse)
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

    updateResponses(updatedResponse) {
      console.log('SURVEY VIEW')
      console.log(updatedResponse)
      let index
      if (this.isTableQuestionResponse(updatedResponse)) {
        // for table questions
        index = this.clonedResponses.findIndex(
          (response) => response.questionId === updatedResponse.questionId && response.tableQuestionId === updatedResponse.tableQuestionId && response.rowId === updatedResponse.rowId,
        )
      } else {
        index = this.clonedResponses.findIndex((response) => response.questionId === updatedResponse.questionId)
      }
      if (index > -1) {
        this.clonedResponses[index] = updatedResponse
      } else {
        this.clonedResponses.push(updatedResponse)
      }
      console.log(this.clonedResponses)
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
