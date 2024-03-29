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
        <SurveySection :section="currentSection" :responses="responsesToBeDisplayed" @update="updateClonedResponses" @delete="deleteClonedResponses" @process="process" />
        <AppNavButtons :loading="loading || processing" :showBack="true" :showSave="true" :showNext="true" @back="back" @save="save(true)" @next="next" />
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
      responsesToBeDeleted: [],
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
    responsesToBeDisplayed() {
      return this.clonedResponses?.filter((item) => !item.hide)
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
        console.log('=========================== SAVE ============================')
        console.log(this.clonedResponses)
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

    deleteClonedResponses(response) {
      this.responsesToBeDeleted = this.clonedResponses?.filter((item) => item.rowId === response.rowId && item.tableQuestionId === response.tableQuestionId)
      let foundIndex = this.clonedResponses?.findIndex((item) => item.rowId === response.rowId && item.tableQuestionId === response.tableQuestionId)
      while (foundIndex > -1) {
        this.clonedResponses.splice(foundIndex, 1)
        foundIndex = this.clonedResponses?.findIndex((item) => item.rowId === response.rowId && item.tableQuestionId === response.tableQuestionId)
      }
      this.updateRowId(response)
      // responsesToBeDeleted?.forEach((item) => {
      //   item.hide = true
      //   item.value = null
      // })
      // this.processQuestionsBusinessRules(this.currentSection)
      // reset rowId for all row.....
      this.processQuestionsBusinessRules(this.currentSection)
      console.log('this.responsesToBeDisplayed')
      console.log(this.responsesToBeDisplayed)
    },

    updateRowId(response) {
      const responseToUpdate = this.clonedResponses?.filter((item) => item.rowId > response.rowId && item.tableQuestionId === response.tableQuestionId)
      responseToUpdate?.forEach((item) => (item.rowId -= 1))
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
              this.addInheritedValuesToChildrenQuestions(section, question)
            }
          })
        }
      })
      console.log('BEFORE RESET')
      console.log(section)
      this.resetResponsesForHiddenQuestions()
      console.log('AFTER RESET')
      console.log(this.clonedResponses)
      this.updateResponsesForValueInheritedQuestions(section)
      console.log('AFTER UPDATE')
      console.log(this.clonedResponses)
    },

    toggleConditionalChildrenQuestions(section, parentsQuestion) {
      const parentsResponse = this.clonedResponses?.find((item) => item.questionId === parentsQuestion.questionId)
      parentsQuestion?.businessRules?.forEach((rule) => {
        const falseChild = section?.questions?.find((item) => item.questionId === rule.falseChildQuestionId)
        const trueChild = section?.questions?.find((item) => item.questionId === rule.trueChildQuestionId)
        const isConditionMet =
          rule.conditionValue === parentsResponse?.value ||
          (this.getReportQuestionTypeNameById(parentsResponse?.questionType)?.includes('Multiple Choice') && parentsResponse?.value?.includes(rule.conditionValue))
        const hideChildQuestions = !parentsResponse || isEmpty(parentsResponse?.value) || parentsQuestion?.hide
        if (falseChild) {
          falseChild.hide = hideChildQuestions ? hideChildQuestions : isConditionMet
        }
        if (trueChild) {
          trueChild.hide = hideChildQuestions ? hideChildQuestions : !isConditionMet
        }
      })
    },

    addInheritedValuesToChildrenQuestions(section, parentsQuestion) {
      let parentsResponses = this.clonedResponses?.filter((item) => item.questionId === parentsQuestion.questionId && item.tableQuestionId === parentsQuestion.tableQuestionId)
      parentsResponses = parentsResponses.sort((response1, response2) => {
        return response1.rowId - response2.rowId
      })
      parentsQuestion?.businessRules?.forEach((rule) => {
        const childQuestion = section?.questions?.find((item) => item.questionId === rule.valueInheritedChildQuestionId)
        if (childQuestion) {
          childQuestion.inheritedValues = parentsResponses?.map((response) => response.value)
        }
      })
    },

    resetResponsesForHiddenQuestions() {
      this.clonedResponses?.forEach((response) => {
        const question = this.currentSection?.questions?.find(
          (item) => item.questionId === response.questionId || (this.isTableQuestionResponse(response) && item.questionId === response.tableQuestionId),
        )
        response.hide = question?.hide
        response.value = question?.hide ? null : response.value
      })
    },

    updateResponsesForValueInheritedQuestions(section) {
      section?.questions?.forEach((question) => {
        question.inheritedValues?.forEach((inheritedValue, index) => {
          const tableQuestion = section?.questions?.find((item) => item.questionId === question.tableQuestionId)
          if (!tableQuestion?.hide && !isEmpty(question.inheritedValues)) {
            const response = this.clonedResponses?.find((item) => item.questionId === question.questionId && item.tableQuestionId === question.tableQuestionId && item.rowId === index)
            if (response) {
              response.rowId = index
              response.value = inheritedValue
            } else {
              this.clonedResponses.push({
                questionId: question.questionId,
                tableQuestionId: question.tableQuestionId,
                surveyResponseId: this.$route.params.surveyResponseGuid,
                rowId: index,
                value: inheritedValue,
              })
            }
          }
          const maxIndex = question.inheritedValues?.length
          let foundIndex = this.clonedResponses?.findIndex((item) => item.rowId >= maxIndex && item.tableQuestionId === question.tableQuestionId)
          while (foundIndex > -1) {
            this.clonedResponses.splice(foundIndex, 1)
            foundIndex = this.clonedResponses?.findIndex((item) => item.rowId > maxIndex && item.tableQuestionId === question.tableQuestionId)
          }
        })
      })
    },

    getClonedResponseIndex(response) {
      return this.isTableQuestionResponse(response)
        ? this.clonedResponses.findIndex((item) => item.questionId === response?.questionId && item.tableQuestionId === response?.tableQuestionId && item.rowId === response?.rowId)
        : this.clonedResponses.findIndex((item) => item.questionId === response?.questionId)
    },

    getOriginalResponse(response) {
      return this.isTableQuestionResponse(response)
        ? this.originalResponses.find((item) => item.questionId === response?.questionId && item.tableQuestionId === response?.tableQuestionId && item.rowId === response?.rowId)
        : this.originalResponses.find((item) => item.questionId === response?.questionId)
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
