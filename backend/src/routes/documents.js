const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getDocuments, createDocuments, deleteDocument, getDocumentFile } = require('../components/documents')
const { param, query, validationResult } = require('express-validator')
const multer = require('multer')
const upload = multer()
const { scanFilePayload } = require('../components/fileUtils')
const validateRole = require('../middlewares/validateRole')

module.exports = router

/**
 * Get the list of documents
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, query('regardingId').notEmpty().isUUID(), validateRole(), (req, res) => {
  validationResult(req).throw()
  return getDocuments(req, res)
})

/**
 * Get a base 64 encoded file by documentID
 */
router.get(
  '/:documentId/file',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('documentId', 'URL param: [documentId] is required').notEmpty().isUUID()],
  validateRole(),
  (req, res) => {
    validationResult(req).throw()
    return getDocumentFile(req, res)
  },
)

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
  [param('documentId', 'URL param: [documentId] is required').notEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteDocument(req, res)
  },
)

module.exports = router
