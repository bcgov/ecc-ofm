'use strict'
const { getOperation, patchOperationWithObjectId, getOperationWithObjectId, handleError } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { buildDateFilterQuery, buildFilterQuery, getMappingString } = require('../util/common')
const { TopUpMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')

async function getTopUpFundingByCurrentFacility(facilityFilter) {
  const operation = `ofm_top_up_funds?$select=${getMappingString(TopUpMappings)}&$filter=${facilityFilter}`
  const response = (await getOperation(operation))?.value

  if (isEmpty(response)) return []

  const topUps = []

  response.forEach((item) => {
    topUps.push(new MappableObjectForFront(item, TopUpMappings).toJSON())
  })

  return topUps
}
async function getTopUpFundingApplications(req, res) {
  try {
    const topUps = []
    const operation = `ofm_top_up_funds?$filter=(${buildFilterQuery(req?.query, TopUpMappings)})`
    const response = (await getOperation(operation))?.value

    response.forEach((item) => {
      topUps.push(new MappableObjectForFront(item, TopUpMappings).toJSON())
    })

    return topUps
  } catch (e) {
    handleError(res, e)
  }
}

async function getTopUpFundingPDF(req, res) {
  try {
    const operation = `ofm_top_up_funds(${req.params.topUpFundingId})/ofm_top_up_pdf`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    handleError(res, e)
  }
}

async function getTopUpFundingByID(req, res) {
  try {
    const operation = `ofm_top_up_funds(${req.params.topUpFundingId})`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, TopUpMappings).toJSON())
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getTopUpFundingByCurrentFacility,
  getTopUpFundingApplications,
  getTopUpFundingPDF,
  getTopUpFundingByID,
}
