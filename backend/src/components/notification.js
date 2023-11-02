'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { NotificationMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const moment = require('moment')
const log = require('./logger')
const { join } = require('path')

function mapNotificationObjectForFront(data) {
  if (data.createdon) {
    data.createdon = new moment(data.createdon).format('YYYY/MM/DD')
  }
  return new MappableObjectForFront(data, NotificationMappings).toJSON()
}

function sortByPropertyDesc(property) {
  return function (a, b) {
    if (a[property] < b[property]) return 1
    else if (a[property] > b[property]) return -1
    return 0
  }
}

async function getNotifications(req, res) {
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
    let notifications = []
    for (const item of operationResponse.value) {
      let notification = mapNotificationObjectForFront(item)
      if (notification.lastOpenedTime) notification['isRead'] = true
      else notification['isRead'] = false
      notifications.push(notification)
    }
    return res.status(HttpStatus.OK).json(notifications)
  } catch (e) {
    log.error('failed with error', e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateNotificationLastOpenedTime(req, res) {
  try {
    let response = await patchOperationWithObjectId('emails', req.params.notificationId, req.body)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getNotifications,
  updateNotificationLastOpenedTime,
}
