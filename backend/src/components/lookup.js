'use strict'
const { getOperation } = require('./utils')
const HttpStatus = require('http-status-codes')
const _ = require('lodash')
const cache = require('memory-cache')
const {
  ApplicationIntakeMappings,
  FacilityIntakeMappings,
  PermissionMappings,
  RequestCategoryMappings,
  RequestSubCategoryMappings,
  RoleMappings,
  // ReportTemplateMappings,
} = require('../util/mapping/Mappings')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const log = require('./logger')

const lookupCache = new cache.Cache()
const ONE_HOUR_MS = 60 * 60 * 1000 // Cache timeout set for one hour

async function getRequestCategories() {
  let requestCategories = lookupCache.get('requestCategories')
  if (!requestCategories) {
    requestCategories = []
    const response = await getOperation('ofm_request_categories')
    response?.value?.forEach((item) => requestCategories.push(new MappableObjectForFront(item, RequestCategoryMappings)))
    lookupCache.put('requestCategories', requestCategories, ONE_HOUR_MS)
  }
  return requestCategories
}

async function getRequestSubCategories() {
  let requestSubCategories = lookupCache.get('requestSubCategories')
  if (!requestSubCategories) {
    requestSubCategories = []
    const response = await getOperation('ofm_subcategories?$orderby=ofm_display_order')
    response?.value?.forEach((item) => requestSubCategories.push(new MappableObjectForFront(item, RequestSubCategoryMappings)))
    lookupCache.put('requestSubCategories', requestSubCategories, ONE_HOUR_MS)
  }
  return requestSubCategories
}

async function fetchAndCacheData(cacheKey, operationName) {
  let data = lookupCache.get(cacheKey)
  if (!data) {
    try {
      const response = await getOperation(`GlobalOptionSetDefinitions(Name='${operationName}')`)
      data =
        response?.Options?.map((item) => ({
          id: Number(item.Value),
          description: item.Label?.LocalizedLabels?.[0]?.Label ?? null,
        })) || []
      lookupCache.put(cacheKey, data, ONE_HOUR_MS)
    } catch (error) {
      log.error(`Error fetching data for ${cacheKey}:`, error)
    }
  }
  return data
}

async function getApplicationIntakes() {
  let applicationIntakes = lookupCache.get('applicationIntakes')
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
    lookupCache.put('applicationIntakes', applicationIntakes, ONE_HOUR_MS)
  }
  return applicationIntakes
}

async function getRoles() {
  let roles = lookupCache.get('roles')
  if (!roles) {
    roles = []
    const response = await getOperation(
      'ofm_portal_roles?$select=ofm_name,ofm_portal_role_number&$expand=ofm_portal_role_permission($select=ofm_portal_permissionid,ofm_portal_privilege;$filter=statecode eq 0;$expand=ofm_portal_privilege($select=ofm_portal_privilege_number,ofm_category,ofm_name;$filter=statecode eq 0))&pageSize=100&$filter=(statecode eq 0)',
    )
    response?.value?.forEach((item) => {
      const role = new MappableObjectForFront(item, RoleMappings)
      role.data.permissions = item.ofm_portal_role_permission.map((p) => new MappableObjectForFront(p.ofm_portal_privilege, PermissionMappings).toJSON())
      roles.push(role)
    })
    roles.sort((a, b) => a.data.roleName?.localeCompare(b.data.roleName))
    lookupCache.put('roles', roles, ONE_HOUR_MS)
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

/**
 * Look ups from Dynamics365.
 */
async function getLookupInfo(_req, res) {
  try {
    const [applicationIntakes, requestCategories, requestSubCategories, roles, healthAuthorities, facilityTypes, licenceTypes, paymentTypes] = await Promise.all([
      getApplicationIntakes(),
      getRequestCategories(),
      getRequestSubCategories(),
      getRoles(),
      getHealthAuthorities(),
      getFacilityTypes(),
      getLicenceTypes(),
      // getReportTemplates(),
      getPaymentTypes(),
    ])
    const resData = {
      applicationIntakes: applicationIntakes,
      requestCategories: requestCategories,
      requestSubCategories: requestSubCategories,
      roles: roles,
      healthAuthorities: healthAuthorities,
      facilityTypes: facilityTypes,
      licenceTypes: licenceTypes,
      // reportTemplates: reportTemplates,
      paymentTypes: paymentTypes,
    }
    return res.status(HttpStatus.OK).json(resData)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getLookupInfo,
  getRoles,
}
