const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { param, validationResult, checkSchema } = require('express-validator')
const {
  getFacilityReports,
  getSurveySections,
  getSurveyQuestions,
  getSurveyResponse,
  getSurveyResponses,
  createSurveyResponse,
  updateSurveyResponse,
  getQuestionResponses,
  createQuestionResponse,
  updateQuestionResponse,
  deleteQuestionResponse,
} = require('../components/reports')

module.exports = router

const postSurveyResponseSchema = {
  contactId: {
    in: ['body'],
    exists: { errorMessage: '[contactId] is required' },
  },
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
  },
  surveyId: {
    in: ['body'],
    exists: { errorMessage: '[surveyId] is required' },
  },
  fiscalYearId: {
    in: ['body'],
    exists: { errorMessage: '[fiscalYearId] is required' },
  },
  reportingMonthId: {
    in: ['body'],
    exists: { errorMessage: '[reportingMonthId] is required' },
  },
}

const postQuestionResponseSchema = {
  questionId: {
    in: ['body'],
    exists: { errorMessage: '[questionId] is required' },
  },
  surveyResponseId: {
    in: ['body'],
    exists: { errorMessage: '[surveyResponseId] is required' },
  },
  value: {
    in: ['body'],
    exists: { errorMessage: '[value] is required' },
  },
}

router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getFacilityReports(req, res)
})

/**
 * Get survey's sections using query:
 * Accepted queries:
 * - surveyId: to find all sections in a survey
 */
router.get('/survey-sections', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getSurveySections(req, res)
})

/**
 * Get survey's questions using query:
 * Accepted queries:
 * - sectionId: to find all questions in a survey section
 */
router.get('/survey-questions', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getSurveyQuestions(req, res)
})

/**
 * Get an existing Application details using applicationId
 */
router.get(
  '/survey-responses/:surveyResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getSurveyResponse(req, res)
  },
)

/**
 * Get questions' responses using query
 * Accepted queries:
 * - surveyResponseId: to find all question responses in a survey response
 */
router.get('/question-responses', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getQuestionResponses(req, res)
})

/**
 * Get questions' responses using query
 * Accepted queries:
 * - facilityId and fiscalYearId: to find all survey responses for a facility in a fiscal year
 */
router.get('/survey-responses', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getSurveyResponses(req, res)
})

/**
 * Create a survey response
 */
router.post('/survey-responses', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(postSurveyResponseSchema)], (req, res) => {
  validationResult(req).throw()
  return createSurveyResponse(req, res)
})

/**
 * Update a survey response
 */
router.patch(
  '/survey-responses/:surveyResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateSurveyResponse(req, res)
  },
)

/**
 * Create a question response
 */
router.post('/question-responses', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(postQuestionResponseSchema)], (req, res) => {
  validationResult(req).throw()
  return createQuestionResponse(req, res)
})

/**
 * Update a question response
 */
router.patch(
  '/question-responses/:questionResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('questionResponseId', 'URL param: [questionResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateQuestionResponse(req, res)
  },
)

/**
 * Delete a question response
 */
router.delete(
  '/question-responses/:questionResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('questionResponseId', 'URL param: [questionResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteQuestionResponse(req, res)
  },
)
