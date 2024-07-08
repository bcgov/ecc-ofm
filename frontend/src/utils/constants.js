const baseRoot = '/api'
const authRoot = `${baseRoot}/auth`

export const AuthRoutes = Object.freeze({
  LOGIN: authRoot + '/login',
  LOGIN_IDIR: authRoot + '/login-idir',
  LOGOUT: authRoot + '/logout',
  LOGOUT_IDIR: authRoot + '/logout-idir',
  REFRESH: authRoot + '/refresh',
  TOKEN: authRoot + '/token',
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
  ORGANIZATIONS_USERS: baseRoot + '/organizations/:organizationId/users',
  PAYMENTS: baseRoot + '/payments',
  REPORTS: baseRoot + '/reports',
  SUPPLEMENTARY_ALLOWANCES: baseRoot + '/supp-allowances',
  SUPPLEMENTARY_APPLICATIONS: baseRoot + '/applications/supplementary',
  USER: baseRoot + '/user',
  USER_FACILITIES: baseRoot + '/user/:contactId/facilities',
  USER_PERMISSIONS_FACILITIES: baseRoot + '/user/permissions-facilities',
})

export const ASSISTANCE_REQUEST_STATUS_CODES = Object.freeze({
  SUBMITTED: 1,
  ASSIGNED: 2,
  WITH_PROVIDER: 3,
  READY_TO_RESOLVE: 4,
  CLOSED_COMPLETE: 5, // INACTIVE state
  CLOSED_CANCELLED: 6, // INACTIVE state
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
  INELIGIBLE: 2, // INACTIVE state
  SUBMITTED: 3,
  IN_REVIEW: 4,
  AWAITING_PROVIDER: 5,
  APPROVED: 6,
  CANCELLED_BY_MINISTRY: 7, // INACTIVE state
  CANCELLED_BY_SP: 8, // INACTIVE state
  EXPIRED: 9, // INACTIVE state
  VERIFIED: 10,
})

export const FUNDING_AGREEMENT_STATUS_CODES = Object.freeze({
  DRAFT: 1,
  EXPIRED: 2,
  FA_REVIEW: 3,
  IN_REVIEW_WITH_MINISTRY_EA: 4,
  SIGNATURE_PENDING: 5,
  SUBMITTED: 6,
  //7 does not exist in CRM
  ACTIVE: 8,
  TERMINATED: 9,
  CANCELLED: 10,
})

export const PAYMENT_STATUS_CODES = Object.freeze({
  PENDING_PAYMENT: 1,
  PAID: 2, // INACTIVE state
  AWAITING_APPROVAL: 3,
  APPROVED_FOR_PAYMENT: 4,
  PROCESSING_PAYMENT: 5,
  PROCESSING_ERROR: 6,
  CANCELLED: 7, // INACTIVE state
  QR_APPROVED: 8,
})

export const DATE_FILTER_TYPES = Object.freeze({
  THREE_MONTHS: '3 Months',
  SIX_MONTHS: '6 Months',
  YTD: 'YTD',
  CUSTOM: 'Custom',
})

export const SUPPLEMENTARY_APPLICATION_STATUS_CODES = Object.freeze({
  DRAFT: 1,
  INELIGIBLE: 2, // INACTIVE state
  SUBMITTED: 3,
  IN_REVIEW: 4,
  ACTION_REQUIRED: 5,
  APPROVED: 6,
  EXPIRED: 7, // INACTIVE state
  CANCELLED: 8, // INACTIVE state
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
  REPORTING: 'Reporting',
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

export const APPLICATION_INTAKE_TYPES = Object.freeze({
  OPEN_INTAKE: 1,
  LIMITED_INTAKE: 2,
})

export const APPLICATION_PROVIDER_EMPLOYEE_TYPES = Object.freeze({
  ECE: 1, // Early Childhood Educator
  ECEA: 2, // Early Childhood Educator Assistant
  ITE: 3, // Infant/Toddler Early Childhood Educator
})

export const APPLICATION_ERROR_MESSAGES = Object.freeze({
  FISCAL_YEAR_END_DATE: 'Fiscal year end date required',
  PRIMARY_CONTACT: 'Primary contact required',
  EXPENSE_AUTHORITY: 'Expense authority required',
  LICENCE_INFO: 'Licence information required',
  LICENCE_CONFIRMATION: 'Confirmation of licence information required',
  DOCUMENT_UPLOAD: 'Document upload required',
  DOCUMENT_FINANCIAL_UPLOAD: 'Document upload for Income Statement and Balance Sheet required',
  DOCUMENT_SUPPORTING_UPLOAD: 'Document upload of your Rent/Lease Agreement under Supporting Documents required',
  FACILITY_TYPE: 'Facility type required',
  ARM_LENGTH: "Arm's Length agreement checkbox required",
  OPERATIONAL_COST: 'Operating costs required -or- Facility costs required',
  STAFFING: 'Staffing information required',
  MISMATCH_NUMBER_STAFF_CERTIFICATE: 'The total of staff and total of certificates must match',
  DUPLICATE_CERTIFICATE_NUMBERS: 'Certificate number already exists, duplicate certificates are not permitted',
  DUPLICATE_CERTIFICATE_INITIALS: 'Initials already exists, please ensure staff are entered only once on this page.',
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

export const SURVEY_RESPONSE_STATUSES = Object.freeze({
  DRAFT: 'Draft',
  COMPLETED: 'Completed',
  COMPLETED_LATE: 'Completed - Late',
  COMPLETED_CLOSED: 'Completed - Closed',
})

export const SURVEY_RESPONSE_STATUS_CODES = Object.freeze({
  ACTIVE: 1,
  INACTIVE: 2,
  COMPLETED: 3,
  CLOSED: 4,
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
  INCOME_STATEMENT: 'Income Statement',
  BALANCE_SHEET: 'Balance Sheet',
  SUPPORTING_DOCS: 'Supporting Documents',
})

export const YES_NO_CHOICE_CRM_MAPPING = Object.freeze({
  YES: 1,
  NO: 2,
  NA: 3,
})

export const ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT = 'Your request is still in the queue. If this is an urgent request, you can call the program at 1-888-338-6622 (Option 7).'
export const SUPPORTED_DOCUMENTS_MESSAGE = 'The maximum file size is 4MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.'
export const OFM_PROGRAM = 'OFM Program'

export const PHONE_FORMAT = '###-###-####'
export const EMAIL_FORMAT = 'email@domain.com'

export const VIRUS_SCAN_ERROR_MESSAGE = 'Cannot upload document - virus scan failed.'

export const NOT_IN_GOOD_STANDING_WARNING_MESSAGE =
  'A BC Registries check has returned as "not in good standing" for your organization. Good standing is a requirement to receive OFM funding. Contact BC Registries immediately to resolve.'

export const BLANK_FIELD = '- - - -'

export const APPLICATION_TYPES = Object.freeze({
  OFM: 'OFM',
})

export const DAYS_OF_WEEK = Object.freeze([
  {
    title: 'Monday',
    value: 1,
  },
  {
    title: 'Tuesday',
    value: 2,
  },
  {
    title: 'Wednesday',
    value: 3,
  },
  {
    title: 'Thursday',
    value: 4,
  },
  {
    title: 'Friday',
    value: 5,
  },
  {
    title: 'Saturday',
    value: 6,
  },
  {
    title: 'Sunday',
    value: 7,
  },
])
