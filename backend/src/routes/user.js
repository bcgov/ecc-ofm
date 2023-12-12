'use strict'
const passport = require('passport')
const express = require('express')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { createUser, getUserFacilities, getUserInfo, getUsersPermissionsFacilities } = require('../components/user')
const { param, validationResult, checkSchema } = require('express-validator')

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

/**
 * Get profile information for the logged in user
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo)

/**
 * Get profile information for a given user name
 */
router.get('/:queryUserName', passport.authenticate('jwt', { session: false }), isValidBackendToken, getUserInfo)

/**
 * Get all users, permissions, and facilities for an organization.
 */
router.get(
  '/permissions/facilities/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getUsersPermissionsFacilities(req, res)
  },
)

/**
 * Get all facilities for a contact. i.e. a contact is also referred to as a user
 */
router.get('/facilities/:contactId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('contactId', 'URL param: [contactId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getUserFacilities(req, res)
})

/**
 * Create a new user/contact
 */
router.post('/create', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(createUserSchema)], (req, res) => {
  validationResult(req).throw()
  return createUser(req, res)
})

module.exports = router
