const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const {
  getFundingAgreements,
  updateFundingAgreement,
  getFundingAgreementById,
  getFundingPDFById,
  getFundingReallocationRequests,
  getExpiringSoonFundingAgreementsByFacility,
  getRecentlyExpiredFundingAgreementsByFacility,
} = require('../components/fundingAgreements')
const { param, query, validationResult, oneOf } = require('express-validator')
const validateExpenseAuthority = require('../middlewares/validateExpenseAuthority.js')
const validateFacility = require('../middlewares/validateFacility.js')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS } = require('../util/constants')

module.exports = router

/**
 * Get the list of Funding Agreements
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  oneOf([query('applicationId').notEmpty().isUUID(), query('facilityId').notEmpty().isUUID()], {
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
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
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
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
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
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
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
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw()
    return getFundingReallocationRequests(req, res)
  },
)

router.get(
  '/facility/:facilityId/expiring-soon-funding-agreements',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID()],
  async (req, res) => {
    validationResult(req).throw()
    try {
      const results = await getExpiringSoonFundingAgreementsByFacility(req.params.facilityId)
      if (!results || results.length === 0) {
        return res.status(204).json() // No Content
      }
      return res.status(200).json(results)
    } catch {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  },
)
router.get(
  '/facility/:facilityId/recently-expired-funding-agreements',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID()],
  async (req, res) => {
    validationResult(req).throw()
    try {
      const results = await getRecentlyExpiredFundingAgreementsByFacility(req.params.facilityId)
      if (!results || results.length === 0) {
        return res.status(204).json() // No Content
      }
      return res.status(200).json(results)
    } catch {
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  },
)
