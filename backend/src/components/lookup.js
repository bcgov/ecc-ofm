'use strict'
const { getOperation, handleError } = require('./utils')
const HttpStatus = require('http-status-codes')
const {
  ApplicationIntakeMappings,
  FacilityIntakeMappings,
  PermissionMappings,
  RequestCategoryMappings,
  RequestSubCategoryMappings,
  RoleMappings,
  // ReportTemplateMappings,
  SystemMessageMappings,
} = require('../util/mapping/Mappings')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const log = require('./logger')

const Redis = require('../util/redis/redis-client')
const { CronJob } = require('cron')

async function getRequestCategories() {
  let requestCategories
  try {
    requestCategories = await Redis.jsonGet('requestCategories')
  } catch (e) {
    log.error('Unable to retrieve the requestCategories from Redis', e)
  }

  if (!requestCategories) {
    requestCategories = []
    const response = await getOperation('ofm_request_categories')
    response?.value?.forEach((item) => requestCategories.push(new MappableObjectForFront(item, RequestCategoryMappings)))
    Redis.jsonSet('requestCategories', '$', requestCategories).catch((error) => log.error('Could not set requestCategories with Redis', error))
  }
  return requestCategories
}

async function getRequestSubCategories() {
  let requestSubCategories
  try {
    requestSubCategories = await Redis.jsonGet('requestSubCategories')
  } catch (e) {
    log.error('Unable to retrieve the requestSubCategories from Redis', e)
  }

  if (!requestSubCategories) {
    requestSubCategories = []
    const response = await getOperation('ofm_subcategories?$orderby=ofm_display_order')
    response?.value?.forEach((item) => requestSubCategories.push(new MappableObjectForFront(item, RequestSubCategoryMappings)))
    Redis.jsonSet('requestSubCategories', '$', requestSubCategories).catch((error) => log.error('Could not set requestSubCategories with Redis', error))
  }
  return requestSubCategories
}

async function fetchAndCacheData(cacheKey, operationName) {
  let data
  try {
    data = await Redis.jsonGet(cacheKey)
  } catch (e) {
    log.error(`Unable to retrieve ${cacheKey} from Redis`, e)
  }

  if (!data) {
    try {
      const response = await getOperation(`GlobalOptionSetDefinitions(Name='${operationName}')`)
      data =
        response?.Options?.map((item) => ({
          id: Number(item.Value),
          description: item.Label?.LocalizedLabels?.[0]?.Label ?? null,
        })) || []
      Redis.jsonSet(cacheKey, '$', data).catch((error) => log.error(`Could not set ${cacheKey} with Redis`, error))
    } catch (error) {
      log.error(`Error fetching data for ${cacheKey}:`, error)
    }
  }
  return data
}

async function getApplicationIntakes() {
  let applicationIntakes
  try {
    applicationIntakes = await Redis.jsonGet('applicationIntakes')
  } catch (e) {
    log.error('Unable to retrieve the applicationIntakes from Redis', e)
  }

  if (!applicationIntakes) {
    applicationIntakes = []
    const response = await getOperation(
      'ofm_intakes?$select=ofm_intakeid,ofm_intake_type,ofm_start_date,ofm_end_date&$filter=(statecode eq 0)&$expand=ofm_intake_facilityintake($select=ofm_facility_intakeid,_ofm_facility_value)',
    )
    response?.value?.forEach((item) => {
      const intake = new MappableObjectForFront(item, ApplicationIntakeMappings).toJSON()
      intake.facilities = item.ofm_intake_facilityintake?.map((facility) => new MappableObjectForFront(facility, FacilityIntakeMappings).toJSON())
      applicationIntakes.push(intake)
    })
    Redis.jsonSet('applicationIntakes', '$', applicationIntakes).catch((error) => log.error('Could not set applicationIntakes with Redis', error))
  }
  return applicationIntakes
}

async function getRoles() {
  let roles
  try {
    roles = await Redis.jsonGet('roles')
  } catch (e) {
    log.error('Could not retrieve roles data from Redis', e)
  }

  if (!roles) {
    roles = []
    const response = await getOperation(
      "ofm_portal_roles?$select=ofm_name,ofm_portal_role_number,ofm_description&$expand=owningbusinessunit($select=name),ofm_portal_role_permission($select=ofm_portal_permissionid,_ofm_portal_privilege_value;$expand=ofm_portal_privilege($select=ofm_category,ofm_name,ofm_portal_privilege_number);$filter=(statecode eq 0))&$filter=(statecode eq 0) and (owningbusinessunit/name eq 'OFM')&pageSize=1000",
    )
    response?.value?.forEach((item) => {
      const role = new MappableObjectForFront(item, RoleMappings)
      role.data.permissions = item.ofm_portal_role_permission.map((p) => new MappableObjectForFront(p.ofm_portal_privilege, PermissionMappings).toJSON())
      roles.push(role)
    })
    roles.sort((a, b) => a.data.roleName?.localeCompare(b.data.roleName)).map((role) => role.data)
    Redis.jsonSet('roles', '$', roles).catch((error) => log.error('Could not set roles with Redis', error))
  }
  return roles
}

/*
// TODO (vietle-cgi) - This function is to get report templates for the Report Search Card in Reporting History tab.
// We comment out this function because we currently have only the Monthly Report template. We will add this function back once we have some new report templates.
async function getReportTemplates() {
  let reportTemplates = lookupCache.get('reportTemplates')
  if (!reportTemplates) {
    reportTemplates = []
    const response = await getOperation('ofm_surveies?$select=ofm_surveyid,ofm_name,ofm_version')
    response?.value?.forEach((item) => {
      const report = new MappableObjectForFront(item, ReportTemplateMappings).toJSON()
      reportTemplates.push(report)
    })
    reportTemplates = [...new Set(reportTemplates?.map((template) => template.surveyTemplateName))]
    lookupCache.put('reportTemplates', reportTemplates, ONE_HOUR_MS)
  }
  return reportTemplates
}
*/

async function getBusinessTypes() {
  return fetchAndCacheData('businessTypes', 'ecc_business_type')
}

async function getHealthAuthorities() {
  return fetchAndCacheData('healthAuthorities', 'ecc_health_authorities')
}

async function getFacilityTypes() {
  return fetchAndCacheData('applicationFacilityTypes', 'ofm_facility_type')
}

async function getLicenceTypes() {
  return fetchAndCacheData('licenceTypes', 'ecc_licence_type')
}

async function getPaymentTypes() {
  return fetchAndCacheData('paymentTypes', 'ecc_payment_type')
}

async function getUnions() {
  return fetchAndCacheData('unions', 'ecc_unions')
}

/**
 * Look ups from Dynamics365.
 */
async function getLookupInfo(_req, res) {
  try {
    const [applicationIntakes, requestCategories, requestSubCategories, roles, businessTypes, healthAuthorities, facilityTypes, licenceTypes, paymentTypes, unions] = await Promise.all([
      getApplicationIntakes(),
      getRequestCategories(),
      getRequestSubCategories(),
      getRoles(),
      getBusinessTypes(),
      getHealthAuthorities(),
      getFacilityTypes(),
      getLicenceTypes(),
      // getReportTemplates(),
      getPaymentTypes(),
      getUnions(),
    ])
    const resData = {
      applicationIntakes: applicationIntakes,
      requestCategories: requestCategories,
      requestSubCategories: requestSubCategories,
      roles: roles,
      businessTypes: businessTypes,
      healthAuthorities: healthAuthorities,
      facilityTypes: facilityTypes,
      licenceTypes: licenceTypes,
      // reportTemplates: reportTemplates,
      paymentTypes: paymentTypes,
      unions: unions,
    }
    return res.status(HttpStatus.OK).json(resData)
  } catch (e) {
    handleError(res, e)
  }
}

async function retrieveSystemMessages() {
  let systemMessages
  try {
    systemMessages = await Redis.jsonGet('systemMessages')
  } catch (e) {
    log.error('Could not retrieve the systemMessages from Redis', e)
  }

  if (!systemMessages) {
    systemMessages = []
    const currentTime = new Date().toISOString()
    const response = await getOperation(
      `ofm_system_messages?$select=ofm_message&$filter=(statecode eq 0 and ofm_start_date le ${currentTime} and ofm_end_date ge ${currentTime})&$orderby=ofm_start_date`,
    )
    response?.value?.forEach((item) => systemMessages.push(new MappableObjectForFront(item, SystemMessageMappings)))
    Redis.jsonSet('systemMessages', '$', systemMessages).catch((error) => log.error('Could not set systemMessages with Redis', error))
  }
  return systemMessages
}

async function getSystemMessages(_req, res) {
  try {
    const systemMessages = await retrieveSystemMessages()
    return res.status(HttpStatus.OK).json(systemMessages)
  } catch (e) {
    handleError(res, e)
  }
}

async function hourlyPrecache() {
  if (Redis.isReady) {
    const expireKeys = [
      'applicationIntakes',
      'requestCategories',
      'requestSubCategories',
      'roles',
      'businessTypes',
      'healthAuthorities',
      'applicationFacilityTypes',
      'licenceTypes',
      'paymentTypes',
      'unions',
    ]
    const expired = expireKeys.map((key) => {
      return Redis.expire(key, 0)
    })
    await Promise.all(expired)
    await Promise.all([
      getApplicationIntakes(),
      getRequestCategories(),
      getRequestSubCategories(),
      getRoles(),
      getBusinessTypes(),
      getHealthAuthorities(),
      getFacilityTypes(),
      getLicenceTypes(),
      // getReportTemplates(),
      getPaymentTypes(),
      getUnions(),
    ])
  } else {
    log.info('Cannot run hourly precache without Redis being ready')
  }
}

async function quarterHourPrecache() {
  if (Redis.isReady) {
    await Redis.expire('systemMessages', 0)
    await retrieveSystemMessages()
  } else {
    log.info('Cannot run quarter hour precache without Redis being ready')
  }
}

const preCacheJobs = [
  {
    cron: new CronJob('* 0 * * * *', hourlyPrecache),
    onTick: hourlyPrecache,
  },
  {
    cron: new CronJob('* */15 * * * *', quarterHourPrecache),
    onTick: quarterHourPrecache,
  },
]

async function startCacheJobs() {
  log.info('Starting cache jobs')
  for (const job of preCacheJobs) {
    await job.onTick()
    job.cron.start()
  }
}

function stopCacheJobs() {
  log.info('Stopping cache jobs')
  for (const job of preCacheJobs) {
    job.cron.stop()
  }
}

module.exports = {
  getLookupInfo,
  getRoles,
  getSystemMessages,
  startCacheJobs,
  stopCacheJobs,
}
