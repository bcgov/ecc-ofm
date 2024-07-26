'use strict'
const { getOperation } = require('./utils')
const HttpStatus = require('http-status-codes')
const cache = require('memory-cache')
const { SystemMessageMappings } = require('../util/mapping/Mappings')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const log = require('./logger')

const publicCache = new cache.Cache()
const ONE_HOUR_MS = 60 * 60 * 1000 // Cache timeout set for one hour

async function getSystemMessages(_req, res) {
  try {
    let systemMessages = publicCache.get('systemMessages')
    if (!systemMessages) {
      systemMessages = []
      const currentTime = new Date().toISOString()
      const response = await getOperation(
        `ofm_system_messages?$select=ofm_message&$filter=(statecode eq 0 and ofm_start_date le ${currentTime} and ofm_end_date ge ${currentTime})&$orderby=ofm_start_date`,
      )
      response?.value?.forEach((item) => systemMessages.push(new MappableObjectForFront(item, SystemMessageMappings)))
      publicCache.put('systemMessages', systemMessages, ONE_HOUR_MS)
    }
    return res.status(HttpStatus.OK).json(systemMessages)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getSystemMessages,
}
