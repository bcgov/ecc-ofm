const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getApplications, getApplication, updateApplication, createApplication } = require('../components/applications')
const { param, validationResult, checkSchema } = require('express-validator')

module.exports = router

const createApplicationSchema = {
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
  },
}

/**
 * Get the list of applications
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getApplications(req, res)
})

/**
 * Create a new Application
 */
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(createApplicationSchema)], (req, res) => {
  validationResult(req).throw()
  return createApplication(req, res)
})

/**
 * Get an existing Application details using applicationId
 */
router.get('/:applicationId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getApplication(req, res)
})

/**
 * Update an existing Application using applicationId
 */
router.put('/:applicationId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return updateApplication(req, res)
})
