import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { convertStringToArray } from '@/utils/common'
import { ApiRoutes, SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR, SURVEY_QUESTION_TYPES } from '@/utils/constants'

export default {
  async getSurveySections(surveyTemplateId) {
    try {
      if (!surveyTemplateId) return []
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-sections?surveyTemplateId=${surveyTemplateId}`)
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
      questions?.forEach((question) => {
        if ([SURVEY_QUESTION_TYPES.TWO_OPTION, SURVEY_QUESTION_TYPES.CHOICE, SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE].includes(question?.type)) {
          question.choices = convertStringToArray(question.choices?.slice(1, -1), SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR)
        }
      })
      return questions
    } catch (error) {
      console.log(`Failed to get report's questions - ${error}`)
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

  async getDraftSurveyResponsesCountByFacility(facilityId) {
    try {
      if (!facilityId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-responses-count?facilityId=${facilityId}&isSubmitted=false`)
      return response?.data[0]?.count
    } catch (error) {
      console.log(`Failed to get the draft survey responses count by Facility - ${error}`)
      throw error
    }
  },

  async getSubmittedSurveyResponsesByFacility(facilityId, dateFrom = null, dateTo = null) {
    try {
      if (!facilityId) return
      let url = `${ApiRoutes.REPORTS}/survey-responses?facilityId=${facilityId}&isSubmitted=true`
      if (dateFrom) {
        url += `&dateFrom=${dateFrom}`
      }
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

  async deleteSurveyResponse(surveyResponseId) {
    try {
      if (!surveyResponseId) return
      const response = await ApiService.apiAxios.delete(`${ApiRoutes.REPORTS}/survey-responses/${surveyResponseId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to delete survey response - ${error}`)
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
