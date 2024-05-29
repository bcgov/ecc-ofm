const ASSISTANCE_REQUEST_STATUS_CODES = Object.freeze({
  OPEN: [1, 2, 4], // 1 = Submitted, 2 = Assigned, 4 = Ready to Resolve
  CLOSED: [5, 6], // 5 = Closed - Complete, 6 = Closed - Cancelled
  ACTION_REQUIRED: [3], // 3 = With Provider
})

const SCAN_RESULTS = Object.freeze({
  VIRUS_FOUND: 'FOUND',
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
  MANAGE_USERS: 'Manage Users',
  MANAGE_USERS_EDIT: 'Manage Users Edit',
  MANAGE_USERS_VIEW: 'Manage Users View',

  // Notifications and Messages
  MANAGE_NOTIFICATIONS: 'Manage Notification and Messages',
})

module.exports = {
  ASSISTANCE_REQUEST_STATUS_CODES,
  SCAN_RESULTS,
  PERMISSIONS,
}
