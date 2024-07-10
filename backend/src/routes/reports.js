const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { query, param, validationResult, checkSchema } = require('express-validator')
const {
  getSurveySections,
  getSurveyQuestions,
  getSurveyResponse,
  getSurveyResponses,
  updateSurveyResponse,
  deleteSurveyResponse,
  getQuestionResponses,
  createQuestionResponse,
  updateQuestionResponse,
  deleteQuestionResponse,
} = require('../components/reports')
const validateFacility = require('../middlewares/validateFacility.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

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

/**
 * Get survey's sections using query:
 * Accepted queries:
 * - surveyTemplateId: to find all sections in a survey
 */
router.get('/survey-sections', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS), (req, res) => {
  validationResult(req).throw()
  return getSurveySections(req, res)
})

/**
 * Get survey's questions using query:
 * Accepted queries:
 * - sectionId: to find all questions in a survey section
 */
router.get('/survey-questions', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS), validateFacility(), (req, res) => {
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
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
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
router.get('/question-responses', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS), (req, res) => {
  validationResult(req).throw()
  return getQuestionResponses(req, res)
})

/**
 * Get questions' responses using query
 * Accepted queries:
 * - facilityId and fiscalYearId: to find all survey responses for a facility in a fiscal year
 */
router.get(
  '/survey-responses',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [query('facilityId', 'URL query: [facilityId] is required').not().isEmpty()],
  validateFacility(),
  (req, res) => {
    validationResult(req).throw()
    return getSurveyResponses(req, res)
  },
)

/**
 * Update a survey response
 */
router.patch(
  '/survey-responses/:surveyResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateSurveyResponse(req, res)
  },
)

/**
 * Remove all question responses associated with a survey response
 */
router.delete(
  '/survey-responses/:surveyResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.DELETE_DRAFT_REPORTS),
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteSurveyResponse(req, res)
  },
)

/**
 * Create a question response
 */
router.post(
  '/question-responses',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
  [checkSchema(postQuestionResponseSchema)],
  (req, res) => {
    validationResult(req).throw()
    return createQuestionResponse(req, res)
  },
)

/**
 * Update a question response
 */
router.patch(
  '/question-responses/:questionResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
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
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
  [param('questionResponseId', 'URL param: [questionResponseId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteQuestionResponse(req, res)
  },
)
