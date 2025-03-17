const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth.js')
const isValidBackendToken = auth.isValidBackendToken()
const { getTopUpFundingApplications, getTopUpFundingPDF, getTopUpFundingByID } = require('../components/topups.js')
const { query, param, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants.js')

module.exports = router

/**
 * Get all top-ups related to an application
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [query('applicationId', 'URL query: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getTopUpFundingApplications(req, res)
  },
)

/**
 * Get Top-Up Application by Expense ID
 */
router.get(
  '/:topUpFundingId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('topUpFundingId', 'URL param: [topUpFundingId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getTopUpFundingByID(req, res)
  },
)

/**
 * Get Top-Up Application PDF by Expense ID
 */
router.get(
  '/:topUpFundingId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('topUpFundingId', 'URL param: [topUpFundingId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getTopUpFundingPDF(req, res)
  },
)
