const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getOrganization, getOrganizationFacilities, getOrganizationUsers, updateOrganization } = require('../components/organizations')
const { param, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get organization's details using organizationId.
 */
router.get(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_FACILITY),
  // TODO Validate User Organization ID
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getOrganization(req, res)
  },
)

/**
 * Get an organization's facilities by facilityId.
 */
router.get(
  '/:organizationId/facilities',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_FACILITY),
  // TODO Validate User Organization ID
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getOrganizationFacilities(req, res)
  },
)

/**
 * Update an existing Organization
 */
router.put(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.UPDATE_ORG_FACILITY),
  // TODO Validate User Organization ID
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateOrganization(req, res)
  },
)

/**
 * Get an organization's users by organizationId and optional query parameters (userName, firstName, lastName, emailAddress).
 */
router.get(
  '/:organizationId/users',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_USERS_EDIT),
  // TODO Validate User Organization ID
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getOrganizationUsers(req, res)
  },
)
