const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getApplicationsByFacilityId } = require('../components/applications')
const { param, validationResult } = require('express-validator')

module.exports = router

/**
 * Get the list of applications filtered by facilityId
 */
router.get('/facility/:facilityId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getApplicationsByFacilityId(req, res)
})
