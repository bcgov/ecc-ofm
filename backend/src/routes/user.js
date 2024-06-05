'use strict'
const passport = require('passport')
const express = require('express')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { createUser, updateUser, getUserFacilities, getUserInfo, getUsersPermissionsFacilities, userExists, updateUserFacilityPermission } = require('../components/user')
const { param, validationResult, checkSchema } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

const createUserSchema = {
  userName: {
    in: ['body'],
    exists: { errorMessage: '[userName] is required' },
  },
  firstName: {
    in: ['body'],
    exists: { errorMessage: '[firstName] is required' },
  },
  lastName: {
    in: ['body'],
    exists: { errorMessage: '[lastName] is required' },
  },
  email: {
    in: ['body'],
    exists: { errorMessage: '[email] is required' },
  },
  role: {
    in: ['body'],
    exists: { errorMessage: '[role] is required' },
  },
}

const updateUserSchema = {
  contactId: {
    in: ['body'],
    exists: { errorMessage: '[contactId] is required' },
  },
}

/**
 * Get profile information for the logged in user
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo)

/**
 * Get profile information for a given user name
 */
router.get('/:userName', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  getUserInfo(req, res)
})

/**
 * Checks if the specified username exists.
 */
router.get('/:userName/exists', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.MANAGE_USERS_EDIT), (req, res) => {
  userExists(req, res)
})

/**
 * Get all users, permissions, and facilities for an organization.
 */
router.get(
  '/permissions-facilities/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getUsersPermissionsFacilities(req, res)
  },
)

router.patch(
  '/permissions-facilities/:bceidFacilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.UPDATE_ORG_FACILITY),
  [param('bceidFacilityId', 'URL param: [bceidFacilityId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateUserFacilityPermission(req, res)
  },
)

/**
 * Get all facilities for a user.
 */
router.get('/:contactId/facilities', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('contactId', 'URL param: [contactId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getUserFacilities(req, res)
})

/**
 * Create a new user/contact
 */
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.MANAGE_USERS_EDIT), [checkSchema(createUserSchema)], (req, res) => {
  validationResult(req).throw()
  return createUser(req, res)
})

/**
 * Update a user/contact
 */
router.put('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.MANAGE_USERS_EDIT), [checkSchema(updateUserSchema)], (req, res) => {
  validationResult(req).throw()
  return updateUser(req, res)
})

module.exports = router
