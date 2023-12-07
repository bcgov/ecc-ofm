'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { ApplicationMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

function mapApplicationObjectForFront(data) {
  let application = new MappableObjectForFront(data, ApplicationMappings).toJSON()
  const ministryLastUpdated = new Date(application?.ministryLastUpdated)
  const providerLastUpdated = new Date(application?.providerLastUpdated)
  application.latestActivity = ministryLastUpdated > providerLastUpdated ? ministryLastUpdated : providerLastUpdated
  return application
}

async function getApplicationsByFacilityId(req, res) {
  try {
    log.debug('getApplicationsByFacilityId: ', req.params.facilityId)
    let applications = []
    const operation = `ofm_applications?$select=ofm_application,ofm_summary_ministry_last_updated,ofm_summary_provider_last_updated,ofm_summary_submittedon,statuscode,_ofm_facility_value&$filter=(_ofm_facility_value eq '${req.params.facilityId}')`
    log.debug('operation: ', operation)
    const response = await getOperation(operation)
    response?.value?.forEach((application) => applications.push(mapApplicationObjectForFront(application)))
    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getApplicationsByFacilityId,
}
