'use strict'
const { getOperation, getLabelFromValue } = require('./utils')
const HttpStatus = require('http-status-codes')
const _ = require('lodash')
const cache = require('memory-cache')
const { PermissionMappings, RequestCategoryMappings, RequestSubCategoryMappings, RoleMappings, FiscalYearMappings, MonthMappings } = require('../util/mapping/Mappings')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const log = require('../components/logger')

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

async function getFiscalYears() {
  let fiscalYears = lookupCache.get('fiscalYears')
  if (!fiscalYears) {
    fiscalYears = []
    const response = await getOperation(
      'ofm_fiscal_years?$select=ofm_fiscal_yearid,ofm_caption,ofm_fiscal_year_number,ofm_start_date,ofm_end_date,statuscode,statecode&$orderby=ofm_fiscal_year_number',
    )
    response?.value?.forEach((item) => fiscalYears.push(new MappableObjectForFront(item, FiscalYearMappings)))
    lookupCache.put('fiscalYears', fiscalYears, ONE_HOUR_MS)
  }
  return fiscalYears
}

async function getMonths() {
  let months = lookupCache.get('months')
  if (!months) {
    months = []
    const response = await getOperation('ofm_months?$select=ofm_monthid,ofm_name')
    response?.value?.forEach((item) => months.push(new MappableObjectForFront(item, MonthMappings)))
    lookupCache.put('months', months, ONE_HOUR_MS)
  }
  return months
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

async function getRoles() {
  let roles = lookupCache.get('roles')
  if (!roles) {
    roles = []
    const response = await getOperation(
      'ofm_portal_roles?$select=ofm_name,ofm_portal_role_number&$expand=ofm_portal_role_permission($select=ofm_portal_permissionid,ofm_portal_privilege;$expand=ofm_portal_privilege($select=ofm_portal_privilege_number,ofm_category,ofm_name))&pageSize=100',
    )
    response?.value?.forEach((item) => {
      const role = new MappableObjectForFront(item, RoleMappings)
      role.data.permissions = item.ofm_portal_role_permission.map((p) => new MappableObjectForFront(p.ofm_portal_privilege, PermissionMappings).toJSON())
      roles.push(role)
    })
    roles = roles.sort((a, b) => a.data.roleName?.localeCompare(b.data.roleName))
    lookupCache.put('roles', roles, ONE_HOUR_MS)
  }
  return roles
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

async function getReportQuestionTypes() {
  return fetchAndCacheData('reportQuestionTypes', 'ofm_reportingquestiontype')
}

/**
 * Look ups from Dynamics365.
 */
async function getLookupInfo(_req, res) {
  try {
    const [requestCategories, requestSubCategories, roles, healthAuthorities, facilityTypes, licenceTypes, reportQuestionTypes, fiscalYears, months] = await Promise.all([
      getRequestCategories(),
      getRequestSubCategories(),
      getRoles(),
      getHealthAuthorities(),
      getFacilityTypes(),
      getLicenceTypes(),
      getReportQuestionTypes(),
      getFiscalYears(),
      getMonths(),
    ])
    const resData = {
      requestCategories: requestCategories,
      requestSubCategories: requestSubCategories,
      roles: roles,
      healthAuthorities: healthAuthorities,
      facilityTypes: facilityTypes,
      licenceTypes: licenceTypes,
      reportQuestionTypes: reportQuestionTypes,
      fiscalYears: fiscalYears,
      months: months,
    }
    return res.status(HttpStatus.OK).json(resData)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getLookupInfo,
  getRoles,
}
