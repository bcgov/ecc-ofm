'use strict'
const { getOperation, getLabelFromValue } = require('./utils')
const HttpStatus = require('http-status-codes')
const _ = require('lodash')
const cache = require('memory-cache')
const { RequestCategoryMappings } = require('../util/mapping/Mappings')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const log = require('../components/logger')

const lookupCache = new cache.Cache()

async function getRequestCategories() {
  let requestCategories = lookupCache.get('requestCategories')
  if (!requestCategories) {
    requestCategories = []
    let response = await getOperation('ofm_request_categories')
    response?.value?.forEach((item) => requestCategories.push(new MappableObjectForFront(item, RequestCategoryMappings)))
    lookupCache.put('requestCategories', requestCategories, 60 * 60 * 1000)
  }
  return requestCategories
}

async function getUserRoles() {
  let userRoles = lookupCache.get('userRoles')
  if (!userRoles) {
    userRoles = []
    let response = await getOperation('GlobalOptionSetDefinitions(Name=%27ofm_portal_role%27)?$Select=Options')
    userRoles = response?.Options?.map((item) => ({
      id: Number(item.Value),
      description: item.Label && item.Label.LocalizedLabels ? item.Label.LocalizedLabels[0].Label : null,
    }))
    lookupCache.put('userRoles', userRoles, 60 * 60 * 1000)
  }
  return userRoles
}

/**
 * Look ups from Dynamics365.
 */
async function getLookupInfo(req, res) {
  try {
    let resData = lookupCache.get('lookups')
    if (!resData) {
      let requestCategories = await getRequestCategories()
      let userRoles = await getUserRoles()
      resData = {
        requestCategories: requestCategories,
        userRoles: userRoles,
      }
      lookupCache.put('lookups', resData, 60 * 60 * 1000)
    }
    return res.status(HttpStatus.OK).json(resData)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getLookupInfo,
}
