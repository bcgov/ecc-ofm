const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { param, validationResult, checkSchema } = require('express-validator')
const { getFacilityReports } = require('../components/reports')

module.exports = router

router.get('/:facilityId', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return getFacilityReports(req, res)
})
