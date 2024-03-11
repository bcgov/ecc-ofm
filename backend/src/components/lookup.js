'use strict'
const { getOperation, getLabelFromValue } = require('./utils')
const HttpStatus = require('http-status-codes')
const _ = require('lodash')
const cache = require('memory-cache')
const { RequestCategoryMappings, FiscalYearMappings, MonthMappings } = require('../util/mapping/Mappings')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const log = require('../components/logger')

const lookupCache = new cache.Cache()
const ONE_HOUR_MS = 60 * 60 * 1000 // Cache timeout set for one hour

async function getRequestCategories() {
  let requestCategories = lookupCache.get('requestCategories')
  if (!requestCategories) {
    requestCategories = []
    let response = await getOperation('ofm_request_categories')
    response?.value?.forEach((item) => requestCategories.push(new MappableObjectForFront(item, RequestCategoryMappings)))
    lookupCache.put('requestCategories', requestCategories, ONE_HOUR_MS)
  }
  return requestCategories
}

async function getFiscalYears() {
  let fiscalYears = lookupCache.get('fiscalYears')
  if (!fiscalYears) {
    fiscalYears = []
    let response = await getOperation('ofm_fiscal_years?$select=ofm_fiscal_yearid,ofm_caption,ofm_fiscal_year_number,ofm_start_date,ofm_end_date,statuscode,statecode&$orderby=ofm_fiscal_year_number')
    response?.value?.forEach((item) => fiscalYears.push(new MappableObjectForFront(item, FiscalYearMappings)))
    lookupCache.put('fiscalYears', fiscalYears, ONE_HOUR_MS)
  }
  return fiscalYears
}

async function getMonths() {
  let months = lookupCache.get('months')
  if (!months) {
    months = []
    let response = await getOperation('ofm_months?$select=ofm_monthid,ofm_name')
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

async function getUserRoles() {
  return fetchAndCacheData('userRoles', 'ofm_portal_role')
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
    const [requestCategories, userRoles, healthAuthorities, facilityTypes, licenceTypes, reportQuestionTypes, fiscalYears, months] = await Promise.all([
      getRequestCategories(),
      getUserRoles(),
      getHealthAuthorities(),
      getFacilityTypes(),
      getLicenceTypes(),
      getReportQuestionTypes(),
      getFiscalYears(),
      getMonths(),
    ])
    const resData = {
      requestCategories: requestCategories,
      userRoles: userRoles,
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
}
