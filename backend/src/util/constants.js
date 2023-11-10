const ACCOUNT_TYPE = Object.freeze({
  FACILITY: 100000001,
  ORGANIZATION: 100000000,
})

const APPLICATION_STATUS_CODES = Object.freeze({
  NEW: null,
  DRAFT: 1,
  SUBMITTED: 3,
  WITHDRAWN: 4,
  APPROVED: 10,
  ACTION_REQUIRED: 11,
})

const ORGANIZATION_PROVIDER_TYPES = Object.freeze({
  GROUP: 100000000,
  FAMILY: 100000001,
})

const PROGRAM_YEAR_STATUS_CODES = Object.freeze({
  CURRENT: 1,
  INACTIVE: 2,
  FUTURE: 3,
  HISTORICAL: 4,
})

const ASSISTANCE_REQUEST_STATUS_CODES = Object.freeze({
  OPEN: [1, 2, 4], // 1 = Submitted, 2 = Assigned, 4 = Ready to Resolve
  CLOSED: [5, 6], // 5 = Closed - Complete, 6 = Closed - Cancelled
  ACTION_REQUIRED: [3], // 3 = With Provider
})

module.exports = {
  ACCOUNT_TYPE,
  APPLICATION_STATUS_CODES,
  ORGANIZATION_PROVIDER_TYPES,
  PROGRAM_YEAR_STATUS_CODES,
  ASSISTANCE_REQUEST_STATUS_CODES,
}
