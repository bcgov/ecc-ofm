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
        <SurveySection
          :section="currentSection"
          :readonly="readonly"
          :responses="responsesToBeDisplayed"
          @update="updateClonedResponses"
          @deleteTableResponses="deleteTableResponses"
          @process="process" />
        <AppNavButtons
          :loading="loading || processing"
          :showBack="true"
          :showCancel="showCancel"
          :showSave="showSave"
          :showNext="showNext"
          :showSubmit="showSubmit"
          @back="back"
          @cancel="toggleCancelDialog"
          @save="save(true)"
          @next="next"
          @submit="submit" />
      </v-col>
    </v-row>
    <AppCancelDialog :show="showCancelDialog" @close="toggleCancelDialog" @cancel="cancelChanges" />
  </v-container>
</template>

<script>
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import AppCancelDialog from '@/components/ui/AppCancelDialog.vue'

import { useAppStore } from '@/stores/app'
import { mapState } from 'pinia'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty, cloneDeep } from 'lodash'
import ReportsService from '@/services/reportsService'
import SurveyNavBar from '@/components/reports/SurveyNavBar.vue'
import SurveySection from '@/components/reports/SurveySection.vue'
import { CRM_STATE_CODES } from '@/utils/constants'

import rules from '@/utils/rules'

export default {
  name: 'SupplementaryAllowanceView',
  components: { AppNavButtons, AppCancelDialog, SurveyNavBar, SurveySection },
  mixins: [alertMixin],
  data() {
    return {
      rules,
      loading: false,
      processing: false,
      showCancelDialog: false,
      surveyResponse: undefined,
      sections: [],
      currentSection: undefined,
      originalResponses: [],
      clonedResponses: [],
      deletedTableResponses: [],
    }
  },

  computed: {
    ...mapState(useAppStore, ['getReportQuestionTypeNameById', 'months']),
    readonly() {
      return this.surveyResponse?.stateCode === CRM_STATE_CODES.INACTIVE
    },
    showBack() {
      return true
    },
    showCancel() {
      return !this.readonly
    },
    showSave() {
      return !this.isLastSection && !this.readonly
    },
    showNext() {
      return !this.isLastSection
    },
    showSubmit() {
      return this.isLastSection && !this.readonly
    },
    isLastSection() {
      return this.currentSectionIndex === this.sections?.length - 1
    },
    currentSectionIndex() {
      return this.sections?.findIndex((section) => section?.sectionId === this.currentSection?.sectionId)
    },
    responsesToBeDisplayed() {
      return this.clonedResponses?.filter((item) => !this.isHiddenOrDeleted(item))
    },
  },

  watch: {
    showSubmit: {
      async handler() {
        try {
          if (this.readonly) return
          this.processing = true
          await this.getQuestionsResponses()
        } catch (error) {
          this.setFailureAlert('Failed to load questions responses', error)
        } finally {
          this.processing = false
        }
      },
    },
  },

  async created() {
    await this.loadData()
    this.currentSection = this.sections[0]
  },

  methods: {
    async loadData() {
      try {
        this.loading = true
        this.surveyResponse = await ReportsService.getSurveyResponse(this.$route.params.surveyResponseGuid)
        await this.getQuestionsResponses()
        this.sections = await ReportsService.getSurveySections(this.surveyResponse?.surveyId)
        await Promise.all(
          this.sections?.map(async (section) => {
            section.questions = await ReportsService.getSectionQuestions(section?.sectionId)
          }),
        )
        this.sections?.forEach((section) => this.processQuestionsBusinessRules(section))
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      } finally {
        this.loading = false
      }
    },

    async back() {
      if (this.currentSectionIndex === 0) return
      await this.save()
      this.currentSection = this.sections[this.currentSectionIndex - 1]
    },

    toggleCancelDialog() {
      this.showCancelDialog = !this.showCancelDialog
    },

    cancelChanges() {
      this.clonedResponses = cloneDeep(this.originalResponses)
      this.processQuestionsBusinessRules(this.currentSection)
      this.toggleCancelDialog()
    },

    async next() {
      await this.save()
      if (this.currentSectionIndex === this.sections?.length - 1) return
      this.currentSection = this.sections[this.currentSectionIndex + 1]
    },

    async save(showAlert) {
      try {
        this.processing = true
        const responsesToDelete = this.clonedResponses?.filter((response) => response.questionResponseId && this.isHiddenOrDeleted(response))
        let callGetQuestionsResponses = responsesToDelete?.length > 0
        await Promise.all(
          responsesToDelete?.map(async (response) => {
            const originalResponse = this.getOriginalQuestionResponse(response)
            await ReportsService.deleteQuestionResponse(originalResponse?.questionResponseId)
            originalResponse.rowId = null
          }),
        )
        await Promise.all(
          this.clonedResponses?.map(async (response) => {
            if (this.isHiddenOrDeleted(response)) return
            const originalResponse = this.getOriginalQuestionResponse(response)
            const updatedResponse = Object.assign({}, response)
            if (this.isMultipleChoiceQuestion(updatedResponse?.questionType)) {
              updatedResponse.value = updatedResponse.value?.toString()
            }
            if (isEmpty(originalResponse) && !isEmpty(updatedResponse?.value)) {
              await ReportsService.createQuestionResponse(updatedResponse)
              callGetQuestionsResponses = true
            } else if (originalResponse?.value !== updatedResponse?.value) {
              await ReportsService.updateQuestionResponse(originalResponse?.questionResponseId, updatedResponse)
              callGetQuestionsResponses = true
            }
          }),
        )
        if (callGetQuestionsResponses) {
          await this.getQuestionsResponses()
        }
        if (showAlert) {
          this.setSuccessAlert('Survey response saved successfully')
        }
      } catch (error) {
        this.setFailureAlert('Failed to save your survey responses', error)
      } finally {
        this.processing = false
      }
    },

    async updateCurrentSection(section) {
      if (this.loading || this.processing) return
      await this.save()
      this.currentSection = section
    },

    async submit() {
      const currentMonth = this.months?.find((month) => month.name === new Date().toLocaleString('en-ca', { month: 'long' }))
      const payload = {
        statusCode: 506580000,
        stateCode: CRM_STATE_CODES.INACTIVE,
        submittedMonthId: currentMonth?.monthId,
      }
      await this.save()
      await ReportsService.updateSurveyResponse(this.$route.params.surveyResponseGuid, payload)
      this.$router.push({ name: 'reporting' })
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
      const index = this.isTableQuestionResponse(updatedResponse)
        ? this.clonedResponses.findIndex(
            (item) =>
              !this.isHiddenOrDeleted(item) && item.questionId === updatedResponse?.questionId && item.tableQuestionId === updatedResponse?.tableQuestionId && item.rowId === updatedResponse?.rowId,
          )
        : this.clonedResponses.findIndex((item) => item.questionId === updatedResponse?.questionId)
      if (index > -1) {
        this.clonedResponses[index] = updatedResponse
      } else {
        this.clonedResponses.push(updatedResponse)
      }
      if (updatedResponse?.hasConditionalChildren || updatedResponse?.hasValueInheritanceChildren) {
        this.processQuestionsBusinessRules(this.currentSection)
      }
    },

    deleteTableResponses(deletedRow) {
      this.clonedResponses?.forEach((response) => {
        if (!response.delete && response.tableQuestionId === deletedRow?.tableQuestionId) {
          if (response.rowId === deletedRow?.rowId) {
            const question = this.currentSection?.questions?.find((item) => item.questionId === response.questionId)
            if (!isEmpty(question?.businessRules)) {
              this.removeDeletedRowFromValueInheritanceChildQuestions(question, deletedRow.rowId)
            }
            response.delete = true
            response.value = null
          }
          // If this row is subsequent to the deleted row, reduce its rowId by 1
          else if (response.rowId > deletedRow?.rowId) {
            response.rowId -= 1
          }
        }
      })
      this.processValueInheritanceBusinessRule(this.currentSection)
    },

    removeDeletedRowFromValueInheritanceChildQuestions(parentsQuestion, deletedRowId) {
      const childQuestions = parentsQuestion?.businessRules?.map((rule) => rule.valueInheritanceChildQuestionId)
      const childTableQuestionIds = childQuestions.map((questionId) => {
        const question = this.currentSection?.questions?.find((item) => item.questionId === questionId)
        return question?.tableQuestionId
      })
      this.clonedResponses?.forEach((response) => {
        if (!response.delete && childTableQuestionIds?.includes(response.tableQuestionId)) {
          if (response.rowId === deletedRowId) {
            response.delete = true
            response.value = null
          }
          // If this row is subsequent to the deleted row, reduce its rowId by 1
          else if (response.rowId > deletedRowId) {
            response.rowId -= 1
          }
        }
      })
    },

    /* -----------------------------------------------------------------------------------------
      BUSINESS RULES:

      There are 2 business rules for questions:

      1. Conditional branching: Some questions will be hidden/displayed based on values of its parents' questions.

      2. Value inheritance: Some questions will inherit values from their parents (e.g.: Initials columns in Human Resources Section).
      If a question is an inherited-value question, that question will be read-only so that their values will be consistent with their parents’ values.
      Note: Value inheritance rule is only for questions/headers of a table question
    ----------------------------------------------------------------------------------------- */
    processQuestionsBusinessRules(section) {
      this.processConditionalBusinessRule(section)
      this.processValueInheritanceBusinessRule(section)
    },

    // Conditional Business Rule
    processConditionalBusinessRule(section) {
      section?.questions?.forEach((question) => {
        question?.businessRules?.forEach((rule) => {
          question.hasConditionalChildren = rule?.trueChildQuestionId || rule?.falseChildQuestionId
          if (!question?.hasConditionalChildren) return
          this.toggleConditionalChildrenQuestions(section, question)
        })
      })
      this.resetResponsesForHiddenQuestions()
    },

    toggleConditionalChildrenQuestions(section, parentsQuestion) {
      const parentsResponse = this.clonedResponses?.find((item) => item.questionId === parentsQuestion.questionId)
      parentsQuestion?.businessRules?.forEach((rule) => {
        const falseChild = section?.questions?.find((item) => item.questionId === rule.falseChildQuestionId)
        const trueChild = section?.questions?.find((item) => item.questionId === rule.trueChildQuestionId)
        const isConditionMet = parentsResponse?.value?.includes(rule.conditionValue)
        const hideChildQuestions = !parentsResponse || isEmpty(parentsResponse?.value) || parentsQuestion?.hide
        if (falseChild) {
          falseChild.hide = hideChildQuestions ? hideChildQuestions : isConditionMet
        }
        if (trueChild) {
          trueChild.hide = hideChildQuestions ? hideChildQuestions : !isConditionMet
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

    // Value Inheritance Business Rule
    processValueInheritanceBusinessRule(section) {
      section?.questions?.forEach((question) => {
        question?.businessRules?.forEach((rule) => {
          question.hasValueInheritanceChildren = rule?.parentHasResponse && rule?.valueInheritanceChildQuestionId
          if (!question?.hasValueInheritanceChildren) return
          this.addInheritedValuesToChildrenQuestions(section, question)
        })
      })
      this.updateResponsesForValueInheritanceQuestions(section)
    },

    addInheritedValuesToChildrenQuestions(section, parentsQuestion) {
      let parentsResponses = this.clonedResponses?.filter(
        (item) => !this.isHiddenOrDeleted(item) && item.questionId === parentsQuestion.questionId && item.tableQuestionId === parentsQuestion.tableQuestionId,
      )
      parentsResponses = parentsResponses.sort((response1, response2) => {
        return response1.rowId - response2.rowId
      })
      parentsQuestion?.businessRules?.forEach((rule) => {
        const childQuestion = section?.questions?.find((item) => item.questionId === rule.valueInheritanceChildQuestionId)
        if (childQuestion) {
          childQuestion.inheritedValues = parentsResponses?.map((response) => response.value)
        }
      })
    },

    updateResponsesForValueInheritanceQuestions(section) {
      section?.questions?.forEach((question) => {
        question.inheritedValues?.forEach((inheritedValue, index) => {
          const tableQuestion = section?.questions?.find((item) => item.questionId === question.tableQuestionId)
          if (tableQuestion?.hide) return
          const response = this.clonedResponses?.find(
            (response) => !response.delete && response.questionId === question.questionId && response.tableQuestionId === question.tableQuestionId && response.rowId === index,
          )
          // Update existing row
          if (response) {
            response.rowId = index
            response.value = inheritedValue
          }
          // Add new row
          else {
            this.clonedResponses.push({
              questionId: question.questionId,
              tableQuestionId: question.tableQuestionId,
              surveyResponseId: this.$route.params.surveyResponseGuid,
              rowId: index,
              value: inheritedValue,
            })
          }
        })
      })
    },

    // TODO (vietle-cgi)
    verifySectionComplete() {},

    isTableQuestion(question) {
      return this.getReportQuestionTypeNameById(question?.type) === 'Table'
    },

    isTableQuestionResponse(response) {
      return !isEmpty(response?.tableQuestionId)
    },

    isHiddenOrDeleted(item) {
      return item?.hide || item?.delete
    },

    getOriginalQuestionResponse(response) {
      return this.isTableQuestionResponse(response)
        ? this.originalResponses.find((item) => item.questionId === response?.questionId && item.tableQuestionId === response?.tableQuestionId && item.rowId === response?.rowId)
        : this.originalResponses.find((item) => item.questionId === response?.questionId)
    },

    isMultipleChoiceQuestion(questionType) {
      return ['Multiple Choice'].includes(this.getReportQuestionTypeNameById(questionType))
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
