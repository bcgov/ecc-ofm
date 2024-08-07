'use strict'
const { getOperation, patchOperationWithObjectId, handleError } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { LicenceDetailsMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getLicenceDetails(req, res) {
  try {
    const operation = `ofm_licence_details?$select=ofm_licence_detailid,ofm_licence_type,ofm_licence_spaces,ofm_operational_spaces,ofm_enrolled_spaces,ofm_operation_from_time,ofm_operations_to_time,ofm_operation_hours_from,ofm_operation_hours_to,ofm_week_days,ofm_weeks_in_operation,ofm_care_type,ofm_overnight_care,ofm_apply_room_split_condition,ofm_room_split_details,statuscode,statecode&$filter=(_ofm_licence_value eq ${req.params.licenceId}) and (statecode eq 0)`
    const response = await getOperation(operation)
    const licenceDetails = []
    response?.value?.forEach((item) => {
      const mappedLicenceDetails = new MappableObjectForFront(item, LicenceDetailsMappings).toJSON()
      // XXX (OFMCC-5436) - In CRM, ofm_operation_from_time (ofm_operations_to_time) gets the hours from ofm_operation_hours_from (ofm_operation_hours_to).
      // If ofm_operation_hours_from (ofm_operation_hours_to) is null, CRM set ofm_operation_from_time (ofm_operations_to_time) to 12:00 AM as default.
      // Therefore, we need this logic to overwrite that default value.
      mappedLicenceDetails.operationFromTime = mappedLicenceDetails.updatableOperationFromTime ? mappedLicenceDetails.operationFromTime : null
      mappedLicenceDetails.operationToTime = mappedLicenceDetails.updatableOperationToTime ? mappedLicenceDetails.operationToTime : null
      licenceDetails.push(mappedLicenceDetails)
    })
    return res.status(HttpStatus.OK).json(licenceDetails)
  } catch (e) {
    handleError(res, e)
  }
}

async function updateLicenceDetails(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, LicenceDetailsMappings).toJSON()
    const response = await patchOperationWithObjectId('ofm_licence_details', req.params.licenceDetailId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getLicenceDetails,
  updateLicenceDetails,
}
