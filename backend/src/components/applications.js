'use strict'
const { getOperation, patchOperationWithObjectId, postOperation, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { ApplicationMappings, SupplementaryApplicationMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const { isEmpty } = require('lodash')

function mapApplicationObjectForFront(data) {
  const application = new MappableObjectForFront(data, ApplicationMappings).toJSON()
  const ministryLastUpdated = new Date(application?.ministryLastUpdated)
  const providerLastUpdated = new Date(application?.providerLastUpdated)
  application.latestActivity = ministryLastUpdated > providerLastUpdated ? ministryLastUpdated : providerLastUpdated
  return application
}

function mapSupplementaryApplicationObjectForFront(data) {
  const applications = []
  data.forEach((suppApplication) => {
    const mappedApplication = new MappableObjectForFront(suppApplication, SupplementaryApplicationMappings).toJSON()

    if (mappedApplication.indigenousFundingModel) {
      mappedApplication.indigenousFundingModel = mappedApplication.indigenousFundingModel.split(',')
    } else if (mappedApplication.supportFundingModel) {
      mappedApplication.supportFundingModel = mappedApplication.supportFundingModel.split(',')
    }
    applications.push(mappedApplication)
  })

  return applications
}

function buildGetApplicationsFilterQuery(query) {
  let filterQuery = 'statuscode ne 2'
  if (isEmpty(query)) return filterQuery
  const mappedQuery = new MappableObjectForBack(query, ApplicationMappings).toJSON()
  Object.entries(mappedQuery)?.forEach(([key, value]) => {
    filterQuery = filterQuery.concat(` and ${key} eq ${value}`)
  })
  return filterQuery
}

async function getApplications(req, res) {
  try {
    const applications = []
    const operation = `ofm_applications?$select=ofm_application,ofm_summary_ministry_last_updated,ofm_summary_provider_last_updated,ofm_summary_submittedon,statuscode,statecode,_ofm_facility_value&$filter=(
      ${buildGetApplicationsFilterQuery(req?.query)} )`
    const response = await getOperation(operation)
    response?.value?.forEach((application) => applications.push(mapApplicationObjectForFront(application)))
    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getApplication(req, res) {
  try {
    const operation = `ofm_applications(${req.params.applicationId})`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(mapApplicationObjectForFront(response))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateApplication(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, ApplicationMappings).toJSON()
    // ofm_contact, ofm_secondary_contact, and ofm_expense_authority fields are lookup fields in CRM, so we need to replace them with data binding syntax
    if ('_ofm_contact_value' in payload || '_ofm_secondary_contact_value' in payload || '_ofm_expense_authority_value' in payload) {
      payload['ofm_contact@odata.bind'] = payload['_ofm_contact_value'] ? `/contacts(${payload['_ofm_contact_value']})` : null
      payload['ofm_secondary_contact@odata.bind'] = payload['_ofm_secondary_contact_value'] ? `/contacts(${payload['_ofm_secondary_contact_value']})` : null
      payload['ofm_expense_authority@odata.bind'] = payload['_ofm_expense_authority_value'] ? `/contacts(${payload['_ofm_expense_authority_value']})` : null
      delete payload['_ofm_contact_value']
      delete payload['_ofm_secondary_contact_value']
      delete payload['_ofm_expense_authority_value']
    }
    const response = await patchOperationWithObjectId('ofm_applications', req.params.applicationId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createApplication(req, res) {
  try {
    const payload = {
      'ofm_facility@odata.bind': `/accounts(${req.body?.facilityId})`,
      'ofm_organization@odata.bind': `/accounts(${req.body?.organizationId})`,
      ofm_provider_type: req.body?.providerType,
      ofm_summary_ownership: req.body?.ownership,
    }
    const response = await postOperation('ofm_applications', payload)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, ApplicationMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSupplementaryApplications(req, res) {
  try {
    const operation = `ofm_allowances?$filter=(_ofm_application_value eq ${req.params.applicationId} and statuscode eq 1)`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(mapSupplementaryApplicationObjectForFront(response.value))
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createSupplementaryApplication(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, SupplementaryApplicationMappings).toJSON()
    if (payload.ofm_indigenous_expenses) {
      payload.ofm_indigenous_expenses = payload.ofm_indigenous_expenses.toString()
    } else if (payload.ofm_needs_expenses) {
      payload.ofm_needs_expenses = payload.ofm_needs_expenses.toString()
    }

    payload['ofm_application@odata.bind'] = `/ofm_applications(${req.body.applicationId})`
    const response = await postOperation('ofm_allowances', payload)
    return res.status(HttpStatus.CREATED).json(new MappableObjectForFront(response, SupplementaryApplicationMappings).toJSON())
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateSupplementaryApplication(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, SupplementaryApplicationMappings).toJSON()
    if (payload.ofm_indigenous_expenses) {
      payload.ofm_indigenous_expenses = payload.ofm_indigenous_expenses.toString()
    } else if (payload.ofm_needs_expenses) {
      payload.ofm_needs_expenses = payload.ofm_needs_expenses.toString()
    }
    const response = await patchOperationWithObjectId('ofm_allowances', req.params.applicationId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function deleteSupplementaryApplication(req, res) {
  try {
    const response = await deleteOperationWithObjectId('ofm_allowances', req.params.applicationId)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getApplications,
  getApplication,
  updateApplication,
  createApplication,
  getSupplementaryApplications,
  createSupplementaryApplication,
  updateSupplementaryApplication,
  deleteSupplementaryApplication,
}
