import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { useAppStore } from '@/stores/app'
import { convertStringToArray } from '@/utils/common'
import { ApiRoutes, SURVEY_QUESTION_TYPES } from '@/utils/constants'

function convertQuestionsChoices(questions) {
  const appStore = useAppStore()
  questions?.forEach((question) => {
    if ([SURVEY_QUESTION_TYPES.TWO_OPTION, SURVEY_QUESTION_TYPES.CHOICE, SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE].includes(appStore?.getReportQuestionTypeNameById(question?.type))) {
      question.choices = convertStringToArray(question.choices?.replace(/[\\"]/g, ''))
    }
  })
}

export default {
  async getSurveySections(surveyId) {
    try {
      if (!surveyId) return []
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-sections?surveyId=${surveyId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get report's questions - ${error}`)
      throw error
    }
  },

  async getSectionQuestions(sectionId, facilityId) {
    try {
      if (!sectionId || !facilityId) return []
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-questions?sectionId=${sectionId}&facilityId=${facilityId}`)
      const questions = response?.data
      convertQuestionsChoices(questions)
      return questions
    } catch (error) {
      console.log(`Failed to get report's questions - ${error}`)
      throw error
    }
  },

  async getDraftSurveyResponsesByFacility(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-responses?facilityId=${facilityId}&isSubmitted=false`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the draft survey response by Facility - ${error}`)
      throw error
    }
  },

  async getSubmittedSurveyResponsesByFacilityAndSubmittedDate(facilityId, dateFrom, dateTo) {
    try {
      if (!facilityId) return
      let url = `${ApiRoutes.REPORTS}/survey-responses?facilityId=${facilityId}&isSubmitted=true&dateFrom=${dateFrom}`
      if (dateTo) {
        url += `&dateTo=${dateTo}`
      }
      const response = await ApiService.apiAxios.get(url)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the submitted survey response by Facility - ${error}`)
      throw error
    }
  },

  async getSurveyResponsesBySurveyAndFacilityAndFiscalYear(surveyId, facilityId, fiscalYearId) {
    try {
      if (!facilityId || !fiscalYearId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-responses?surveyId=${surveyId}&facilityId=${facilityId}&fiscalYearId=${fiscalYearId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the survey response by Facility and Fiscal Year - ${error}`)
      throw error
    }
  },

  async getSurveyResponse(surveyResponseId) {
    try {
      if (!surveyResponseId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-responses/${surveyResponseId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get the survey response by surveyResponseId - ${error}`)
      throw error
    }
  },

  async updateSurveyResponse(surveyResponseId, payload) {
    try {
      if (!surveyResponseId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.REPORTS}/survey-responses/${surveyResponseId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update survey response - ${error}`)
      throw error
    }
  },

  async getQuestionResponses(surveyResponseId) {
    try {
      if (!surveyResponseId) return []
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/question-responses?surveyResponseId=${surveyResponseId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get survey's questions' responses - ${error}`)
      throw error
    }
  },

  async createQuestionResponse(payload) {
    try {
      if (isEmpty(payload)) return
      const response = await ApiService.apiAxios.post(`${ApiRoutes.REPORTS}/question-responses`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create question response - ${error}`)
      throw error
    }
  },

  async updateQuestionResponse(questionResponseId, payload) {
    try {
      if (!questionResponseId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.REPORTS}/question-responses/${questionResponseId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update question response - ${error}`)
      throw error
    }
  },

  async deleteQuestionResponse(questionResponseId) {
    try {
      if (!questionResponseId) return
      const response = await ApiService.apiAxios.delete(`${ApiRoutes.REPORTS}/question-responses/${questionResponseId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to delete question response - ${error}`)
      throw error
    }
  },
}
