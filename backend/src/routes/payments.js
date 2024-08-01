const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getPayments } = require('../components/payments')
const { query, validationResult } = require('express-validator')
const validateFacility = require('../middlewares/validateFacility.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get the list of Payments
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AMOUNTS),
  [query('facilityId', 'URL query: [facilityId] is required').notEmpty().isUUID(), query('stateCode').optional().isInt({ min: 0, max: 1 }), query('statusCode').optional().isInt({ min: 0, max: 8 })],
  validateFacility(),
  (req, res) => {
    validationResult(req).throw()
    return getPayments(req, res)
  },
)
