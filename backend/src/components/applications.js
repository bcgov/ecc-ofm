'use strict'
const { getOperation, patchOperationWithObjectId, postOperation } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { ApplicationMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

function mapApplicationObjectForFront(data) {
  const application = new MappableObjectForFront(data, ApplicationMappings).toJSON()
  const ministryLastUpdated = new Date(application?.ministryLastUpdated)
  const providerLastUpdated = new Date(application?.providerLastUpdated)
  application.latestActivity = ministryLastUpdated > providerLastUpdated ? ministryLastUpdated : providerLastUpdated
  return application
}

async function getApplicationsByFacilityId(req, res) {
  try {
    const applications = []
    const operation = `ofm_applications?$select=ofm_application,ofm_summary_ministry_last_updated,ofm_summary_provider_last_updated,ofm_summary_submittedon,statuscode,statecode,_ofm_facility_value&$filter=(_ofm_facility_value eq '${req.params.facilityId}' and statuscode ne 2)`
    const response = await getOperation(operation)
    response?.value?.forEach((application) => applications.push(mapApplicationObjectForFront(application)))
    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getApplication(req, res) {
  try {
    const operation = `ofm_applications(${req.params.applicationId})`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(mapApplicationObjectForFront(response))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateApplication(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, ApplicationMappings).toJSON()
    const response = await patchOperationWithObjectId('ofm_applications', req.params.applicationId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createApplication(req, res) {
  try {
    const payload = {
      'ofm_facility@odata.bind': `/accounts(${req.body?.facilityId})`,
    }
    let response = await postOperation('ofm_applications', payload)
    response = new MappableObjectForFront(response, ApplicationMappings).toJSON()
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getApplicationsByFacilityId,
  getApplication,
  updateApplication,
  createApplication,
}
