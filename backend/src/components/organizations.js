'use strict'
const { getOperation, patchOperationWithObjectId } = require('./utils')
const { getMappingString } = require('../util/common')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { OrganizationMappings, FacilityMappings, UserProfileMappings } = require('../util/mapping/Mappings')
const log = require('./logger')
const HttpStatus = require('http-status-codes')

async function getOrganization(req, res) {
  try {
    const orgMappingString = getMappingString(OrganizationMappings)
    const operation = `accounts(${req.params.organizationId})?$select=${orgMappingString}`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings).toJSON())
  } catch (e) {
    log.error(e)
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
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateOrganization(req, res) {
  const organization = new MappableObjectForBack(req.body, OrganizationMappings).toJSON()
  try {
    const response = await patchOperationWithObjectId('accounts', req.params.organizationId, organization)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, OrganizationMappings))
  } catch (e) {
    log.error(e)
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
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getOrganization,
  getOrganizationFacilities,
  updateOrganization,
  getOrganizationUsers,
}
