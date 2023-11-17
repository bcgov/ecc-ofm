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
  MESSAGE: baseRoot + '/messages',
  LOOKUP: baseRoot + '/config/lookup',
  NOTICE: baseRoot + '/notifications',
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
  SUBMITTED: 1,
  ASSIGNED: 2,
  WITH_PROVIDER: 3,
  READY_TO_RESOLVE: 4,
  CLOSED_COMPLETE: 5,
  CLOSED_CANCELLED: 6,
})
