const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getNotifications, updateNotificationLastOpenedTime } = require('../components/notification')
const { param, validationResult } = require('express-validator')

module.exports = router

/**
 * Get notifications filtered by contactid
 */
router.get('/contact/:contactId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('contactId', 'URL param: [contactId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return getNotifications(req, res)
})

/**
 * Update Last Opened Time of an existing Notification
 */
router.put('/:notificationId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('notificationId', 'URL param: [notificationId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw()
  return updateNotificationLastOpenedTime(req, res)
})

module.exports = router
