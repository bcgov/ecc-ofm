'use strict'
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { MessageMappings, AssistanceRequestMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const moment = require('moment')
const log = require('./logger')
const { join } = require('path')

function mapMessageObjectForFront(data) {
  if (data.createdon) {
    data.createdon = new moment(data.createdon).format('YYYY/MM/DD')
  }
  return new MappableObjectForFront(data, MessageMappings).toJSON()
}

function mapAssistanceRequestObjectForBack(data) {
  let assistanceRequest = new MappableObjectForBack(data, AssistanceRequestMappings).toJSON()
  if (assistanceRequest['ofm_contact_method'] == '1')
    delete assistanceRequest['ofm_telephone']
  assistanceRequest['ofm_request_category@odata.bind'] = `/ofm_request_categories(${data?.requestCategoryId})`
  assistanceRequest['ofm_contact@odata.bind'] = `/contacts(${data?.contactId})`
  return assistanceRequest;
}

function sortByPropertyDesc(property) {
  return function (a, b) {
    if (a[property] < b[property]) return 1
    else if (a[property] > b[property]) return -1
    return 0
  }
}

async function getMessages(req, res) {
  try {
    let operation =
      'emails?$select=description,lastopenedtime,subject,createdon&$expand=email_activity_parties($filter=(_partyid_value eq ' +
      req.params.contactId +
      '))&$filter=(email_activity_parties/any(o1:(o1/_partyid_value eq ' +
      req.params.contactId +
      ')))'
    log.info('operation: ', operation)
    let operationResponse = await getOperation(operation)
    operationResponse.value.sort(sortByPropertyDesc('createdon'))
    let messages = []
    for (const item of operationResponse.value) {
      let message = mapMessageObjectForFront(item)
      if (message.lastOpenedTime) message['isRead'] = true
      else message['isRead'] = false
      messages.push(message)
    }
    return res.status(HttpStatus.OK).json(messages)
  } catch (e) {
    log.error('failed with error', e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateMessageLastOpenedTime(req, res) {
  try {
    let response = await patchOperationWithObjectId('emails', req.params.messageId, req.body);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function createNewAssistanceRequest(req, res) {
  try {
    log.info('THIS IS ASSISTANCE REQUEST BODY');
    log.info(req.body);
    let payload = mapAssistanceRequestObjectForBack(req.body);
    log.info('assistanceRequest after 1st MAPPED');
    log.info(payload);
    let response = await postOperation('ofm_assistance_requests', payload);
    log.info('postResponse AssistanceRequest');
    log.info(response);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.info('THIS IS ERRRORRRRR');
    log.info(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getAllMessages,
  updateMessageLastOpenedTime,
  createNewAssistanceRequest,
};

