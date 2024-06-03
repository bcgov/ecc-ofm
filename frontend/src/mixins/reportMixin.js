import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { BLANK_FIELD, SURVEY_QUESTION_TYPES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, [
      'activeReportTemplates',
      'getMonthIdByName',
      'getMonthNameById',
      'getFiscalYearIdByDate',
      'getFiscalYearIdsByDates',
      'getFiscalYearNameById',
      'getReportTemplateIdByName',
      'getReportTemplateNameById',
      'getReportQuestionTypeNameById',
    ]),
  },

  created() {
    this.SURVEY_QUESTION_TYPES = SURVEY_QUESTION_TYPES
    this.format = format
  },

  methods: {
    isEmpty,

    getReportTitle(surveyResponse) {
      if (isEmpty(surveyResponse)) return BLANK_FIELD
      const reportName = this.getReportTemplateNameById(surveyResponse.surveyId)
      const month = this.getMonthNameById(surveyResponse.reportingMonthId)
      const fiscalYear = this.getFiscalYearNameById(surveyResponse.fiscalYearId)?.slice(0, -3)
      return `${reportName} - ${month} ${fiscalYear}`
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
