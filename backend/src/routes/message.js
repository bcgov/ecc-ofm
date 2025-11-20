const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const {
  updateAssistanceRequest,
  createAssistanceRequest,
  getAssistanceRequests,
  getAssistanceRequest,
  getAssistanceRequestConversation,
  createAssistanceRequestConversation,
} = require('../components/message')
const { param, query, validationResult, checkSchema } = require('express-validator')
const validateContact = require('../middlewares/validateContact.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS, EXPRESS_VALIDATOR_UUID_VERSION } = require('../util/constants')

module.exports = router

const newAssistanceRequestSchema = {
  contactId: {
    in: ['body'],
    exists: { errorMessage: '[contactId] is required' },
  },
  requestCategoryId: {
    in: ['body'],
    exists: { errorMessage: '[requestCategoryId] is required' },
  },
  subject: {
    in: ['body'],
    exists: { errorMessage: '[subject] is required' },
  },
  description: {
    in: ['body'],
    exists: { errorMessage: '[description] is required' },
  },
  facilities: {
    in: ['body'],
    exists: { errorMessage: '[facilities] is required' },
  },
  contactMethod: {
    in: ['body'],
    exists: { errorMessage: '[contactMethod] is required' },
  },
}

const assistanceRequestConversationSchema = {
  assistanceRequestId: {
    in: ['body'],
    exists: { errorMessage: '[assistanceRequestId] is required' },
  },
  message: {
    in: ['body'],
    exists: { errorMessage: '[message] is required' },
  },
}

/**
 * Update an existing Assistance Request
 */
router.patch(
  '/:assistanceRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS),
  [param('assistanceRequestId', 'URL param: [assistanceRequestId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return updateAssistanceRequest(req, res)
  },
)

/**
 * Create a new Assistance Request
 */
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS), [checkSchema(newAssistanceRequestSchema)], (req, res) => {
  validationResult(req).throw()
  return createAssistanceRequest(req, res)
})

/**
 * Get the list of assistance requests filtered by contactid
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS, PERMISSIONS.MESSAGES_READ_ONLY),
  [query('contactId', 'URL query: [contactId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  validateContact(),
  (req, res) => {
    validationResult(req).throw()
    return getAssistanceRequests(req, res)
  },
)

/**
 * Get the details of an assistance requests with the provided assistance request ID
 */
router.get(
  '/:assistanceRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS, PERMISSIONS.MESSAGES_READ_ONLY),
  [param('assistanceRequestId', 'URL param: [assistanceRequestId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getAssistanceRequest(req, res)
  },
)

/**
 * Get the list of conversations for a assistanceRequestId
 */
router.get(
  '/conversations/:assistanceRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS, PERMISSIONS.MESSAGES_READ_ONLY),
  [param('assistanceRequestId', 'URL param: [assistanceRequestId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getAssistanceRequestConversation(req, res)
  },
)

/**
 * Create an Assistance Request's conversation
 */
router.post(
  '/conversations',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS),
  [checkSchema(assistanceRequestConversationSchema)],
  (req, res) => {
    validationResult(req).throw()
    return createAssistanceRequestConversation(req, res)
  },
)
module.exports = router
