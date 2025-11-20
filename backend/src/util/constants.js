const ASSISTANCE_REQUEST_STATUS_CODES = Object.freeze({
  OPEN: [1, 2, 4], // 1 = Submitted, 2 = Assigned, 4 = Ready to Resolve
  CLOSED: [5, 6], // 5 = Closed - Complete, 6 = Closed - Cancelled
  ACTION_REQUIRED: [3], // 3 = With Provider
})

const SCAN_RESULTS = Object.freeze({
  VIRUS_FOUND: 'FOUND',
})

const IDENTITY_PROVIDER = Object.freeze({
  BUSINESS: 'bceidbusiness',
  IDIR: 'idir',
})

const PERMISSIONS = Object.freeze({
  // Reporting
  SEARCH_VIEW_REPORTS: 'Search/View Reports',
  SUBMIT_DRAFT_REPORTS: 'Submit Draft Reports',
  DELETE_DRAFT_REPORTS: 'Delete Draft Reports',

  // Funding
  VIEW_FUNDING_AMOUNTS: 'View Funding Amounts',
  REQUEST_FUNDING_CHANGE: 'Request Funding Change',
  VIEW_FUNDING_AGREEMENT: 'View Funding Agreement',

  // Documents
  DOCUMENT_MANAGEMENT: 'Document Management',

  // Application
  VIEW_APPLICATIONS: 'View Applications',
  APPLY_FOR_FUNDING: 'Apply for Funding',

  // Resources
  VIEW_RESOURCES: 'View Resources',

  // Account Management
  VIEW_ORG_FACILITY: 'View Org/Facility Information',
  UPDATE_ORG_FACILITY: 'Update Org/ facility information',
  SUBMIT_CHANGE_REQUEST: 'Submit Change Request from AM',
  MANAGE_USERS_EDIT: 'Manage Users Edit',
  MANAGE_USERS_VIEW: 'Manage Users View',

  // Notifications and Messages
  MANAGE_NOTIFICATIONS: 'Manage Notification and Messages',
  MESSAGES_READ_ONLY: 'Messages Read Only',
})

const SURVEY_RESPONSE_STATUS_CODES = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 2,
  COMPLETED: 3,
  CLOSED: 4,
})

const OFM_PROGRAM_CODES = Object.freeze({
  OFM: 1,
  CCOF: 2,
  TDAD: 3,
  MULTIPLE: 4,
})

const TOP_UP_FUNDING_STATUS_CODES = Object.freeze({
  DRAFT: 1,
  IN_REVIEW: 2,
  APPROVED: 3,
})
const FUNDING_AGREEMENT_STATE_CODES = Object.freeze({
  ACTIVE: 0,
  INACTIVE: 1,
})
const FUNDING_AGREEMENT_STATUS_CODES = Object.freeze({
  EXPIRED: 2,
  ACTIVE: 8,
})
const APPLICATION_RENEWAL_TYPES = Object.freeze({
  NEW: 1,
  RENEWAL: 2,
})

const EXPRESS_VALIDATOR_UUID_VERSION = 'loose'

module.exports = {
  APPLICATION_RENEWAL_TYPES,
  ASSISTANCE_REQUEST_STATUS_CODES,
  EXPRESS_VALIDATOR_UUID_VERSION,
  FUNDING_AGREEMENT_STATE_CODES,
  FUNDING_AGREEMENT_STATUS_CODES,
  IDENTITY_PROVIDER,
  OFM_PROGRAM_CODES,
  PERMISSIONS,
  SCAN_RESULTS,
  SURVEY_RESPONSE_STATUS_CODES,
  TOP_UP_FUNDING_STATUS_CODES,
}
