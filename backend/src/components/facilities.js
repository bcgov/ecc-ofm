'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { FacilityMappings, RoleMappings, UserMappings, UsersPermissionsFacilityMappings, LicenceMappings } = require('../util/mapping/Mappings')
const { getMappingString } = require('../util/common')
const HttpStatus = require('http-status-codes')

function formatPayload(response) {
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

const FacilityAdditionalAddressFields = [
  'ofm_additional_address3',
  'ofm_address3_line1',
  'ofm_address3_line2',
  'ofm_address3_city',
  'ofm_address3_postal_code',
  'ofm_address3_province',
  'ofm_additional_address4',
  'ofm_address4_line1',
  'ofm_address4_line2',
  'ofm_address4_city',
  'ofm_address4_postal_code',
  'ofm_address4_province',
  'ofm_additional_address5',
  'ofm_address5_line1',
  'ofm_address5_line2',
  'ofm_address5_city',
  'ofm_address5_postal_code',
  'ofm_address5_province',
  'ofm_additional_address6',
  'ofm_address6_line1',
  'ofm_address6_line2',
  'ofm_address6_city',
  'ofm_address6_postal_code',
  'ofm_address6_province',
  'ofm_additional_address7',
  'ofm_address7_line1',
  'ofm_address7_line2',
  'ofm_address7_city',
  'ofm_address7_postal_code',
  'ofm_address7_province',
  'ofm_additional_address8',
  'ofm_address8_line1',
  'ofm_address8_line2',
  'ofm_address8_city',
  'ofm_address8_postal_code',
  'ofm_address8_province',
  'ofm_additional_address9',
  'ofm_address9_line1',
  'ofm_address9_line2',
  'ofm_address9_city',
  'ofm_address9_postal_code',
  'ofm_address9_province',
  'ofm_additional_address10',
  'ofm_address10_line1',
  'ofm_address10_line2',
  'ofm_address10_city',
  'ofm_address10_postal_code',
  'ofm_address10_province',
  'ofm_additional_address11',
  'ofm_address11_line1',
  'ofm_address11_line2',
  'ofm_address11_city',
  'ofm_address11_postal_code',
  'ofm_address11_province',
  'ofm_additional_address12',
  'ofm_address12_line1',
  'ofm_address12_line2',
  'ofm_address12_city',
  'ofm_address12_postal_code',
  'ofm_address12_province',
  'ofm_additional_address13',
  'ofm_address13_line1',
  'ofm_address13_line2',
  'ofm_address13_city',
  'ofm_address13_postal_code',
  'ofm_address13_province',
]

async function getFacility(req, res) {
  try {
    const facilityMappingString = getMappingString(FacilityMappings)
    const operation = `accounts(${req.params.accountId})?$select=${facilityMappingString},${FacilityAdditionalAddressFields.join(',')}`
    const response = await getOperation(operation)
    const resp = new MappableObjectForFront(response, FacilityMappings).toJSON()
    resp.additionalAddresses = formatPayload(response)
    return res.status(HttpStatus.OK).json(resp)
  } catch (e) {
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
