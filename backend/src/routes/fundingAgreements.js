const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { fundingAgreementExists, getFundingAgreements, getFundingAgreementById, getFundingPDFById, getFundingReallocationRequests, updateFundingAgreement } = require('../components/fundingAgreements')
const { body, param, query, validationResult, oneOf } = require('express-validator')
const validateExpenseAuthority = require('../middlewares/validateExpenseAuthority.js')
const validateFacility = require('../middlewares/validateFacility.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS, EXPRESS_VALIDATOR_UUID_VERSION } = require('../util/constants')

module.exports = router

/**
 * Get the list of Funding Agreements
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  oneOf([query('applicationId').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION), query('facilityId').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)], {
    message: 'URL query: [applicationId or facilityId] is required',
  }),
  [query('stateCode').optional().isInt({ min: 0, max: 1 }), query('statusCode').optional().isInt({ min: 0, max: 10 })],
  validateFacility(),
  (req, res) => {
    validationResult(req).throw()
    return getFundingAgreements(req, res)
  },
)

/**
 * Get Funding Agreement by ID
 */
router.get(
  '/:fundingAgreementId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getFundingAgreementById(req, res)
  },
)

/**
 * Get Funding Agreement PDF by ID
 */
router.get(
  '/:fundingAgreementId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getFundingPDFById(req, res)
  },
)

/**
 * Update an existing Funding Agreement using fundingAgreementId
 */
router.patch(
  '/:fundingAgreementId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  validateExpenseAuthority(),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return updateFundingAgreement(req, res)
  },
)

/**
 * Get the list of Funding Reallocation Requests
 */
router.get(
  '/:fundingAgreementId/funding-reallocation-requests',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO (vietle-cgi) - update permission once we receive confirmation for this requirement
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getFundingReallocationRequests(req, res)
  },
)
router.post(
  '/exists',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [body('facilityIds', 'Request body [facilityIds] is required and must be an array').isArray({ min: 1 })],
  (req, res) => {
    validationResult(req).throw()
    return fundingAgreementExists(req, res)
  },
)
