const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getPayments } = require('../components/payments')
const { validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get the list of Payments
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.VIEW_FUNDING_AMOUNTS), (req, res) => {
  validationResult(req).throw()
  return getPayments(req, res)
})
