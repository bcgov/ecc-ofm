'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { FacilityMappings, RoleMappings, UserMappings, UsersPermissionsFacilityMappings, LicenceMappings, FacilityAdditionalAddressMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

const log = require('../components/logger')

/**
 * Dynamics can take a selector with a list of fields
 * Use this function to generate a list of fields based on mappings
 */
function getMappingString(mappings) {
  let retVal = mappings
    .map((item) => {
      return item.back
    })
    .join(',')
  return retVal
}

function makeThePayloadPretty(response) {
  //these numbers are specified in Dynamics. There is no 1 or 2 because that
  //is the typical mailing / physical address fields.
  const FIRST_ADDITIONAL_ADDRESS_NUMBER = 3
  const LAST_ADDITIONAL_ADDRESS_NUMBER = 13

  const addressArr = []

  for (let i = FIRST_ADDITIONAL_ADDRESS_NUMBER; i <= LAST_ADDITIONAL_ADDRESS_NUMBER; i++) {
    const addressPrefix = `ofm_additional_address${i}`
    if (response?.[addressPrefix]) {
      addressArr.push({
        address1: response[`ofm_address${i}_line1`],
        address2: response[`ofm_address${i}_line2`],
        city: response[`ofm_address${i}_city`],
        postalCode: response[`ofm_address${i}_postal_code`],
        province: response[`ofm_address${i}_province`],
      })
    }
  }

  return addressArr
}

async function getFacility(req, res) {
  try {
    const facilityMappingString = getMappingString(FacilityMappings)
    const additionalAddressMappingString = getMappingString(FacilityAdditionalAddressMappings)
    const operation = `accounts(${req.params.accountId})?$select=${facilityMappingString},${additionalAddressMappingString}`

    const response = await getOperation(operation)
    const resp = new MappableObjectForFront(response, FacilityMappings).toJSON()
    resp.additionalAddresses = makeThePayloadPretty(response)
    return res.status(HttpStatus.OK).json(resp)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFacilityContacts(req, res) {
  try {
    const operation = `ofm_bceid_facilities?$select=_ofm_facility_value,ofm_is_additional_contact,ofm_is_expense_authority,statuscode,statecode&$expand=ofm_bceid($select=ofm_first_name,ofm_last_name,emailaddress1,telephone1,ccof_username;$expand=ofm_portal_role_id($select=ofm_portal_role_number,ofm_name);)&$filter=(_ofm_facility_value eq ${req?.params?.facilityId}) and (ofm_portal_access eq true) and (statecode eq 0)`
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
