import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { convertStringToArray } from '@/utils/common'
import { toEnrolmentQuestionsWithPercentages } from '../utils/reports'
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

  async getSectionQuestions(section, facilityId) {
    try {
      const { sectionId, title } = section
      if (!sectionId || !facilityId) return []
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-questions?sectionId=${sectionId}&facilityId=${facilityId}`)

      let questions = (response?.data || []).map((question) => {
        if ([SURVEY_QUESTION_TYPES.TWO_OPTION, SURVEY_QUESTION_TYPES.CHOICE, SURVEY_QUESTION_TYPES.MULTIPLE_CHOICE].includes(question?.type)) {
          question.choices = convertStringToArray(question.choices?.slice(1, -1), SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR)
        }
        return question
      })

      if (title === 'Enrolment') {
        questions = questions.reduce(toEnrolmentQuestionsWithPercentages, [])
      }

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

  async getQuestionResponses(surveyResponseId, sectionIds) {
    try {
      if (!surveyResponseId || isEmpty(sectionIds)) return []
      const payload = {
        surveyResponseId: surveyResponseId,
        sectionIds: sectionIds,
      }
      // Use POST to reduce network traffic by batching sectionId requests
      const response = await ApiService.apiAxios.post(`${ApiRoutes.REPORTS}/question-responses/fetch-by-section`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to get survey's questions' responses - ${error}`)
      throw error
    }
  },

  async createQuestionResponses(payload) {
    try {
      if (isEmpty(payload)) return
      const chunkSize = 15
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize)
        await ApiService.apiAxios.post(`${ApiRoutes.REPORTS}/question-responses/bulk`, chunk)
      }
    } catch (error) {
      console.log(`Failed to create question responses - ${error}`)
      throw error
    }
  },

  async updateQuestionResponses(payload) {
    try {
      if (isEmpty(payload)) return
      const chunkSize = 15
      for (let i = 0; i < payload.length; i += chunkSize) {
        const chunk = payload.slice(i, i + chunkSize)
        await ApiService.apiAxios.patch(`${ApiRoutes.REPORTS}/question-responses/bulk`, chunk)
      }
    } catch (error) {
      console.log(`Failed to update question responses - ${error}`)
      throw error
    }
  },

  async deleteQuestionResponses(responseIds) {
    try {
      if (isEmpty(responseIds)) return
      const chunkSize = 50
      for (let i = 0; i < responseIds.length; i += chunkSize) {
        const chunk = responseIds.slice(i, i + chunkSize)
        await ApiService.apiAxios.delete(`${ApiRoutes.REPORTS}/question-responses/bulk`, {
          data: chunk,
        })
      }
    } catch (error) {
      console.log(`Failed to delete question responses - ${error}`)
      throw error
    }
  },
}
