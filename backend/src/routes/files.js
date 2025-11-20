const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getFile } = require('../components/files')
const { param, query, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get the file by id
 */
router.get(
  '/:fileId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('fileId', 'URL param: [fileId] is required').notEmpty().isUUID()],
  query('image').optional().isBoolean(),
  validatePermission(PERMISSIONS.MANAGE_NOTIFICATIONS, PERMISSIONS.MESSAGES_READ_ONLY),
  (req, res) => {
    validationResult(req).throw()
    return getFile(req, res)
  },
)
module.exports = router
