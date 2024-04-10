'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { LicenceDetailsMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')

async function getLicenceDetails(req, res) {
  try {
    const operation = `ofm_licence_details?$select=ofm_licence_detailid,ofm_licence_type,ofm_licence_spaces,ofm_operational_spaces,ofm_enrolled_spaces,ofm_operation_from_time,ofm_operations_to_time,ofm_week_days,ofm_weeks_in_operation,ofm_care_type,ofm_overnight_care,ofm_apply_room_split_condition,ofm_room_split_details,statuscode,statecode&$filter=(_ofm_licence_value eq ${req.params.licenceId}) and (statecode eq 0)`
    const response = await getOperation(operation)
    const licenceDetails = []
    response?.value?.forEach((item) => licenceDetails.push(new MappableObjectForFront(item, LicenceDetailsMappings).toJSON()))
    return res.status(HttpStatus.OK).json(licenceDetails)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateLicenceDetails(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, LicenceDetailsMappings).toJSON()
    const response = await patchOperationWithObjectId('ofm_licence_details', req.params.licenceDetailId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getLicenceDetails,
  updateLicenceDetails,
}
