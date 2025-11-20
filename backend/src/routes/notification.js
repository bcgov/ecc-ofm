const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getNotifications, updateNotification } = require('../components/notification')
const { param, query, validationResult } = require('express-validator')
const validateContact = require('../middlewares/validateContact.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get notifications filtered by contactid
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS, PERMISSIONS.MESSAGES_READ_ONLY),
  [query('contactId', 'URL query: [contactId] is required').notEmpty().isUUID()],
  validateContact(),
  (req, res) => {
    validationResult(req).throw()
    return getNotifications(req, res)
  },
)

/**
 * Update an existing Notification
 */
router.patch(
  '/:notificationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS),
  [param('notificationId', 'URL param: [notificationId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return updateNotification(req, res)
  },
)

module.exports = router
