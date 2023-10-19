let baseRoot = '/api'
const authRoot = baseRoot + '/auth'

let object = {
  LOGIN: authRoot + '/login',
  LOGIN_IDIR: authRoot + '/login-idir',
  LOGOUT: authRoot + '/logout',
  SESSION_EXPIRED: authRoot + '/logout?sessionExpired=true',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token',
  USER: baseRoot + '/user',
  SESSION_REMAINING_TIME: authRoot + '/user-session-remaining-time',
  //TODO comment out sprint 1... might need later: CONFIG: baseRoot + '/config/lookup',
}

//endpoints
export const Routes = Object.freeze(object)

export const ACCOUNT_TYPE = Object.freeze({
  FACILITY: 100000001,
  ORGANIZATION: 100000000,
})

export const PAGE_TITLES = Object.freeze({
  LOGIN: 'Login',
  INTAKE: 'Intake',
  CONTRACT_MANAGEMENT: 'Contrct Management',
  PAYMENTS: 'Payments',
  REPORTING: 'Reporting',
  ACCOUNT_MAINTENANCE: 'Account Maintenance',
  MAINTENANCE_REQUEST_EXCEPTION_STREAM: 'Maint Request Exp Stream',
})
