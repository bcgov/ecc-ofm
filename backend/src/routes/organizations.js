const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getOrganization } = require('../components/organizations')
const { param, validationResult } = require('express-validator')

module.exports = router

/**
 * Get organization's details using accountId/organizationId
 */
router.get('/:accountId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('accountId', 'URL param: [accountId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getOrganization(req, res)
})
