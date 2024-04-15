import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { SURVEY_QUESTION_TYPES } from '@/utils/constants'

export default {
  computed: {
    ...mapState(useAppStore, ['getReportQuestionTypeNameById']),
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
