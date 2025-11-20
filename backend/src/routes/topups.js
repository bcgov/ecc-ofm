const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth.js')
const isValidBackendToken = auth.isValidBackendToken()
const { getTopUpFundingPDF, getTopUpFundingByID } = require('../components/topups.js')
const { param, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS, EXPRESS_VALIDATOR_UUID_VERSION } = require('../util/constants.js')

module.exports = router

/**
 * Get Top-Up Application by ID
 */
router.get(
  '/:topUpFundingId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('topUpFundingId', 'URL param: [topUpFundingId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getTopUpFundingByID(req, res)
  },
)

/**
 * Get Top-Up Application PDF by ID
 */
router.get(
  '/:topUpFundingId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('topUpFundingId', 'URL param: [topUpFundingId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getTopUpFundingPDF(req, res)
  },
)
