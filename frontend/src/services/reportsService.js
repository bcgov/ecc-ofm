import { isEmpty } from 'lodash'

import ApiService from '@/common/apiService'
import { useAppStore } from '@/stores/app'
import { ApiRoutes } from '@/utils/constants'

function getQuestionsChoices(questions) {
  const appStore = useAppStore()
  questions?.forEach((question) => {
    if (['Two Option', 'Choice', 'Multiple Choice'].includes(appStore?.getReportQuestionTypeNameById(question?.type))) {
      question.choices = question.choices?.replace(/[\\"]/g, '')?.split(',')
    }
  })
}

export default {
  async getFacilityReports(facilityId) {
    try {
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}?facilityId=${facilityId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get facilities reporting activity for facility - ${error}`)
      throw error
    }
  },

  async getSurveySections(surveyId) {
    try {
      if (!surveyId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-sections?surveyId=${surveyId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get report's questions - ${error}`)
      throw error
    }
  },

  async getSectionQuestions(sectionId) {
    try {
      if (!sectionId) return
      const appStore = useAppStore()
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-questions?sectionId=${sectionId}`)
      const questions = response?.data
      getQuestionsChoices(questions)
      await Promise.all(
        questions.map(async (question) => {
          if (appStore.getReportQuestionTypeNameById(question?.type) === 'Table') {
            question.headers = await this.getSurveyQuestionHeaders(question?.questionId)
            getQuestionsChoices(question.headers)
          }
        }),
      )
      return questions
    } catch (error) {
      console.log(`Failed to get report's questions - ${error}`)
      throw error
    }
  },

  async getSurveyQuestionHeaders(questionId) {
    try {
      if (!questionId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/survey-questions?questionId=${questionId}`)
      return response?.data
    } catch (error) {
      console.log(`Failed to get question' headers - ${error}`)
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

  async createSurveyResponse(payload) {
    try {
      if (isEmpty(payload)) return
      const response = await ApiService.apiAxios.post(ApiRoutes.REPORTS + '/survey-responses', payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create survey response - ${error}`)
      throw error
    }
  },

  async getQuestionResponses(surveyResponseId) {
    try {
      if (!surveyResponseId) return
      const response = await ApiService.apiAxios.get(`${ApiRoutes.REPORTS}/question-responses?surveyResponseId=${surveyResponseId}`)
      console.log('=============== getQuestionResponses ====================')
      console.log(response?.data)
      return response?.data
    } catch (error) {
      console.log(`Failed to get survey's questions' responses - ${error}`)
      throw error
    }
  },

  async createQuestionResponse(payload) {
    try {
      if (isEmpty(payload)) return
      const response = await ApiService.apiAxios.post(ApiRoutes.REPORTS + '/question-responses', payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to create question response - ${error}`)
      throw error
    }
  },

  async updateQuestionResponse(questionResponseId, payload) {
    try {
      if (!questionResponseId || isEmpty(payload)) return
      const response = await ApiService.apiAxios.put(`${ApiRoutes.REPORTS}/question-responses/${questionResponseId}`, payload)
      return response?.data
    } catch (error) {
      console.log(`Failed to update question response - ${error}`)
      throw error
    }
  },
}
