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
  FILES: baseRoot + '/files',
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
  SYSTEM_MESSAGES: baseRoot + '/public/system-messages',
  IRREGULAR_APPLICATIONS: baseRoot + '/irregular',
  TOP_UP_APPLICATIONS: baseRoot + '/topups',
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

export const IRREGULAR_EXPENSE_STATUS_CODES = Object.freeze({
  APPROVED: 6,
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
  // 9 doesn't exist
  VERIFIED: 10,
  REDIRECTED: 11, // INACTIVE state
  PROVIDER_DECLINED: 12, // INACTIVE state
  EXPIRED: 13, // INACTIVE state
  UNSUCCESSFUL: 14, // INACTIVE state
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
  PROVIDER_DECLINED: 11,
})

export const FUNDING_AGREEMENT_STATE_CODES = Object.freeze({
  ACTIVE: 0,
  INACTIVE: 1,
})

export const TOP_UP_FUNDING_STATUS_CODES = Object.freeze({
  DRAFT: 1,
  IN_REVIEW: 2,
  APPROVED: 3,
})

export const FUNDING_REALLOCATION_REQUEST_STATUS_CODES = Object.freeze({
  IN_PROGRESS: 1,
  APPROVED: 2,
  INELIGIBLE: 3,
  CANCELLED: 4,
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
  FUNDING_ENVELOPE_CR: 'Funding Envelope Change Request',
  REPORTING: 'Reporting',
  IRREGULAR_EXPENSES: 'Irregular Expense',
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
  MULTIPLE: 4,
})

export const APPLICATION_ROUTES = Object.freeze({
  SELECT_FACILITY: 'select-facility',
  FACILITY_DETAILS: 'facility-details',
  ELIGIBILITY: 'eligibility',
  SERVICE_DELIVERY: 'service-delivery',
  OPERATING_COSTS: 'operating-costs',
  STAFFING: 'staffing',
  REVIEW: 'review-application',
  SUBMIT: 'declare-submit',
  CONFIRMATION: 'application-confirmation',
})

export const RENEWAL_ROUTES = Object.freeze({
  SELECT_FACILITY: 'renew-select-facility',
  FACILITY_DETAILS: 'renew-facility-details',
  ELIGIBILITY: 'renew-eligibility',
  SERVICE_DELIVERY: 'renew-service-delivery',
  OPERATING_COSTS: 'renew-operating-costs',
  STAFFING: 'renew-staffing',
  REVIEW: 'renew-review-application',
  SUBMIT: 'renew-declare-submit',
  CONFIRMATION: 'renew-application-confirmation',
})

export const SELECT_FACILITY_PAGES = [APPLICATION_ROUTES.SELECT_FACILITY, RENEWAL_ROUTES.SELECT_FACILITY]
export const FACILITY_DETAILS_PAGES = [APPLICATION_ROUTES.FACILITY_DETAILS, RENEWAL_ROUTES.FACILITY_DETAILS]
export const SERVICE_DELIVERY_PAGES = [APPLICATION_ROUTES.SERVICE_DELIVERY, RENEWAL_ROUTES.SERVICE_DELIVERY]
export const OPERATING_COSTS_PAGES = [APPLICATION_ROUTES.OPERATING_COSTS, RENEWAL_ROUTES.OPERATING_COSTS]
export const STAFFING_PAGES = [APPLICATION_ROUTES.STAFFING, RENEWAL_ROUTES.STAFFING]
export const REVIEW_PAGES = [APPLICATION_ROUTES.REVIEW, RENEWAL_ROUTES.REVIEW]
export const SUBMIT_PAGES = [APPLICATION_ROUTES.SUBMIT, RENEWAL_ROUTES.SUBMIT]
export const CONFIRMATION_PAGES = [APPLICATION_ROUTES.CONFIRMATION, RENEWAL_ROUTES.CONFIRMATION]

export const APPLICATION_INTAKE_TYPES = Object.freeze({
  OPEN_INTAKE: 1,
  LIMITED_INTAKE: 2,
})

export const APPLICATION_RENEWAL_TYPES = Object.freeze({
  NEW: 1,
  RENEWAL: 2,
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
  FACILITY_LOCATION_ATTRIBUTES: 'Facility location information required',
  DOCUMENT_UPLOAD: 'Document upload required',
  DOCUMENT_UPLOAD_COMMUNITY_LETTER: 'A letter of community support is required to continue',
  DOCUMENT_FINANCIAL_UPLOAD: 'Document upload for Income Statement and Balance Sheet required',
  DOCUMENT_RENT_LEASE_UPLOAD: 'Document upload of your Rent/Lease Agreement required',
  DOCUMENT_MORTGAGE_UPLOAD: 'Document upload of your Mortgage Statement required',
  DOCUMENT_LICENCE_UPLOAD: 'Document upload of your current licence required',
  DOCUMENT_HA_REPORT_UPLOAD: 'Document upload of your most recent Health Authority compliance report required',
  DOCUMENT_POLICY_PROCEDURE_UPLOAD: 'Document upload of your most recent Policy and Procedure Manual required',
  FACILITY_TYPE: 'Facility type required',
  ARM_LENGTH: "Arm's Length agreement checkbox required",
  RENT_LEASE_DATE_RANGE: 'Rent lease start and end dates required',
  OPERATIONAL_COST: 'Operating costs required -or- Facility costs required',
  STAFFING: 'Staffing information required',
  UNION: 'Union information required',
  CSSEA: 'CSSEA information required',
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
  INSTRUCTIONS: 'Instructions',
})

export const SURVEY_QUESTION_MULTIPLE_CHOICE_SEPARATOR = '","'

export const DOCUMENT_TYPES = Object.freeze({
  INCOME_STATEMENT: 'Income Statement',
  BALANCE_SHEET: 'Balance Sheet',
  MORTGAGE_STATEMENT: 'Mortgage Statement',
  RENT_LEASE_AGREEMENT: 'Rent/Lease Agreement',
  SUPPORTING_DOCS: 'Supporting Documents',
  COMMUNITY_LETTER: 'Community Support Letter',
  HEALTH_AUTHORITY_REPORT: 'HA Compliance Rpt',
  INCLUSION_POLICY: 'Inclusion Policy Document',
  POLICY_PROCEDURE_MANUAL: 'Policy and Procedure Manual',
  ASSISTANCE_REQUEST: 'Assistance Request',
})

export const DOCUMENT_LABELS = Object.freeze({
  LICENCE: 'A copy of your current licence',
  HEALTH_AUTHORITY_REPORT: 'A copy of your most recent Health Authority compliance report',
  COMMUNITY_LETTER: 'Letter of Reference for Community Support',
  POLICY_PROCEDURE_MANUAL: ' A copy of your most recent Policy and Procedure Manual',
})

export const YES_NO_CHOICE_CRM_MAPPING = Object.freeze({
  YES: 1,
  NO: 2,
  NA: 3,
})

export const YES_NO_RADIO_GROUP_MAPPING = Object.freeze({
  YES: 1,
  NO: 0,
  NA: 2,
})

export const YES_NO_CRM_MAPPING = Object.freeze({
  YES: 1,
  NO: 0,
})

export const SUPPORTED_DOCUMENTS_MESSAGE = 'The maximum file size is 4MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.'
export const OFM_PROGRAM = '$10 a Day Funding Program'

export const PHONE_FORMAT = '###-###-####'
export const EMAIL_FORMAT = 'email@domain.com'

export const VIRUS_SCAN_ERROR_MESSAGE = 'Cannot upload document - virus scan failed.'

export const NOT_IN_GOOD_STANDING_WARNING_MESSAGE =
  'A BC Registries check has returned as "not in good standing" for your organization. Good standing is a requirement to receive $10 a Day funding. Contact BC Registries immediately to resolve.'

export const BLANK_FIELD = '- - - -'

export const APPLICATION_TYPES = Object.freeze({
  OFM: 'Base Funding',
  IRREGULAR_EXPENSE: 'Irregular Expense',
  TOP_UP: 'Top Up',
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

export const TIME_ZONE = 'America/Vancouver'

export const BUSINESS_TYPE_CODES = Object.freeze({
  CORPORATION: 1,
  NON_PROFIT_SOCIETY: 2,
  PUBLIC_INSTITUTION: 3,
  LOCAL_GOVERNMENT: 4,
  SOLE_PROPRIETOR: 5,
})

export const PROVIDER_TYPE_CODES = Object.freeze({
  GROUP: 1,
  FAMILY: 2,
})

export const UNION_TYPE_CODES = Object.freeze({
  NO: 0,
  YES: 1,
})

export const REPORT_SECTION_TITLES = Object.freeze({
  HUMAN_RESOURCES: 'Human Resources',
})
