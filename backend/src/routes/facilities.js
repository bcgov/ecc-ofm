const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getFacility, getFacilityContacts, getFacilityLicences, updateFacility } = require('../components/facilities')
const { param, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get facility's details using accountId/facilityId
 */
router.get('/:accountId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('accountId', 'URL param: [accountId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getFacility(req, res)
})

/**
 * Get facility's primary and expense authority contacts by facilityId.
 */
router.get('/:facilityId/contacts', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getFacilityContacts(req, res)
})

/**
 * Update a Facility
 */
router.put(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.UPDATE_ORG_FACILITY),
  [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateFacility(req, res)
  },
)

/**
 * Get facility's licences by facilityId.
 */
router.get('/:facilityId/licences', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getFacilityLicences(req, res)
})
