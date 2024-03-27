'use strict'
const { getOperation, getLabelFromValue } = require('./utils')
const HttpStatus = require('http-status-codes')
const _ = require('lodash')
const cache = require('memory-cache')
const { RequestCategoryMappings, RequestSubCategoryMappings } = require('../util/mapping/Mappings')
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

async function getRequestSubCategories() {
  let requestSubCategories = lookupCache.get('requestSubCategories')
  if (!requestSubCategories) {
    requestSubCategories = []
    let response = await getOperation('ofm_subcategories')
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

/**
 * Look ups from Dynamics365.
 */
async function getLookupInfo(_req, res) {
  try {
    const [requestCategories, requestSubCategories, userRoles, healthAuthorities, facilityTypes, licenceTypes] = await Promise.all([
      getRequestCategories(),
      getRequestSubCategories(),
      getUserRoles(),
      getHealthAuthorities(),
      getFacilityTypes(),
      getLicenceTypes(),
    ])
    const resData = {
      requestCategories: requestCategories,
      requestSubCategories: requestSubCategories,
      userRoles: userRoles,
      healthAuthorities: healthAuthorities,
      facilityTypes: facilityTypes,
      licenceTypes: licenceTypes,
    }
    return res.status(HttpStatus.OK).json(resData)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getLookupInfo,
}
