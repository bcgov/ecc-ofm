const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const {
  getApplications,
  getApplication,
  updateApplication,
  createApplication,
  getSupplementaryApplications,
  createSupplementaryApplication,
  updateSupplementaryApplication,
  deleteSupplementaryApplication,
  createEmployeeCertificate,
  updateEmployeeCertificate,
  deleteEmployeeCertificate,
  getApplicationPDF,
  getSupplementaryApplicationPDF,
} = require('../components/applications')
const { param, validationResult, checkSchema } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

const createApplicationSchema = {
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
  },
  organizationId: {
    in: ['body'],
    exists: { errorMessage: '[organizationId] is required' },
  },
  providerType: {
    in: ['body'],
    exists: { providerType: '[providerType] is required' },
  },
  ownership: {
    in: ['body'],
    exists: { ownership: '[ownership] is required' },
  },
  createdBy: {
    in: ['body'],
    exists: { createdBy: '[createdBy] is required' },
  },
}

const createEmployeeCertificateSchema = {
  applicationId: {
    in: ['body'],
    exists: { errorMessage: '[applicationId] is required' },
  },
  certificateNumber: {
    in: ['body'],
    exists: { errorMessage: '[certificateNumber] is required' },
  },
  initials: {
    in: ['body'],
    exists: { providerType: '[initials] is required' },
  },
  employeeType: {
    in: ['body'],
    exists: { ownership: '[employeeType] is required' },
  },
}

/**
 * Get the list of applications
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.VIEW_APPLICATIONS), (req, res) => {
  validationResult(req).throw()
  return getApplications(req, res)
})

/**
 * Create a new Application
 */
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.APPLY_FOR_FUNDING), [checkSchema(createApplicationSchema)], (req, res) => {
  validationResult(req).throw()
  return createApplication(req, res)
})

/**
 * Get an existing Application details using applicationId
 */
router.get(
  '/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getApplication(req, res)
  },
)

/**
 * Get OFM Application PDF by ID
 */
router.get(
  '/:applicationId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getApplicationPDF(req, res)
  },
)

/**
 * Update an existing Application using applicationId
 */
router.put(
  '/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateApplication(req, res)
  },
)

/**
 * Get an existing Supplementary Application details using applicationId
 */
router.get(
  '/supplementary/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getSupplementaryApplications(req, res)
  },
)

/**
 * Create a new Supplementary Application
 */
router.post('/supplementary/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.APPLY_FOR_FUNDING), (req, res) => {
  validationResult(req).throw()
  return createSupplementaryApplication(req, res)
})

/**
 * Update an existing Supplemntary Application using applicationId
 */
router.patch(
  '/supplementary/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateSupplementaryApplication(req, res)
  },
)

/**
 * delete existing Supplementary Application details using applicationId
 */
router.delete(
  '/supplementary/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteSupplementaryApplication(req, res)
  },
)

/**
 * Get Supplementary Application PDF by ID
 */
router.get(
  '/supplementary/:applicationId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return getSupplementaryApplicationPDF(req, res)
  },
)

/**
 * Create a new provider employee certificate
 */
router.post(
  '/employeeCertificate',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [checkSchema(createEmployeeCertificateSchema)],
  (req, res) => {
    validationResult(req).throw()
    return createEmployeeCertificate(req, res)
  },
)

/**
 * Update an existing provider employee certificate using providerEmployeeId
 */
router.patch(
  '/employeeCertificate/:providerEmployeeId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [param('providerEmployeeId', 'URL param: [providerEmployeeId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return updateEmployeeCertificate(req, res)
  },
)

/**
 * Delete an existing provider employee certificate using providerEmployeeId
 */
router.delete(
  '/employeeCertificate/:providerEmployeeId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.APPLY_FOR_FUNDING),
  [param('providerEmployeeId', 'URL param: [providerEmployeeId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw()
    return deleteEmployeeCertificate(req, res)
  },
)
