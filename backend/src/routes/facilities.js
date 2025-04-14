const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getFacility, getFacilityContacts, getFacilityLicences, updateFacility, getFacilitiesForRenewal } = require('../components/facilities')
const { param, body, validationResult } = require('express-validator')
const validateFacility = require('../middlewares/validateFacility.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get facility's details using accountId/facilityId
 */
router.get(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_FACILITY),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID()],
  validateFacility(false),
  (req, res) => {
    validationResult(req).throw()
    return getFacility(req, res)
  },
)

/**
 * Get facility's primary and expense authority contacts by facilityId.
 */
router.get(
  '/:facilityId/contacts',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_FACILITY),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID()],
  validateFacility(false),
  (req, res) => {
    validationResult(req).throw()
    return getFacilityContacts(req, res)
  },
)

/**
 * Update a Facility
 */
router.patch(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.UPDATE_ORG_FACILITY, PERMISSIONS.APPLY_FOR_FUNDING),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID()],
  validateFacility(true),
  (req, res) => {
    validationResult(req).throw()
    return updateFacility(req, res)
  },
)

/**
 * Get facility's licences by facilityId.
 */
router.get(
  '/:facilityId/licences',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_FACILITY),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID()],
  validateFacility(false),
  (req, res) => {
    validationResult(req).throw()
    return getFacilityLicences(req, res)
  },
)
router.post(
  '/renewalFacilities',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [body('facilityIds', 'Request body [facilityIds] is required and must be an array').isArray({ min: 1 })],
  (req, res) => {
    validationResult(req).throw()
    return getFacilitiesForRenewal(req, res)
  },
)
