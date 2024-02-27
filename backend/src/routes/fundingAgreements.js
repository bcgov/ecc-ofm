const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getFundingAgreements } = require('../components/fundingAgreements')
const { validationResult } = require('express-validator')

module.exports = router

/**
 * Get the list of Funding Agreements
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getFundingAgreements(req, res)
})
