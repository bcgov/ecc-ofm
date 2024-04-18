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
          :validation="validation"
          :responses="responsesToBeDisplayed"
          @update="updateClonedResponses"
          @deleteTableResponses="deleteTableResponses"
          @process="process" />
        <v-alert v-if="showIncompleteSurveyErrorAlert" type="error" title="You cannot submit the report until it is complete.">
          <AppButton class="mt-2" :primary="false" size="large" @click="goToIncompleteSection">Update Incomplete Section</AppButton>
        </v-alert>
        <AppNavButtons
          :loading="loading || processing"
          :showBack="true"
          :showCancel="showCancel"
          :showSave="showSave"
          :showNext="showNext"
          :showSubmit="showSubmit"
          :disableSubmit="!isSurveyComplete"
          @back="back"
          @cancel="toggleCancelDialog"
          @save="save(true)"
          @next="next"
          @submit="submit" />
      </v-col>
    </v-row>
    <SurveySubmitConfirmationDialog :show="showSubmitConfirmationDialog" />
    <AppCancelDialog :show="showCancelDialog" @close="toggleCancelDialog" @cancel="cancelChanges" />
  </v-container>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash'
import { CRM_STATE_CODES, SURVEY_RESPONSE_TYPES, SURVEY_RESPONSE_STATUS_CODES } from '@/utils/constants'
import rules from '@/utils/rules'

import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import alertMixin from '@/mixins/alertMixin'
import reportMixin from '@/mixins/reportMixin'

import ReportsService from '@/services/reportsService'

import AppButton from '@/components/ui/AppButton.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import AppCancelDialog from '@/components/ui/AppCancelDialog.vue'
import SurveyNavBar from '@/components/reports/SurveyNavBar.vue'
import SurveySection from '@/components/reports/SurveySection.vue'
import SurveySubmitConfirmationDialog from '@/components/reports/SurveySubmitConfirmationDialog.vue'

export default {
  name: 'SurveyView',
  components: { AppButton, AppNavButtons, AppCancelDialog, SurveyNavBar, SurveySection, SurveySubmitConfirmationDialog },
  mixins: [alertMixin, reportMixin],
  data() {
    return {
      rules,
      loading: false,
      validation: undefined,
      processing: false,
      showSubmitConfirmationDialog: false,
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
    ...mapState(useAppStore, ['months']),
    readonly() {
      return this.surveyResponse?.stateCode === CRM_STATE_CODES.INACTIVE
    },
    showCancel() {
      return !this.readonly
    },
    showSave() {
      return !this.isLastSection(this.currentSection) && !this.readonly
    },
    showNext() {
      return !this.isLastSection(this.currentSection)
    },
    showSubmit() {
      return this.isLastSection(this.currentSection) && !this.readonly
    },
    currentSectionIndex() {
      return this.sections?.findIndex((section) => section?.sectionId === this.currentSection?.sectionId)
    },
    responsesToBeDisplayed() {
      return this.clonedResponses?.filter((item) => !this.isHiddenOrDeleted(item))
    },
    isSurveyComplete() {
      return this.sections?.every((section) => section.isComplete)
    },
    showIncompleteSurveyErrorAlert() {
      const index = this.sections?.findIndex((section) => !this.isLastSection(section) && !section.isComplete)
      return !this.readonly && this.isLastSection(this.currentSection) && index > -1
    },
  },

  watch: {
    showSubmit: {
      async handler() {
        try {
          if (this.readonly || !this.showSubmit) return
          this.validation = this.validation ?? this.showSubmit
          this.processing = true
          await this.getQuestionsResponses()
          this.verifySurveyComplete()
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
            section.questions = await ReportsService.getSectionQuestions(section?.sectionId, this.surveyResponse?.facilityId)
          }),
        )

        this.filterSectionQuestionsUsingSurveyResponseType()
        this.sections?.forEach((section) => this.processQuestionsBusinessRules(section))
        this.verifySurveyComplete()
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      } finally {
        this.loading = false
      }
    },

    async back() {
      if (this.isFirstSection(this.currentSection)) return
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
      this.verifySectionComplete(this.currentSection)
    },

    async next() {
      if (this.isLastSection(this.currentSection)) return
      await this.save()
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
            response.value = Array.isArray(response.value) ? response.value?.toString() : response.value
            if (isEmpty(originalResponse) && !isEmpty(response?.value)) {
              await ReportsService.createQuestionResponse(response)
              callGetQuestionsResponses = true
            } else if (originalResponse?.value !== response?.value || originalResponse?.rowId !== response?.rowId) {
              await ReportsService.updateQuestionResponse(originalResponse?.questionResponseId, response)
              callGetQuestionsResponses = true
            }
          }),
        )
        if (callGetQuestionsResponses) {
          await this.getQuestionsResponses()
        }
        this.verifySectionComplete(this.currentSection)
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
      try {
        const currentMonth = this.months?.find((month) => month.name === new Date().toLocaleString('en-ca', { month: 'long' }))
        const payload = {
          statusCode: SURVEY_RESPONSE_STATUS_CODES.SUBMITTED,
          stateCode: CRM_STATE_CODES.INACTIVE,
          submittedMonthId: currentMonth?.monthId,
        }
        await this.save()
        this.processing = true
        await ReportsService.updateSurveyResponse(this.$route.params.surveyResponseGuid, payload)
        this.toggleSubmitConfirmationDialog()
      } catch (error) {
        this.setFailureAlert('Failed to submit your survey responses', error)
      } finally {
        this.processing = false
      }
    },

    filterSectionQuestionsUsingSurveyResponseType() {
      let surveyResponseTypeToBeIncluded = [SURVEY_RESPONSE_TYPES.MONTHLY]
      switch (this.surveyResponse?.surveyResponseType) {
        case SURVEY_RESPONSE_TYPES.QUARTERLY:
          surveyResponseTypeToBeIncluded.push(SURVEY_RESPONSE_TYPES.QUARTERLY)
          break
        case SURVEY_RESPONSE_TYPES.BI_ANNUAL:
          surveyResponseTypeToBeIncluded.push(SURVEY_RESPONSE_TYPES.BI_ANNUAL)
          break
        case SURVEY_RESPONSE_TYPES.ANNUAL:
          surveyResponseTypeToBeIncluded.push(SURVEY_RESPONSE_TYPES.ANNUAL)
      }
      this.sections?.forEach((section) => {
        section.questions = section.questions?.filter((question) => surveyResponseTypeToBeIncluded.includes(question.surveyResponseType))
      })
      this.sections = this.sections?.filter((section) => !isEmpty(section.questions))
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
        this.clonedResponses[index].value = updatedResponse?.value
      } else {
        this.clonedResponses.push(updatedResponse)
      }
      if (updatedResponse?.hasConditionalChildren || updatedResponse?.hasValueInheritanceChildren) {
        this.processQuestionsBusinessRules(this.currentSection)
      }
      this.verifySectionComplete(this.currentSection)
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
          this.addInheritanceValuesToChildrenQuestions(section, question)
        })
      })
      this.updateResponsesForValueInheritanceQuestions(section)
    },

    addInheritanceValuesToChildrenQuestions(section, parentsQuestion) {
      let parentsResponses = this.clonedResponses?.filter(
        (item) => !this.isHiddenOrDeleted(item) && item.questionId === parentsQuestion.questionId && item.tableQuestionId === parentsQuestion.tableQuestionId,
      )
      parentsResponses = parentsResponses.sort((response1, response2) => {
        return response1.rowId - response2.rowId
      })
      parentsQuestion?.businessRules?.forEach((rule) => {
        const childQuestion = section?.questions?.find((item) => item.questionId === rule.valueInheritanceChildQuestionId)
        if (childQuestion) {
          childQuestion.inheritanceValues = parentsResponses?.map((response) => response.value)
        }
      })
    },

    updateResponsesForValueInheritanceQuestions(section) {
      section?.questions?.forEach((question) => {
        question.inheritanceValues?.forEach((inheritedValue, index) => {
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

    verifySurveyComplete() {
      this.sections?.forEach((section) => this.verifySectionComplete(section))
    },

    verifySectionComplete(section) {
      const responseRequiredQuestions = section?.questions?.filter((question) => question.responseRequired)
      const isComplete = responseRequiredQuestions?.every((question) => {
        const index = this.clonedResponses.findIndex(
          (response) =>
            !this.isHiddenOrDeleted(response) &&
            ((this.isLastSection(section) && response.value === 'Yes') || (!this.isLastSection(section) && !isEmpty(response.value))) &&
            (response.questionId === question.questionId || (this.isTableQuestion(question) && response.tableQuestionId === question.questionId)),
        )
        return question.hide || index > -1
      })
      section.isComplete = isComplete
      return isComplete
    },

    getOriginalQuestionResponse(response) {
      return this.originalResponses.find((item) => item.questionResponseId === response?.questionResponseId)
    },

    process(value) {
      this.processing = value
    },

    toggleSubmitConfirmationDialog() {
      this.showSubmitConfirmationDialog = true
    },

    goToIncompleteSection() {
      const incompleteSection = this.sections?.find((section) => !section.isComplete)
      if (!incompleteSection) return
      this.currentSection = incompleteSection
    },

    isLastSection(section) {
      const index = this.sections?.findIndex((item) => item?.sectionId === section?.sectionId)
      return index === this.sections?.length - 1
    },

    isFirstSection(section) {
      const index = this.sections?.findIndex((item) => item?.sectionId === section?.sectionId)
      return index === 0
    },
  },
}
</script>
<style scoped>
.min-height-screen {
  min-height: 55vh;
}
</style>