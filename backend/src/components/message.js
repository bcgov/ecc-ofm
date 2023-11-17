'use strict'
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { AssistanceRequestMappings, AssistanceRequestFacilityMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const { ASSISTANCE_REQUEST_STATUS_CODES } = require('../util/constants')
const log = require('./logger')

function mapAssistanceRequestStatusForFront(statusCode) {
  if (ASSISTANCE_REQUEST_STATUS_CODES.OPEN.includes(statusCode)) {
    return 'Open'
  } else if (ASSISTANCE_REQUEST_STATUS_CODES.ACTION_REQUIRED.includes(statusCode)) {
    return 'Action required'
  } else if (ASSISTANCE_REQUEST_STATUS_CODES.CLOSED.includes(statusCode)) {
    return 'Closed'
  }
}

function mapAssistanceRequestPriorityForFront(status) {
  switch (status) {
    case 'Action required':
      return 3
    case 'Open':
      return 2
    case 'Closed':
      return 1
  }
}

function mapAssistanceRequestObjectForFront(data) {
  const assistanceRequest = new MappableObjectForFront(data, AssistanceRequestMappings).toJSON()
  assistanceRequest.status = mapAssistanceRequestStatusForFront(assistanceRequest?.statusCode)
  assistanceRequest.priority = mapAssistanceRequestPriorityForFront(assistanceRequest?.status)
  assistanceRequest.requestFacilities = []
  data?.ofm_facility_request_request?.forEach((facility) => assistanceRequest.requestFacilities.push(new MappableObjectForFront(facility, AssistanceRequestFacilityMappings).toJSON()))
  assistanceRequest.lastConversationTime = null
  data?.ofm_conversation_request?.forEach((conversation) => {
    if (assistanceRequest.lastConversationTime) {
      assistanceRequest.lastConversationTime = assistanceRequest.lastConversationTime < conversation.modifiedon ? conversation.modifiedon : assistanceRequest.lastConversationTime
    } else {
      assistanceRequest.lastConversationTime = conversation.modifiedon
    }
  })
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

async function createAssistanceRequest(req, res) {
  try {
    let payload = mapAssistanceRequestObjectForBack(req.body)
    let response = await postOperation('ofm_assistance_requests?$select=ofm_name,ofm_assistance_requestid', payload)
    response = new MappableObjectForFront(response, AssistanceRequestMappings).toJSON()
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getAssistanceRequests(req, res) {
  try {
    let assistanceRequests = []
    let operation = `ofm_assistance_requests?$select=modifiedon,ofm_assistance_requestid,ofm_last_opened_time,ofm_name,_ofm_request_category_value,ofm_subject,statecode,statuscode,ofm_is_read&$expand=ofm_facility_request_request($select=_ofm_facility_value),ofm_conversation_request($select=modifiedon)&$filter=(_ofm_contact_value eq ${req.params.contactId}) and (ofm_facility_request_request/any(o1:(o1/ofm_facility_requestid ne null))) and (ofm_conversation_request/any(o2:(o2/ofm_conversationid ne null)))`
    log.info('operation: ', operation)
    let response = await getOperation(operation)
    response?.value?.forEach((item) => assistanceRequests.push(mapAssistanceRequestObjectForFront(item)))
    return res.status(HttpStatus.OK).json(assistanceRequests)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getAssistanceRequest(req, res) {
  try {
    let operation = `ofm_assistance_requests(${req.params.assistanceRequestId})?$select=modifiedon,ofm_assistance_requestid,ofm_last_opened_time,ofm_name,_ofm_request_category_value,ofm_subject,statecode,statuscode,ofm_is_read&$expand=ofm_facility_request_request($select=_ofm_facility_value),ofm_conversation_request($select=modifiedon)`
    log.info('operation: ', operation)
    let response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(mapAssistanceRequestObjectForFront(response))
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
  createAssistanceRequest,
  getAssistanceRequests,
  getAssistanceRequest,
  updateAssistanceRequest,
}
