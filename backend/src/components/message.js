'use strict'
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { AssistanceRequestMappings, AssistanceRequestFacilityMappings, AssistanceRequestConversationMappings } = require('../util/mapping/Mappings')
const log = require('./logger')
const HttpStatus = require('http-status-codes')
const { ASSISTANCE_REQUEST_STATUS_CODES } = require('../util/constants')
const { getMappingString } = require('../util/common')

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
  //Dynamics returns number of docs on assistance request. Convert to a bool to be used as a flag on the frontend
  assistanceRequest.hasDocuments = !!assistanceRequest.hasDocuments
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
  if (data?.subCategories) {
    const payloadTemplate = '{"id":"subCategoryId","entityType":"ofm_subcategory","name":"subCategoryName"},'
    let payload = ''
    data?.subCategories?.forEach((subCategory) => {
      payload = payload + payloadTemplate.replace('subCategoryId', subCategory.subCategoryId).replace('subCategoryName', subCategory.subCategoryName)
    })
    assistanceRequest['ofm_subcategory'] = '[' + payload.substring(0, payload.length - 1) + ']'
  }
  return assistanceRequest
}

async function createAssistanceRequest(req, res) {
  try {
    const payload = mapAssistanceRequestObjectForBack(req.body)
    let response = await postOperation('ofm_assistance_requests?$select=ofm_name,ofm_assistance_requestid', payload)
    response = new MappableObjectForFront(response, AssistanceRequestMappings).toJSON()
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createAssistanceRequestConversation(req, res) {
  try {
    const payload = `{
      "ofm_message": "${req.body?.message}",
      "ofm_request@odata.bind": "/ofm_assistance_requests(${req.body?.assistanceRequestId})"
    }`
    const response = await postOperation('ofm_conversations', payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getAssistanceRequests(req, res) {
  try {
    let assistanceRequests = []
    const operation = `ofm_assistance_requests?$select=${getMappingString(AssistanceRequestMappings)}&$expand=ofm_facility_request_request($select=_ofm_facility_value),ofm_conversation_request($select=modifiedon)&$filter=(_ofm_contact_value eq ${req?.query?.contactId}) and (ofm_facility_request_request/any(o1:(o1/ofm_facility_requestid ne null))) and (ofm_conversation_request/any(o2:(o2/ofm_conversationid ne null)))&pageSize=500`
    const response = await getOperation(operation)
    response?.value?.forEach((item) => assistanceRequests.push(mapAssistanceRequestObjectForFront(item)))
    return res.status(HttpStatus.OK).json(assistanceRequests)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getAssistanceRequest(req, res) {
  try {
    const operation = `ofm_assistance_requests(${req.params.assistanceRequestId})?$select=${getMappingString(AssistanceRequestMappings)}&$expand=ofm_facility_request_request($select=_ofm_facility_value),ofm_conversation_request($select=modifiedon)`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(mapAssistanceRequestObjectForFront(response))
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateAssistanceRequest(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, AssistanceRequestMappings).toJSON()
    const response = await patchOperationWithObjectId('ofm_assistance_requests', req.params.assistanceRequestId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getAssistanceRequestConversation(req, res) {
  try {
    const operation = `ofm_conversations?$select=ofm_conversationid,ofm_name,createdon,ofm_message,ofm_source_system,_ofm_request_value,_ownerid_value,statecode,statuscode&$expand=createdby($select=firstname,lastname)&$filter=(_ofm_request_value eq ${req.params.assistanceRequestId})&$orderby=createdon desc`
    const response = await getOperation(operation)
    const messages = []
    for (const item of response.value) {
      let assistanceRequestConversation = new MappableObjectForFront(item, AssistanceRequestConversationMappings).toJSON()
      messages.push(assistanceRequestConversation)
    }
    return res.status(HttpStatus.OK).json(messages)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  createAssistanceRequest,
  getAssistanceRequests,
  getAssistanceRequest,
  updateAssistanceRequest,
  createAssistanceRequestConversation,
  getAssistanceRequestConversation,
}
