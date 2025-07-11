const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { body, query, param, validationResult, checkSchema } = require('express-validator')
const {
  getSurveySections,
  getSurveyQuestions,
  getSurveyResponse,
  getSurveyResponses,
  getSurveyResponsesCount,
  updateSurveyResponse,
  deleteSurveyResponse,
  getQuestionResponses,
  createQuestionResponses,
  updateQuestionResponses,
  deleteQuestionResponses,
} = require('../components/reports')
const validateFacility = require('../middlewares/validateFacility.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

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
 * Get questions' responses of a survey response by section
 * Use POST to reduce network traffic by batching sectionId requests
 */
router.post(
  '/question-responses/fetch-by-section',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SEARCH_VIEW_REPORTS),
  [body('surveyResponseId', 'Request body [surveyResponseId] is required').notEmpty().isUUID(), body('sectionIds', 'Request body [sectionIds] must be a non-empty array').isArray({ min: 1 })],
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
 * Create question responses
 */
router.post(
  '/question-responses/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
  [
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
    checkSchema({
      '*.questionId': {
        in: ['body'],
        exists: { errorMessage: '[questionId] is required' },
        isUUID: { errorMessage: '[questionId] must be a valid UUID' },
      },
      '*.surveyResponseId': {
        in: ['body'],
        exists: { errorMessage: '[surveyResponseId] is required' },
        isUUID: { errorMessage: '[surveyResponseId] must be a valid UUID' },
      },
      '*.value': {
        in: ['body'],
        exists: { errorMessage: '[value] is required' },
      },
    }),
  ],
  (req, res) => {
    validationResult(req).throw()
    return createQuestionResponses(req, res)
  },
)

/**
 * Update question responses
 */
router.patch(
  '/question-responses/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
  [
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
    checkSchema({
      '*.questionResponseId': {
        in: ['body'],
        exists: { errorMessage: '[questionResponseId] is required' },
        isUUID: { errorMessage: '[questionResponseId] must be a valid UUID' },
      },
      '*.value': {
        in: ['body'],
        exists: { errorMessage: '[value] is required' },
      },
    }),
  ],
  (req, res) => {
    validationResult(req).throw()
    return updateQuestionResponses(req, res)
  },
)

/**
 * Delete question responses
 */
router.delete(
  '/question-responses/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_DRAFT_REPORTS),
  [body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'), body('*').isUUID().withMessage('Each ID must be a valid UUID')],
  (req, res) => {
    validationResult(req).throw()
    return deleteQuestionResponses(req, res)
  },
)
