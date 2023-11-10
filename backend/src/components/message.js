'use strict'
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { AssistanceRequestMappings, AssistanceRequestFacilityMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const { ASSISTANCE_REQUEST_STATUS_CODES } = require('../util/constants')
const moment = require('moment')
const log = require('./logger')
const { sortByPropertyDesc } = require('../util/common')

function mapAssistanceRequestStatusForFront(statusCode) {
  if (ASSISTANCE_REQUEST_STATUS_CODES.OPEN.includes(statusCode)) return 'Open'
  else if (ASSISTANCE_REQUEST_STATUS_CODES.ACTION_REQUIRED.includes(statusCode)) return 'Action Required'
  else if (ASSISTANCE_REQUEST_STATUS_CODES.CLOSED.includes(statusCode)) return 'Closed'
}

function mapAssistanceRequestObjectForFront(data) {
  const assistanceRequest = new MappableObjectForFront(data, AssistanceRequestMappings).toJSON()
  assistanceRequest.status = mapAssistanceRequestStatusForFront(assistanceRequest?.statusCode)
  assistanceRequest.lastUpdatedTime = assistanceRequest?.lastUpdatedTime ? new moment(assistanceRequest.lastUpdatedTime).format('YYYY/MM/DD') : null
  assistanceRequest.requestFacilities = []
  data?.ofm_facility_request_request?.forEach((facility) => assistanceRequest.requestFacilities.push(new MappableObjectForFront(facility, AssistanceRequestFacilityMappings).toJSON()))
  return assistanceRequest
}

function mapAssistanceRequestObjectForBack(data) {
  let assistanceRequest = new MappableObjectForBack(data, AssistanceRequestMappings).toJSON()
  if (assistanceRequest['ofm_contact_method'] === '1') delete assistanceRequest['ofm_telephone']
  assistanceRequest['ofm_request_category@odata.bind'] = `/ofm_request_categories(${data?.requestCategoryId})`
  assistanceRequest['ofm_contact@odata.bind'] = `/contacts(${data?.contactId})`
  assistanceRequest['statuscode'] = 1
  assistanceRequest['ofm_facility_request_request'] = []
  data?.facilities?.forEach((facility) => {
    assistanceRequest['ofm_facility_request_request'].push({
      'ofm_facility@odata.bind': `/accounts(${facility.facilityId})`,
    })
  })
  return assistanceRequest
}

async function createNewAssistanceRequest(req, res) {
  try {
    let payload = mapAssistanceRequestObjectForBack(req.body)
    let response = await postOperation('ofm_assistance_requests?$select=ofm_name', payload)
    response = new MappableObjectForFront(response, AssistanceRequestMappings).toJSON()
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getAssistanceRequests(req, res) {
  try {
    let assistanceRequests = []
    let operation = `ofm_assistance_requests?$expand=ofm_facility_request_request($select=_ofm_facility_value)&$filter=(_ofm_contact_value eq ${req.params.contactId})`
    log.info('operation: ', operation)
    let response = await getOperation(operation)
    response?.value?.sort(sortByPropertyDesc('modifiedon'))
    response?.value?.forEach((item) => assistanceRequests.push(mapAssistanceRequestObjectForFront(item)))
    return res.status(HttpStatus.OK).json(assistanceRequests)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateAssistanceRequest(req, res) {
  try {
    let payload = new MappableObjectForBack(req.body, AssistanceRequestMappings).toJSON()
    let response = await patchOperationWithObjectId('ofm_assistance_requests', req.params.assistanceRequestId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  createNewAssistanceRequest,
  getAssistanceRequests,
  updateAssistanceRequest,
}
