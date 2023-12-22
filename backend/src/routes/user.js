'use strict'
const passport = require('passport')
const express = require('express')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { createUser, updateUser, getUserFacilities, getUserInfo, getUsersPermissionsFacilities } = require('../components/user')
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

const updateUserSchema = {
  contactId: {
    in: ['body'],
    exists: { errorMessage: '[contactId] is required' },
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
 * Get all facilities for a user. NOTE: if onlyWithPortalAccess is true, then only facilities with portal access will be returned.
 */
router.get(
  '/facilities/:onlyWithPortalAccess/:contactId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('contactId', 'URL param: [contactId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    const onlyWithPortalAccess = req.params.onlyWithPortalAccess === 'true'
    return getUserFacilities(req, res, onlyWithPortalAccess)
  },
)

/**
 * Create a new user/contact
 */
router.post('/create', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(createUserSchema)], (req, res) => {
  validationResult(req).throw()
  return createUser(req, res)
})

/**
 * Update a user/contact
 */
router.post('/update', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(updateUserSchema)], (req, res) => {
  validationResult(req).throw()
  return updateUser(req, res)
})

module.exports = router
