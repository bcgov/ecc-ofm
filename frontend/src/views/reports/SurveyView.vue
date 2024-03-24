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
        <SurveySection :section="currentSection" :responses="clonedResponses" @update="updateClonedResponses" @process="process" />
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
        console.log('====================== SURVEY VIEW - LOAD DATA ======================')
        const surveyResponse = await ReportsService.getSurveyResponse(this.$route.params.surveyResponseGuid)
        await this.getQuestionsResponses()
        this.sections = await ReportsService.getSurveySections(surveyResponse?.surveyId)
        await Promise.all(
          this.sections?.map(async (section) => {
            section.questions = await ReportsService.getSectionQuestions(section?.sectionId)
          }),
        )
        this.sections?.forEach((section) => this.processQuestionsBusinessRules(section))

        console.log(this.sections)
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      } finally {
        this.loading = false
      }
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
        await Promise.all(
          this.clonedResponses?.map(async (response) => {
            const originalResponse = this.getOriginalResponse(response)
            if (response?.hide) {
              await ReportsService.deleteQuestionResponse(originalResponse?.questionResponseId)
            } else if (!originalResponse && !isEmpty(response?.value)) {
              await ReportsService.createQuestionResponse(response)
            } else if (originalResponse?.value !== response?.value) {
              await ReportsService.updateQuestionResponse(originalResponse?.questionResponseId, response)
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

    async getQuestionsResponses() {
      try {
        this.originalResponses = await ReportsService.getQuestionResponses(this.$route.params.surveyResponseGuid)
        this.clonedResponses = cloneDeep(this.originalResponses)
      } catch (error) {
        this.setFailureAlert('Failed to get questions responses', error)
      }
    },

    updateClonedResponses(updatedResponse) {
      const index = this.getClonedResponseIndex(updatedResponse)
      if (index > -1) {
        this.clonedResponses[index] = updatedResponse
      } else {
        this.clonedResponses.push(updatedResponse)
      }
      if (updatedResponse?.hasConditionalChildren || updatedResponse?.hasValueInheritedChildren) {
        this.processQuestionsBusinessRules(this.currentSection)
      }
    },

    // loop through each questions and display/hide child question based on parent response's value. if a question is hidden, remove response value of that question.
    processQuestionsBusinessRules(section) {
      section?.questions?.forEach((question) => {
        if (!isEmpty(question?.businessRules)) {
          question?.businessRules?.forEach((rule) => {
            question.hasConditionalChildren = rule?.trueChildQuestionId || rule?.falseChildQuestionId
            question.hasValueInheritedChildren = rule?.parentHasResponse && rule?.valueInheritedChildQuestionId
            if (question?.hasConditionalChildren) {
              this.toggleConditionalChildrenQuestions(section, question)
            }
            if (question?.hasValueInheritedChildren) {
              this.addInheritedValueToChildrenQuestions(section, question)
            }
          })
        }
      })
      this.resetResponsesForHiddenQuestions()
      this.updateResponsesForValueInheritedQuestions(section)
    },

    toggleConditionalChildrenQuestions(section, parentsQuestion) {
      const parentsResponse = this.clonedResponses?.find((item) => item.questionId === parentsQuestion.questionId)
      parentsQuestion?.businessRules?.forEach((rule) => {
        const falseChildIndex = section?.questions?.findIndex((item) => item.questionId === rule.falseChildQuestionId)
        const trueChildIndex = section?.questions?.findIndex((item) => item.questionId === rule.trueChildQuestionId)
        const isConditionMet =
          rule.conditionValue === parentsResponse?.value ||
          (this.getReportQuestionTypeNameById(parentsResponse?.questionType)?.includes('Multiple Choice') && parentsResponse?.value?.includes(rule.conditionValue))
        const hideChildQuestions = !parentsResponse || isEmpty(parentsResponse?.value) || parentsQuestion?.hide
        if (falseChildIndex > -1) {
          section.questions[falseChildIndex].hide = hideChildQuestions ? hideChildQuestions : isConditionMet
        }
        if (trueChildIndex > -1) {
          section.questions[trueChildIndex].hide = hideChildQuestions ? hideChildQuestions : !isConditionMet
        }
      })
    },

    addInheritedValueToChildrenQuestions(section, parentsQuestion) {
      let parentsResponses = this.clonedResponses?.filter((item) => item.questionId === parentsQuestion.questionId && item.tableQuestionId === parentsQuestion.tableQuestionId)
      parentsResponses = parentsResponses.sort((response1, response2) => {
        return response1.rowId - response2.rowId
      })
      parentsQuestion?.businessRules?.forEach((rule) => {
        const childQuestionIndex = section?.questions?.findIndex((item) => item.questionId === rule.valueInheritedChildQuestionId)
        if (childQuestionIndex > -1) {
          section.questions[childQuestionIndex].inheritedValue = parentsResponses?.map((response) => response.value)
        }
      })
      console.log(section)
    },

    resetResponsesForHiddenQuestions() {
      this.clonedResponses?.forEach((response, index) => {
        const question = this.currentSection?.questions?.find(
          (item) => item.questionId === response.questionId || (this.isTableQuestionResponse(response) && item.questionId === response.tableQuestionId),
        )
        if (question?.hide) {
          this.clonedResponses[index].hide = true
          this.clonedResponses[index].value = null
        }
      })
    },

    updateResponsesForValueInheritedQuestions(section) {
      section?.questions?.forEach((question) => {
        // const tableQuestion = section?.questions?.find((item) => item.questionId === question.tableQuestionId)
        // if (!tableQuestion.hide) {
        question.inheritedValue?.forEach((inheritedValue, index) => {
          const foundIndex = this.clonedResponses?.findIndex(
            (response) => response.questionId === question.questionId && response.tableQuestionId === question.tableQuestionId && response.rowId === index,
          )
          if (foundIndex > -1) {
            this.clonedResponses[foundIndex].value = inheritedValue
          } else {
            this.clonedResponses.push({
              questionId: question.questionId,
              tableQuestionId: question.tableQuestionId,
              surveyResponseId: this.$route.params.surveyResponseGuid,
              rowId: index,
              value: inheritedValue,
            })
          }
        })
        // }
      })
      console.log(this.clonedResponses)
      //
      // TODO: check if value/rowId/questionId exist in clonedResponse:
      //        - if yes, update value
      //        - if no, add value
    },

    getClonedResponseIndex(response) {
      if (this.isTableQuestionResponse(response)) {
        return this.clonedResponses.findIndex(
          (clonedResponse) => clonedResponse.questionId === response?.questionId && clonedResponse.tableQuestionId === response?.tableQuestionId && clonedResponse.rowId === response?.rowId,
        )
      }
      return this.clonedResponses.findIndex((clonedResponse) => clonedResponse.questionId === response?.questionId)
    },

    getOriginalResponse(response) {
      if (this.isTableQuestionResponse(response)) {
        return this.originalResponses.find(
          (originalResponse) => originalResponse.questionId === response?.questionId && originalResponse.tableQuestionId === response?.tableQuestionId && originalResponse.rowId === response?.rowId,
        )
      }
      return this.originalResponses.find((originalResponse) => originalResponse.questionId === response?.questionId)
    },

    isTableQuestion(question) {
      return this.getReportQuestionTypeNameById(question?.type) === 'Table'
    },

    isTableQuestionResponse(response) {
      return !isEmpty(response?.tableQuestionId)
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
