'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { FacilityMappings, RoleMappings, UserMappings, UsersPermissionsFacilityMappings, LicenceMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getFacility(req, res) {
  try {
    const operation = `accounts(${req.params.accountId})?$select=accountid,_ofm_primarycontact_value,accountnumber,name,telephone1,telephone2,emailaddress1,address1_line1,address1_line2,address1_city,address1_postalcode,address1_stateorprovince,ofm_is_mailing_address_different,address2_line1,address2_line2,address2_city,address2_postalcode,address2_stateorprovince,statecode,statuscode,ofm_program,ofm_ccof_requirement`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, FacilityMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFacilityContacts(req, res) {
  try {
    const operation = `ofm_bceid_facilities?$select=_ofm_facility_value,ofm_is_additional_contact,ofm_is_expense_authority,statuscode,statecode&$expand=ofm_bceid($select=ofm_first_name,ofm_last_name,ofm_portal_role,emailaddress1,telephone1,ccof_username;$expand=ofm_portal_role_id($select=ofm_portal_role_number,ofm_name);)&$filter=(_ofm_facility_value eq ${req?.params?.facilityId}) and (ofm_portal_access eq true) and (statecode eq 0)`
    const response = await getOperation(operation)
    const contacts = []
    response?.value?.forEach((item) => {
      const user = new MappableObjectForFront(item.ofm_bceid, UserMappings).toJSON()
      if (user?.role) {
        const role = new MappableObjectForFront(user?.role, RoleMappings).toJSON()
        user.role = role
      }
      contacts.push({
        ...new MappableObjectForFront(item, UsersPermissionsFacilityMappings).toJSON(),
        ...user,
      })
    })
    return res.status(HttpStatus.OK).json(contacts)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFacilityLicences(req, res) {
  try {
    const operation = `ofm_licences?$select=ofm_health_authority,ofm_licence,ofm_licenceid,ofm_tdad_funding_agreement_number,ofm_accb_providerid,ofm_ccof_organizationid,ofm_ccof_facilityid,statuscode,statecode&$filter=(_ofm_facility_value eq ${req.params.facilityId}) and (statecode eq 0)`
    const response = await getOperation(operation)
    const licences = []
    response?.value?.forEach((item) => licences.push(new MappableObjectForFront(item, LicenceMappings).toJSON()))
    return res.status(HttpStatus.OK).json(licences)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateFacilityPrimaryContact(req, res) {
  try {
    const payload = {}
    const primaryContactId = Object.keys(req.body)[0]
    payload['ofm_primarycontact@odata.bind'] = `/contacts(${primaryContactId})`
    const response = await patchOperationWithObjectId('accounts', req.params.facilityId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateFacility(req, res) {
  const payload = new MappableObjectForBack(req.body, FacilityMappings).toJSON()
  try {
    const response = await patchOperationWithObjectId('accounts', req.params.facilityId, payload)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, FacilityMappings))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFacility,
  getFacilityContacts,
  getFacilityLicences,
  updateFacilityPrimaryContact,
  updateFacility,
}
