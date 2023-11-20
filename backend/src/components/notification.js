'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { NotificationMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

async function getNotifications(req, res) {
  try {
    const operation =
      'emails?$select=description,lastopenedtime,subject,createdon,ofm_is_read&$expand=email_activity_parties($filter=(_partyid_value eq ' +
      req.params.contactId +
      '))&$filter=(email_activity_parties/any(o1:(o1/_partyid_value eq ' +
      req.params.contactId +
      ')))'
    log.info('operation: ', operation)
    const response = await getOperation(operation)
    let notifications = []
    response?.value?.forEach((item) => notifications.push(new MappableObjectForFront(item, NotificationMappings).toJSON()))
    return res.status(HttpStatus.OK).json(notifications)
  } catch (e) {
    log.error('failed with error', e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateNotification(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, NotificationMappings).toJSON()
    const response = await patchOperationWithObjectId('emails', req.params.notificationId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getNotifications,
  updateNotification,
}
