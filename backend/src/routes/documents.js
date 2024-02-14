const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { createDocuments } = require('../components/documents')
const { validationResult } = require('express-validator')
const multer = require('multer')
const upload = multer()
const { scanFilePayload } = require('../components/fileUtils')

module.exports = router

/**
 * Create new documents
 */
router.post('/', upload.any(), passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw()
  return createDocuments(req, res)
})

router.post('/test', upload.any(), passport.authenticate('jwt', { session: false }), isValidBackendToken, scanFilePayload, (req, res) => {
  validationResult(req).throw()
  return res.status(200).json('ok')
})

module.exports = router
