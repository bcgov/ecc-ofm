import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { BLANK_FIELD, SURVEY_QUESTION_TYPES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['reportTemplates', 'getReportQuestionTypeNameById']),
  },

  created() {
    this.SURVEY_QUESTION_TYPES = SURVEY_QUESTION_TYPES
    this.format = format
  },

  methods: {
    isEmpty,

    getReportTitle(surveyResponse) {
      return isEmpty(surveyResponse) ? BLANK_FIELD : `${surveyResponse?.surveyTemplateName} - ${surveyResponse?.monthName} ${surveyResponse?.fiscalYearName?.slice(0, -3)}`
    },

    isHiddenOrDeleted(item) {
      return item?.hide || item?.delete
    },

    isTableQuestion(question) {
      return this.getReportQuestionTypeNameById(question?.type) === SURVEY_QUESTION_TYPES.TABLE
    },

    isTableQuestionHeader(question) {
      return !isEmpty(question?.tableQuestionId)
    },

    isTableQuestionResponse(response) {
      return !isEmpty(response?.tableQuestionId)
    },

    isMultipleChoiceQuestion(questionType) {
      return this.getReportQuestionTypeNameById(questionType) === SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE
    },
  },
}
