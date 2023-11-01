'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { MessageMappings } = require('../util/mapping/Mappings')
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
      req.params.userId +
      '))&$filter=(email_activity_parties/any(o1:(o1/_partyid_value eq ' +
      req.params.userId +
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
    let response = await patchOperationWithObjectId('emails', req.params.messageId, req.body)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getMessages,
  updateMessageLastOpenedTime,
}
