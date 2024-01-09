'use strict'
const { getOperation } = require('./utils')
const { MappableObjectForFront } = require('../util/mapping/MappableObject')
const { FacilityMappings, UserMappings, LicenceMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getFacility(req, res) {
  try {
    const operation = `accounts(${req.params.accountId})?$select=accountid,accountnumber,name,telephone1,telephone2,emailaddress1,address1_line1,address1_line2,address1_city,address1_postalcode,address1_stateorprovince,ofm_is_mailing_address_different,address2_line1,address2_line2,address2_city,address2_postalcode,address2_stateorprovince,statecode,statuscode`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, FacilityMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFacilityContacts(req, res) {
  try {
    const operation = `ofm_bceid_facilities?$select=_ofm_facility_value&$expand=ofm_bceid($select=ofm_first_name,ofm_is_expense_authority,ofm_is_primary_contact,ofm_last_name,ofm_portal_role)&$filter=(_ofm_facility_value eq ${req.params.facilityId}) and (ofm_bceid/ofm_is_expense_authority eq true or ofm_bceid/ofm_is_primary_contact eq true) and (ofm_portal_access eq true)`
    const response = await getOperation(operation)
    const contacts = []
    response?.value?.forEach((item) => contacts.push(new MappableObjectForFront(item.ofm_bceid, UserMappings).toJSON()))
    return res.status(HttpStatus.OK).json(contacts)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFacilityLicences(req, res) {
  try {
    const operation = `ofm_licences?$select=ofm_health_authority,ofm_licence,ofm_licenceid,statuscode&$filter=(_ofm_facility_value eq ${req.params.facilityId}) and (statuscode eq 1)`
    const response = await getOperation(operation)
    const licences = []
    response?.value?.forEach((item) => licences.push(new MappableObjectForFront(item, LicenceMappings).toJSON()))
    return res.status(HttpStatus.OK).json(licences)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFacility,
  getFacilityContacts,
  getFacilityLicences,
}
