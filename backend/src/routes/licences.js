const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getLicenceDetails, updateLicenceDetails } = require('../components/licences')
const { param, validationResult } = require('express-validator')

module.exports = router

/**
 * Get licence's licence details by licenceId.
 */
router.get(
  '/:licenceId/licence-details',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('licenceId', 'URL param: [licenceId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getLicenceDetails(req, res)
  },
)

/**
 * Update licence's licence details by licenceId.
 */
router.patch(
  '/:licenceDetailId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('licenceDetailId', 'URL param: [licenceDetailId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()

    return updateLicenceDetails(req, res)
  },
)
