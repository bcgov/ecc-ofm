const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getNotifications, updateNotification } = require('../components/notification')
const { param, validationResult } = require('express-validator')
const validateContact = require('../middlewares/validateContact.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get notifications filtered by contactid
 */
router.get(
  '/contact/:contactId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS),
  [param('contactId', 'URL param: [contactId] is required').not().isEmpty()],
  validateContact(),
  (req, res) => {
    validationResult(req).throw()
    return getNotifications(req, res)
  },
)

/**
 * Update an existing Notification
 */
router.put(
  '/:notificationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS),
  [param('notificationId', 'URL param: [notificationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateNotification(req, res)
  },
)

module.exports = router
