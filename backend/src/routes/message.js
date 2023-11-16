const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { updateAssistanceRequest, createNewAssistanceRequest, getAssistanceRequests, getAssistanceRequestMessages, replyToAssistanceRequest } = require('../components/message')
const { param, validationResult, checkSchema } = require('express-validator')

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

const replyAssistanceRequestSchema = {
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
router.put(
  '/:assistanceRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('assistanceRequestId', 'URL param: [assistanceRequestId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateAssistanceRequest(req, res)
  },
)

/**
 * Create a new Assistance Request
 */
router.post('/newAssistanceRequest', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(newAssistanceRequestSchema)], (req, res) => {
  validationResult(req).throw()
  return createNewAssistanceRequest(req, res)
})

/**
 * Get the list of assistance requests filtered by contactid
 */
router.get('/:contactId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('contactId', 'URL param: [contactId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getAssistanceRequests(req, res)
})

/**
 * Get the list of messages for a assistanceRequestId
 */
router.get(
  '/conversations/:assistanceRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('assistanceRequestId', 'URL param: [assistanceRequestId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getAssistanceRequestMessages(req, res)
  },
)

/**
 * Create a reply to a Assistance Request
 */
router.post('/replyToAssistanceRequest', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(replyAssistanceRequestSchema)], (req, res) => {
  validationResult(req).throw()
  return replyToAssistanceRequest(req, res)
})
module.exports = router
