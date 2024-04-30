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
  APPLICATIONS: baseRoot + '/applications',
  DOCUMENTS: baseRoot + '/documents',
  FACILITIES: baseRoot + '/facilities',
  FACILITIES_CONTACTS: baseRoot + '/facilities/:facilityId/contacts',
  FACILITIES_LICENCES: baseRoot + '/facilities/:facilityId/licences',
  FUNDING_AGREEMENTS: baseRoot + '/funding-agreements',
  LICENCES: baseRoot + '/licences',
  LOOKUP: baseRoot + '/config/lookup',
  MESSAGES: baseRoot + '/messages',
  NOTIFICATIONS: baseRoot + '/notifications',
  ORGANIZATIONS: baseRoot + '/organizations',
  ORGANIZATIONS_FACILITIES: baseRoot + '/organizations/:organizationId/facilities',
  ORGANIZATIONS_USERS: '/:organizationId/users',
  REPORTS: baseRoot + '/reports',
  SUPPLEMENTARY_ALLOWANCES: baseRoot + '/supp-allowances',
  SUPPLEMENTARY_APPLICATIONS: baseRoot + '/applications/supplementary',
  USER: baseRoot + '/user',
  USER_FACILITIES: '/:contactId/facilities',
  USER_PERMISSIONS_FACILITIES: baseRoot + '/user/permissions-facilities',
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

// Roles are just buckets for permissions and shouldn't have
// any inherit logic surrounding them. However, there are
// a couple special cases so define them here
export const ROLES = Object.freeze({
  ACCOUNT_MANAGER: 'Account Manager',
  IMPERSONATE: 'Impersonate',
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

export const REQUEST_CATEGORY_NAMES = Object.freeze({
  ACCOUNT_MAINTENANCE: 'Account Maintenance',
})

export const REQUEST_SUB_CATEGORY_NAMES = Object.freeze({
  ORGANIZATION_DETAILS: 'Organization Details',
  FACILITY_DETAILS: 'Facility Details',
  ORGANIZATION_PHONE_EMAIL: 'Organization phone/email',
  FACILITY_PHONE_EMAIL: 'Facility phone/email',
  ADD_CHANGE_LICENCE: 'Add/change a licence',
  OTHER: 'Other',
})

export const GOOD_STANDING_STATUS_CODES = Object.freeze({
  GOOD: 1,
  NO_GOOD: 2,
  INTEGRATION_ERROR: 3,
})

export const OFM_PROGRAM_CODES = Object.freeze({
  OFM: 1,
  CCOF: 2,
  TDAD: 3,
})

export const APPLICATION_ROUTES = Object.freeze({
  SELECT_FACILITY: 'select-facility',
  FACILITY_DETAILS: 'facility-details',
  SERVICE_DELIVERY: 'service-delivery',
  OPERATING_COSTS: 'operating-costs',
  STAFFING: 'staffing',
  REVIEW: 'review-application',
  SUBMIT: 'declare-submit',
  CONFIRMATION: 'application-confirmation',
})

export const APPLICATION_ERROR_MESSAGES = Object.freeze({
  PRIMARY_CONTACT: 'Primary contact required',
  EXPENSE_AUTHORITY: 'Expense authority required',
  LICENCE_INFO: 'Licence information required',
  LICENCE_CONFIRMATION: 'Confirmation of licence information required',
  DOCUMENT_UPLOAD: 'Document upload required',
  DOCUMENT_FINANCIAL_UPLOAD: 'Document upload for Financial Statement and Balance Sheet required',
  DOCUMENT_SUPPORTING_UPLOAD: 'Document upload of your Rent/Lease Agreement under Supporting Documents required',
  FACILITY_TYPE: 'Facility type required',
  OPERATIONAL_COST: 'Operating costs required -or- Facility costs required',
  STAFFING: 'Staffing information required',
  SPLIT_CLASSROOM_INFO: 'Description of split classrooms required',
  SUPP_TRANSPORT: 'Transportation information required',
  SUPP_OTHER: 'Description of other costs required',
  SUPP_DUPLICATE_VIN: 'Unique VIN required',
})

export const PREVENT_CHANGE_REQUEST_TYPES = Object.freeze({
  IN_CCOF_PROGRAM: 'Facility in CCOF Program',
  IN_TDAD_PROGRAM: 'Facility in TDAD Program',
  NO_FACILITIES_IN_OFM: 'No Facilities in OFM',
})

export const SURVEY_RESPONSE_TYPES = Object.freeze({
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  BI_ANNUAL: 'Bi-annual',
  ANNUAL: 'Annual',
})

export const SURVEY_RESPONSE_STATUS_CODES = Object.freeze({
  SUBMITTED: 506580000,
})

export const SURVEY_QUESTION_TYPES = Object.freeze({
  NUMBER: 'Number',
  CURRENCY: 'Currency',
  TEXT: 'Text',
  TEXT_AREA: 'Text Area',
  DATE: 'Date',
  TWO_OPTION: 'Two Option',
  CHOICE: 'Choice',
  MULTIPLE_CHOICE: 'Multiple Choice',
  TABLE: 'Table',
})

export const DOCUMENT_TYPES = Object.freeze({
  FINANCIAL_STATEMENT: 'Financial Statement',
  BALANCE_SHEET: 'Balance Sheet',
  SUPPORTING_DOCS: 'Supporting Documents',
})

export const ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT = 'Your request is still in the queue. If this is an urgent request, you can call the program at 1-888-338-6622 (Option 7).'
export const SUPPORTED_DOCUMENTS_MESSAGE = 'The maximum file size is 4MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.'
export const OFM_PROGRAM = 'OFM Program'

export const PHONE_FORMAT = '###-###-####'
export const EMAIL_FORMAT = 'email@domain.com'

export const VIRUS_SCAN_ERROR_MESSAGE = 'Cannot upload document - virus scan failed.'

export const NOT_IN_GOOD_STANDING_WARNING_MESSAGE =
  'A BC Registries check has returned as "not in good standing" for your organization. Good standing is a requirement to receive OFM funding. Contact BC Registries immediately to resolve.'
