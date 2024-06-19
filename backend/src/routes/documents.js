const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getDocuments, createDocuments, deleteDocument } = require('../components/documents')
const { param, validationResult } = require('express-validator')
const multer = require('multer')
const upload = multer()
const { scanFilePayload } = require('../components/fileUtils')
const validateRole = require('../middlewares/validateRole')

module.exports = router

/**
 * Get the list of documents
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validateRole(), (req, res) => {
  validationResult(req).throw()
  return getDocuments(req, res)
})

/**
 * Create new documents
 */
router.post('/', upload.any(), passport.authenticate('jwt', { session: false }), scanFilePayload, isValidBackendToken, validateRole(), (req, res) => {
  validationResult(req).throw()
  return createDocuments(req, res)
})

/**
 * Delete uploaded document
 */
router.delete(
  '/:documentId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validateRole(),
  [param('documentId', 'URL param: [documentId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteDocument(req, res)
  },
)

module.exports = router
