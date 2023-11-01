const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getMessages, updateMessageLastOpenedTime } = require('../components/message')
const { param, validationResult } = require('express-validator')

module.exports = router

/**
 * Get messages filtered by userid
 */
router.get('/user/:userId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('userId', 'URL param: [userId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getMessages(req, res)
})

/**
 * Update Last Opened Time of an existing Message
 */
router.put('/:messageId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('messageId', 'URL param: [messageId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return updateMessageLastOpenedTime(req, res)
})

module.exports = router
