'use strict'
const { getOperation, patchOperationWithObjectId, getOperationWithObjectId, handleError } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { buildDateFilterQuery, buildFilterQuery, getMappingString } = require('../util/common')
const {  TopUpMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')



async function getTopUpFundingByCurrentFacility(facilityFilter){
  const operation =  `ofm_top_up_funds?$select=${getMappingString(TopUpMappings)}&$filter=${facilityFilter}`
  const response = (await getOperation(operation))?.value

  if (isEmpty(response)) return []

  const topUps = []

  response.forEach(item => {
    topUps.push(new MappableObjectForFront(item, TopUpMappings).toJSON())
  })

  return topUps
}


module.exports = {
  getTopUpFundingByCurrentFacility,
}