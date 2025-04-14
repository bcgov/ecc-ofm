'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { FacilityMappings, RoleMappings, UserMappings, UsersPermissionsFacilityMappings, LicenceMappings } = require('../util/mapping/Mappings')
const { FUNDING_AGREEMENT_STATUS_CODES } = require('../util/constants')
const { getMappingString } = require('../util/common')
const log = require('./logger')
const HttpStatus = require('http-status-codes')

//these numbers are specified in Dynamics. There is no 1 or 2 because that
//is the typical mailing / physical address fields.
const FIRST_ADDITIONAL_ADDRESS_NUMBER = 3
const LAST_ADDITIONAL_ADDRESS_NUMBER = 13
const FA_EXPIRING_DAYS = 120
const FA_EXPIRED_DAYS = 30
const RENEWAL_SUBMITTED_DAYS = 150

function formatPayload(response) {
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

function formatQueryString() {
  const fields = []
  for (let i = FIRST_ADDITIONAL_ADDRESS_NUMBER; i <= LAST_ADDITIONAL_ADDRESS_NUMBER; i++) {
    fields.push(`ofm_additional_address${i}`, `ofm_address${i}_line1`, `ofm_address${i}_line2`, `ofm_address${i}_city`, `ofm_address${i}_postal_code`, `ofm_address${i}_province`)
  }
  return fields.join(',')
}

async function getFacility(req, res) {
  try {
    const facilityMappingString = getMappingString(FacilityMappings)
    const operation = `accounts(${req.params.facilityId})?$select=${facilityMappingString},${formatQueryString()}`
    const response = await getOperation(operation)
    const resp = new MappableObjectForFront(response, FacilityMappings).toJSON()
    resp.additionalAddresses = formatPayload(response)
    return res.status(HttpStatus.OK).json(resp)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFacilityContacts(req, res) {
  try {
    const contacts = await getRawFacilityContacts(req?.params?.facilityId)
    return res.status(HttpStatus.OK).json(contacts)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getRawFacilityContacts(facilityId) {
  const operation = `ofm_bceid_facilities?$select=_ofm_facility_value,ofm_is_additional_contact,ofm_is_expense_authority,statuscode,statecode&$expand=ofm_bceid($select=ofm_first_name,ofm_last_name,emailaddress1,telephone1,ccof_username;$expand=ofm_portal_role_id($select=ofm_portal_role_number,ofm_name);)&$filter=(_ofm_facility_value eq ${facilityId}) and (ofm_portal_access eq true) and (statecode eq 0)`
  const response = await getOperation(operation)
  const contacts = []

  response?.value?.forEach((item) => {
    const user = new MappableObjectForFront(item.ofm_bceid, UserMappings).toJSON()
    if (user?.role) {
      const role = new MappableObjectForFront(user?.role, RoleMappings).toJSON()
      user.role = role
    }
    const facilityInfo = new MappableObjectForFront(item, UsersPermissionsFacilityMappings).toJSON()

    contacts.push({
      ...facilityInfo,
      ...user,
    })
  })
  return contacts
}

async function getFacilityLicences(req, res) {
  try {
    const operation = `ofm_licences?$select=ofm_health_authority,ofm_licence,ofm_licenceid,ofm_tdad_funding_agreement_number,ofm_accb_providerid,ofm_ccof_organizationid,ofm_ccof_facilityid,statuscode,statecode&$filter=(_ofm_facility_value eq ${req.params.facilityId}) and (statecode eq 0)`
    const response = await getOperation(operation)
    const licences = []
    response?.value?.forEach((item) => licences.push(new MappableObjectForFront(item, LicenceMappings).toJSON()))
    return res.status(HttpStatus.OK).json(licences)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateFacility(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, FacilityMappings).toJSON()
    if ('_ofm_primarycontact_value' in payload) {
      payload['ofm_primarycontact@odata.bind'] = payload['_ofm_primarycontact_value'] ? `/contacts(${payload['_ofm_primarycontact_value']})` : null
      delete payload['_ofm_primarycontact_value']
    }
    const response = await patchOperationWithObjectId('accounts', req.params.facilityId, payload)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, FacilityMappings))
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}
async function getFacilitiesForRenewal(req, res) {
  try {
    const facilityIds = req.body?.facilityIds
    if (!facilityIds.length) return res.status(HttpStatus.OK).json([])

    const facilityFilter = facilityIds.map((id) => `(_ofm_facility_value eq ${id})`).join(' or ')

    const filter = `(${facilityFilter}) and ofm_version_number eq 0 and (Microsoft.Dynamics.CRM.NextXDays(PropertyName='ofm_end_date',PropertyValue=${FA_EXPIRING_DAYS}) or Microsoft.Dynamics.CRM.LastXDays(PropertyName='ofm_end_date',PropertyValue=${FA_EXPIRED_DAYS}))`

    const operation = `ofm_fundings?$select=ofm_fundingid,ofm_funding_number,ofm_declaration,ofm_start_date,ofm_end_date,_ofm_application_value,_ofm_facility_value,statuscode,statecode,ofm_version_number&$filter=${filter}&pageSize=500`
    const response = await getOperation(operation)

    const facilityList = []
    response?.value?.forEach((fa) => {
      if (fa._ofm_facility_value && fa.ofm_version_number === 0 && (fa.statuscode === FUNDING_AGREEMENT_STATUS_CODES.ACTIVE || fa.statuscode === FUNDING_AGREEMENT_STATUS_CODES.EXPIRED)) {
        facilityList.push({
          facilityId: fa._ofm_facility_value,
          fundingId: fa.ofm_fundingid,
          facilityName: fa['_ofm_facility_value@OData.Community.Display.V1.FormattedValue'] || null,
        })
      }
    })

    const renewalFacilityFilter = facilityList.map((f) => `_ofm_facility_value eq ${f.facilityId}`).join(' or ')

    const renewalFilter = `(Microsoft.Dynamics.CRM.LastXDays(PropertyName='ofm_summary_submittedon',PropertyValue=${RENEWAL_SUBMITTED_DAYS}) and ofm_application_type eq 2 and ofm_summary_submittedon ne null and (${renewalFacilityFilter}))`
    const renewalOperation = `ofm_applications?$select=_ofm_facility_value&$filter=${renewalFilter}&pageSize=500`

    const renewalResponse = await getOperation(renewalOperation)
    const renewalFacilityIds = renewalResponse?.value?.map((app) => app._ofm_facility_value) || []

    const finalList = facilityList.filter((f) => !renewalFacilityIds.includes(f.facilityId))

    return res.status(HttpStatus.OK).json(finalList)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFacility,
  getFacilityContacts,
  getFacilityLicences,
  updateFacility,
  getRawFacilityContacts,
  getFacilitiesForRenewal,
}
