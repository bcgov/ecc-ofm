const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getFundingAgreements, updateFundingAgreement, getFundingAgreementById } = require('../components/fundingAgreements')
const { param, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get the list of Funding Agreements
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getFundingAgreements(req, res)
})

/**
 * Get Funding Agreement by ID
 */
router.get('/:fundingAgreementId', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getFundingAgreementById(req, res)
})

/**
 * Update an existing Application using applicationId
 */
router.patch(
  '/:fundingAgreementId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SIGN_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateFundingAgreement(req, res)
  },
)
