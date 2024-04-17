'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { OrganizationMappings, FacilityMappings, UserProfileMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getOrganization(req, res) {
  try {
    const operation = `accounts(${req.params.accountId})?$select=accountid,accountnumber,name,emailaddress1,ofm_business_type,telephone1,telephone2,address1_line1,address1_line2,address1_city,address1_postalcode,address1_stateorprovince,ofm_is_mailing_address_different,address2_line1,address2_line2,address2_city,address2_postalcode,address2_stateorprovince,ofm_provider_type,ofm_ownership,statecode,statuscode,ofm_inclusion_policy,ofm_good_standing_status`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getOrganizationFacilities(req, res) {
  try {
    const operation = `accounts?$select=accountid,accountnumber,name,ofm_program,ccof_accounttype&$filter=(_parentaccountid_value eq ${req.params.organizationId}) and (statecode eq 0)`
    const response = await getOperation(operation)
    let orgFacilities = []
    response?.value?.forEach((item) => orgFacilities.push(new MappableObjectForFront(item, FacilityMappings).toJSON()))
    return res.status(HttpStatus.OK).json(orgFacilities)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateOrganization(req, res) {
  const organization = new MappableObjectForBack(req.body, OrganizationMappings).toJSON()
  delete organization['ofm_business_type@OData.Community.Display.V1.FormattedValue']
  try {
    const response = await patchOperationWithObjectId('accounts', req.params.organizationId, organization)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getOrganizationUsers(req, res) {
  try {
    const { firstName, lastName, email } = req.query
    let filterCriteria = [`parentcustomerid_account/accountid eq '${req.params.organizationId}'`]
    if (firstName) {
      filterCriteria.push(`ofm_first_name eq '${firstName}'`)
    }
    if (lastName) {
      filterCriteria.push(`ofm_last_name eq '${lastName}'`)
    }
    if (email) {
      filterCriteria.push(`emailaddress1 eq '${email}'`)
    }
    const operation = `contacts?$select=contactid,ccof_username,ofm_first_name,ofm_last_name,emailaddress1&$filter=${filterCriteria.join(' and ')}`
    const response = await getOperation(operation)
    const orgUsers = response.value.map((item) => new MappableObjectForFront(item, UserProfileMappings).toJSON())
    return res.status(HttpStatus.OK).json(orgUsers)
  } catch (e) {
    log.info('Error in getOrganizationUsers:', e)
    const errorResponse = e.data ? e.data : e?.status ? e.status : 'Unknown error'
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: errorResponse })
  }
}

module.exports = {
  getOrganization,
  getOrganizationFacilities,
  updateOrganization,
  getOrganizationUsers,
}
