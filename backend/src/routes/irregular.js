const express = require('express')
const passport = require('passport')
const router = express.Router()
const auth = require('../components/auth')
const isValidBackendToken = auth.isValidBackendToken()
const { getIrregularExpenseApplications, getIrregularExpensePDF, getIrregularExpenseByID } = require('../components/irregular')
const { query, param, validationResult } = require('express-validator')
const validatePermission = require('../middlewares/validatePermission.js')
const { PERMISSIONS, EXPRESS_VALIDATOR_UUID_VERSION } = require('../util/constants')

module.exports = router

/**
 * Get all Irregular Expenses related to an application
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [query('applicationId', 'URL query: [applicationId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION), query('statusCode').optional().isInt({ min: 0, max: 6 })],
  (req, res) => {
    validationResult(req).throw()
    return getIrregularExpenseApplications(req, res)
  },
)

/**
 * Get Irregular Expense Application by Expense ID
 */
router.get(
  '/:expenseApplicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('expenseApplicationId', 'URL param: [expenseApplicationId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getIrregularExpenseByID(req, res)
  },
)

/**
 * Get Irregular Expense Application PDF by Expense ID
 */
router.get(
  '/:expenseApplicationId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_APPLICATIONS),
  [param('expenseApplicationId', 'URL param: [expenseApplicationId] is required').notEmpty().isUUID(EXPRESS_VALIDATOR_UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw()
    return getIrregularExpensePDF(req, res)
  },
)
