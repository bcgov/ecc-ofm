import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { SURVEY_QUESTION_TYPES } from '@/utils/constants'

export default {
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getMonthIdByName', 'getFiscalYearIdByDate', 'getFiscalYearIdsByDates', 'getFiscalYearNameById', 'getReportTemplateIdByName', 'getReportQuestionTypeNameById']),
  },

  created() {
    this.SURVEY_QUESTION_TYPES = SURVEY_QUESTION_TYPES
  },

  methods: {
    isEmpty,

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
