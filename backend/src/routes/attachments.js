const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getAttachments, getAttachmentFile } = require('../components/attachments')
const { param, query, validationResult } = require('express-validator')
const validateRole = require('../middlewares/validateRole')
const { EXPRESS_VALIDATOR_UUID_VERSION } = require('../util/constants')

module.exports = router

/**
 * Get the list of documents
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, query('notificationId').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION), validateRole(), (req, res) => {
  validationResult(req).throw()
  return getAttachments(req, res)
})

router.get(
  '/:attachmentId/file',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('attachmentId', 'URL param: [attachmentId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  validateRole(),
  (req, res) => {
    validationResult(req).throw()
    return getAttachmentFile(req, res)
  },
)

module.exports = router
