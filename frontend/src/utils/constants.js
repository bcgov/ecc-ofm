let baseRoot = '/api'
const authRoot = baseRoot + '/auth'

export const AuthRoutes = Object.freeze({
  LOGIN: authRoot + '/login',
  LOGIN_IDIR: authRoot + '/login-idir',
  LOGOUT: authRoot + '/logout',
  SESSION_EXPIRED: authRoot + '/logout?sessionExpired=true',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token',
  SESSION_REMAINING_TIME: authRoot + '/user-session-remaining-time',
})

export const ApiRoutes = Object.freeze({
  USER: baseRoot + '/user',
  USER_FACILITIES: '/:contactId/facilities',
  USER_PERMISSIONS_FACILITIES: baseRoot + '/user/permissions-facilities',
  MESSAGES: baseRoot + '/messages',
  LOOKUP: baseRoot + '/config/lookup',
  NOTIFICATIONS: baseRoot + '/notifications',
  DOCUMENTS: baseRoot + '/documents',
  APPLICATIONS: baseRoot + '/applications',
  SUPPLEMENTARY_APPLICATIONS: baseRoot + '/applications/supplementary',
  ORGANIZATIONS: baseRoot + '/organizations',
  FACILITIES: baseRoot + '/facilities',
  ORGANIZATIONS_FACILITIES: baseRoot + '/organizations/:organizationId/facilities',
  ORGANIZATIONS_USERS: '/:organizationId/users',
  FACILITIES_CONTACTS: baseRoot + '/facilities/:facilityId/contacts',
  FACILITIES_LICENCES: baseRoot + '/facilities/:facilityId/licences',
  LICENCES: baseRoot + '/licences',
  REPORTS: baseRoot + '/reports',
  SUPPLEMENTARY_ALLOWANCES: baseRoot + '/supp-allowances',
  FUNDING_AGREEMENTS: baseRoot + '/funding-agreements',
})

export const ASSISTANCE_REQUEST_STATUS_CODES = Object.freeze({
  ASSIGNED: 2,
  WITH_PROVIDER: 3,
  READY_TO_RESOLVE: 4,
  CLOSED_COMPLETE: 5,
  CLOSED_CANCELLED: 6,
})

export const CRM_STATE_CODES = Object.freeze({
  ACTIVE: 0,
  INACTIVE: 1,
})

export const ROLES = Object.freeze({
  ADMIN: 1,
  ACCOUNT_MANAGEMENT: 2,
  FINANCIAL: 3,
  REPORTING: 4,
})

export const APPLICATION_STATUS_CODES = Object.freeze({
  DRAFT: 1,
  CANCELLED: 2,
  SUBMITTED: 3,
  IN_REVIEW: 4,
  AWAITING_PROVIDER: 5,
  APPROVED: 6,
})

export const SUPPLEMENTARY_APPLICATION_STATUS_CODES = Object.freeze({
  DRAFT: 1,
  CANCELLED: 2,
  SUBMITTED: 3,
  IN_REVIEW: 4,
  ACTION_REQUIRED: 5,
  APPROVED: 6,
})

export const FACILITY_TYPES = Object.freeze({
  RENT_LEASE: 1,
  OWNED_WITH_MORTGAGE: 2,
  OWNED_WITHOUT_MORTGAGE: 3,
  PROVIDED_FREE_OF_CHARGE: 4,
})

export const SUPPLEMENTARY_TYPES = Object.freeze({
  SUPPORT: 1,
  INDIGENOUS: 2,
  TRANSPORT: 3,
})

export const APPLICATION_ERROR_MESSAGES = Object.freeze({
  PRIMARY_CONTACT: 'Primary contact required',
  EXPENSE_AUTHORITY: 'Expense authority required',
  LICENCE_INFO: 'Licence information required',
  LICENCE_CONFIRMATION: 'Confirmation of licence information required',
  DOCUMENT_UPLOAD: 'Document upload required',
  FACILITY_TYPE: 'Facility type required',
  OPERATIONAL_COST: 'Operating costs required -or- Facility costs required',
  STAFFING: 'Staffing information required',
})

export const ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT = 'Your request is still in the queue. If this is an urgent request, you can call the program at 1-888-338-6622 (Option 7).'

export const OFM_PROGRAM = 'OFM Program'
