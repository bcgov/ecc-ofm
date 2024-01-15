'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { OrganizationMappings, FacilityMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')

async function getOrganization(req, res) {
  try {
    const operation = `accounts(${req.params.accountId})?$select=accountid,accountnumber,name,emailaddress1,ofm_business_type,telephone1,telephone2,address1_line1,address1_line2,address1_city,address1_postalcode,address1_stateorprovince,ofm_is_mailing_address_different,address2_line1,address2_line2,address2_city,address2_postalcode,address2_stateorprovince,statecode,statuscode`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getOrganizationFacilities(req, res) {
  try {
    const operation = `accounts?$select=accountid,accountnumber,name,ccof_accounttype&$filter=(_parentaccountid_value eq ${req.params.organizationId})`
    const response = await getOperation(operation)
    let orgFacilities = []
    response?.value?.forEach((item) => orgFacilities.push(new MappableObjectForFront(item, FacilityMappings).toJSON()))
    return res.status(HttpStatus.OK).json(orgFacilities)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function mapOrganizationForBack(data) {
  let organizationForBack = new MappableObjectForBack(data, OrganizationMappings).toJSON()
  if (organizationForBack.ccof_facilitystartdate) {
    organizationForBack.ccof_facilitystartdate = `${organizationForBack.ccof_facilitystartdate}-01-01`
  }
  return organizationForBack
}

async function updateOrganization(req, res) {
  let organization = mapOrganizationForBack(req.body)
  //organization.ccof_accounttype = ACCOUNT_TYPE.ORGANIZATION;
  console.log('*********************************************************************')
  console.log('*********************************************************************')
  console.log('*********************************************************************')
  console.log('*********************************************************************')
  console.log('organization', organization)
  console.log('*********************************************************************')
  console.log('*********************************************************************')
  console.log('*********************************************************************')
  console.log('*********************************************************************')
  try {
    let orgResponse = await patchOperationWithObjectId('accounts', req.params.organizationId, organization)
    orgResponse = new MappableObjectForFront(orgResponse, OrganizationMappings)
    return res.status(HttpStatus.OK).json(orgResponse)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getOrganization,
  getOrganizationFacilities,
  updateOrganization,
}
