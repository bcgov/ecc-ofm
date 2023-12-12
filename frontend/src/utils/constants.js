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
  USER_PERMISSIONS_FACILITIES: baseRoot + '/user/permissions/facilities',
  USER_FACILITIES: baseRoot + '/user/facilities',
  MESSAGES: baseRoot + '/messages',
  LOOKUP: baseRoot + '/config/lookup',
  NOTIFICATIONS: baseRoot + '/notifications',
  DOCUMENTS: baseRoot + '/documents',
  APPLICATIONS: baseRoot + '/applications',
})

// TODO (weskubo-cgi) Remove this if not using page titles in UI
export const PAGE_TITLES = Object.freeze({
  LOGIN: 'Login',
  INTAKE: 'Intake',
  CONTRACT_MANAGEMENT: 'Contrct Management',
  PAYMENTS: 'Payments',
  REPORTING: 'Reporting',
  ACCOUNT_MAINTENANCE: 'Account Maintenance',
  MAINTENANCE_REQUEST_EXCEPTION_STREAM: 'Maint Request Exp Stream',
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

// TODO replace ids with string role name values and refactor
export const ROLES = Object.freeze({
  ADMIN: 1,
  ACCOUNT_MANAGEMENT: 2,
  FINANCIAL: 3,
  REPORTING: 4,
})

export const ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT = 'Your request is still in the queue. If this is an urgent request, you can call the program at 1-888-338-6622 (Option 7).'

export const OFM_PROGRAM = 'OFM Program'
