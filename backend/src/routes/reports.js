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
  getSurveyResponsesCount,
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
 * Get survey's sections using query
 */
router.get(
  '/survey-sections',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [query('surveyTemplateId', 'URL query: [surveyTemplateId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getSurveySections(req, res)
  },
)

/**
 * Get survey's questions using query
 */
router.get(
  '/survey-questions',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [query('sectionId', 'URL query: [sectionId] is required').notEmpty().isUUID(), query('facilityId', 'URL query: [facilityId] is required').notEmpty().isUUID()],
  validateFacility(),
  (req, res) => {
    validationResult(req).throw()
    return getSurveyQuestions(req, res)
  },
)

/**
 * Get an existing Application details using applicationId
 */
router.get(
  '/survey-responses/:surveyResponseId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getSurveyResponse(req, res)
  },
)

/**
 * Get questions' responses of a survey response using surveyResponseId
 */
router.get(
  '/question-responses',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [query('surveyResponseId', 'URL query: [surveyResponseId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getQuestionResponses(req, res)
  },
)

/**
 * Get survey responses using query
 */
router.get(
  '/survey-responses',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [query('facilityId', 'URL query: [facilityId] is required').notEmpty().isUUID(), query('isSubmitted').optional().isBoolean()],
  validateFacility(),
  (req, res) => {
    validationResult(req).throw()
    return getSurveyResponses(req, res)
  },
)

/**
 * Get survey responses count using query
 */
router.get(
  '/survey-responses-count',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [query('facilityId', 'URL query: [facilityId] is required').notEmpty().isUUID(), query('isSubmitted').optional().isBoolean()],
  validateFacility(),
  (req, res) => {
    validationResult(req).throw()
    return getSurveyResponsesCount(req, res)
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
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').notEmpty().isUUID()],
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
  [param('surveyResponseId', 'URL param: [surveyResponseId] is required').notEmpty().isUUID()],
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
  [param('questionResponseId', 'URL param: [questionResponseId] is required').notEmpty().isUUID()],
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
  [param('questionResponseId', 'URL param: [questionResponseId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return deleteQuestionResponse(req, res)
  },
)
