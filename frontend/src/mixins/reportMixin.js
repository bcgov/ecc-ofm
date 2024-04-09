import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'

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
      return this.getReportQuestionTypeNameById(question?.type) === 'Table'
    },

    isTableQuestionHeader(question) {
      return !isEmpty(question?.tableQuestionId)
    },

    isTableQuestionResponse(response) {
      return !isEmpty(response?.tableQuestionId)
    },

    isMultipleChoiceQuestion(questionType) {
      return ['Multiple Choice'].includes(this.getReportQuestionTypeNameById(questionType))
    },
  },
}
