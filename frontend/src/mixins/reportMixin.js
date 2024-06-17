import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { ASSISTANCE_REQUEST_STATUS_CODES, BLANK_FIELD, CRM_STATE_CODES, SURVEY_QUESTION_TYPES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),
    ...mapState(useMessagesStore, ['assistanceRequests']),
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

    // if assistance requests is still loading, then return True
    hasInProgressAssistanceRequest(surveyResponse) {
      return (
        this.assistanceRequests == null ||
        this.assistanceRequests?.some(
          (request) =>
            request.stateCode === CRM_STATE_CODES.ACTIVE &&
            request.statusCode !== ASSISTANCE_REQUEST_STATUS_CODES.READY_TO_RESOLVE &&
            request.subject?.includes(surveyResponse?.title) &&
            request.requestFacilities?.some((facility) => facility.facilityId === surveyResponse?.facilityId),
        )
      )
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
