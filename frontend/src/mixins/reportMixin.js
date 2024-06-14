import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { BLANK_FIELD, CRM_STATE_CODES, SURVEY_QUESTION_TYPES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },

  created() {
    this.SURVEY_QUESTION_TYPES = SURVEY_QUESTION_TYPES
    this.format = format
  },

  methods: {
    isEmpty,

    isActiveReportResponse(surveyResponse) {
      return surveyResponse?.stateCode === CRM_STATE_CODES.ACTIVE
    },

    getReportTitle(surveyResponse) {
      return isEmpty(surveyResponse) ? BLANK_FIELD : `${surveyResponse?.surveyTemplateName} - ${surveyResponse?.monthName} ${surveyResponse?.fiscalYearName?.slice(0, -3)}`
    },

    isHiddenOrDeleted(item) {
      return item?.hide || item?.delete
    },

    isTableQuestion(question) {
      return question?.type === SURVEY_QUESTION_TYPES.TABLE
    },

    isTableQuestionHeader(question) {
      return !isEmpty(question?.tableQuestionId)
    },

    isTableQuestionResponse(response) {
      return !isEmpty(response?.tableQuestionId)
    },
  },
}
