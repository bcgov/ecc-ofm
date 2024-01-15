const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getOrganization, getOrganizationFacilities, getOrganizationUsers } = require('../components/organizations')
const { param, validationResult } = require('express-validator')

module.exports = router

/**
 * Get organization's details using accountId/organizationId
 */
router.get('/:accountId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('accountId', 'URL param: [accountId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getOrganization(req, res)
})

/**
 * Get an organization's facilities by facilityId.
 */
router.get(
  '/:organizationId/facilities',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getOrganizationFacilities(req, res)
  },
)

/**
 * Get an organization's users by organizationId and optional query parameters (userName, firstName, lastName, emailAddress).
 */
router.get(
  '/:organizationId/users',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getOrganizationUsers(req, res)
  },
)
