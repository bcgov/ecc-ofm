'use strict'
const { getOperation, patchOperationWithObjectId, postOperation, deleteOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { ApplicationMappings, ApplicationProviderEmployeeMappings, SupplementaryApplicationMappings, IrregularExpenseMappings } = require('../util/mapping/Mappings')
const { buildFilterQuery, buildDateFilterQuery } = require('../util/common')
const HttpStatus = require('http-status-codes')
const { isEmpty } = require('lodash')
const log = require('./logger')

function mapLatestActivityDate(application) {
  const ministryLastUpdated = new Date(application?.ministryLastUpdated)
  const providerLastUpdated = new Date(application?.providerLastUpdated)
  application.latestActivityDate = ministryLastUpdated > providerLastUpdated ? ministryLastUpdated : providerLastUpdated
}

function mapApplicationObjectForFront(data) {
  const application = new MappableObjectForFront(data, ApplicationMappings).toJSON()
  mapLatestActivityDate(application)
  return application
}

function mapSupplementaryApplicationObjectForFront(data) {
  const applications = []
  data.forEach((suppApplication) => {
    const mappedApplication = new MappableObjectForFront(suppApplication, SupplementaryApplicationMappings).toJSON()
    mapLatestActivityDate(mappedApplication)
    if (mappedApplication.indigenousFundingModel) {
      mappedApplication.indigenousFundingModel = mappedApplication.indigenousFundingModel.split(',')
    } else if (mappedApplication.supportFundingModel) {
      mappedApplication.supportFundingModel = mappedApplication.supportFundingModel.split(',')
    }
    applications.push(mappedApplication)
  })

  return applications
}

async function getApplications(req, res) {
  try {
    const applications = []
    const operation = `ofm_applications?$select=ofm_application,ofm_summary_ministry_last_updated,ofm_summary_provider_last_updated,ofm_summary_submittedon,statuscode,statecode,_ofm_facility_value&$filter=(${buildFilterQuery(
      req?.query,
      ApplicationMappings,
    )})`
    const response = await getOperation(operation)
    response?.value?.forEach((application) => applications.push(mapApplicationObjectForFront(application)))
    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getApplication(req, res) {
  try {
    const operation = `ofm_applications(${req.params.applicationId})?$expand=ofm_application_provideremployee($select=ofm_provider_employeeid,ofm_employee_type,ofm_initials,ofm_certificate_number)`
    const response = await getOperation(operation)
    const application = mapApplicationObjectForFront(response)
    application.providerEmployees = response?.ofm_application_provideremployee?.map((employee) => new MappableObjectForFront(employee, ApplicationProviderEmployeeMappings).toJSON())
    return res.status(HttpStatus.OK).json(application)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getApplicationPDF(req, res) {
  try {
    const operation = `ofm_applications(${req.params.applicationId})/ofm_application_pdf`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    log.error(e)
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
    if ('_ofm_summary_submittedby_value' in payload) {
      payload['ofm_summary_submittedby@odata.bind'] = payload['_ofm_summary_submittedby_value'] ? `/contacts(${payload['_ofm_summary_submittedby_value']})` : null
      delete payload['_ofm_summary_submittedby_value']
    }
    const response = await patchOperationWithObjectId('ofm_applications', req.params.applicationId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
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
      'ofm_createdby@odata.bind': `/contacts(${req.body?.createdBy})`,
    }
    const response = await postOperation('ofm_applications', payload)
    return res.status(HttpStatus.CREATED).json(new MappableObjectForFront(response, ApplicationMappings).toJSON())
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

function buildGetSupplementaryApplicationsFilterQuery(query) {
  let filterQuery = 'and statuscode ne 2'
  if (isEmpty(query)) return filterQuery
  const mappedQuery = new MappableObjectForBack(query, SupplementaryApplicationMappings).toJSON()
  Object.entries(mappedQuery)?.forEach(([key, value]) => {
    filterQuery = filterQuery.concat(` and ${key} eq ${value}`)
  })
  return filterQuery
}

function buildSupplementaryApplicationsDateQuery(query) {
  if (isEmpty(query)) return ''
  const dateQuery = buildDateFilterQuery(query, 'ofm_start_date')
  return dateQuery
}

async function getSupplementaryApplications(req, res) {
  try {
    const operation = `ofm_allowances?$filter=(${buildSupplementaryApplicationsDateQuery(req?.query)} _ofm_application_value eq ${req?.params.applicationId}
    ${buildGetSupplementaryApplicationsFilterQuery(req?.query)} )`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(mapSupplementaryApplicationObjectForFront(response.value))
  } catch (e) {
    log.error(e)
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

    delete payload['_ofm_application_value']

    payload['ofm_application@odata.bind'] = `/ofm_applications(${req.body.applicationId})`
    const response = await postOperation('ofm_allowances', payload)
    return res.status(HttpStatus.CREATED).json(new MappableObjectForFront(response, SupplementaryApplicationMappings).toJSON())
  } catch (e) {
    log.error(e)
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

    delete payload['_ofm_application_value']

    const response = await patchOperationWithObjectId('ofm_allowances', req.params.applicationId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function deleteSupplementaryApplication(req, res) {
  try {
    const response = await deleteOperationWithObjectId('ofm_allowances', req.params.applicationId)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getSupplementaryApplicationPDF(req, res) {
  try {
    const operation = `ofm_allowances(${req.params.applicationId})/ofm_supplementaryapplicationpdf`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getIrregularExpenseApplication(req, res) {
  try {
    const applications = []
    const operation = `ofm_expenses?$filter=(_ofm_application_value eq ${req.params.applicationId} and statuscode ne 2 )`
    const response = await getOperation(operation) //add mapping

    response?.value?.forEach((application) => applications.push(new MappableObjectForFront(application, IrregularExpenseMappings).toJSON()))

    return res.status(HttpStatus.OK).json(applications)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function createEmployeeCertificate(req, res) {
  try {
    const payload = {
      'ofm_application@odata.bind': `/ofm_applications(${req.body?.applicationId})`,
      ofm_certificate_number: req.body?.certificateNumber,
      ofm_initials: req.body?.initials,
      ofm_employee_type: req.body?.employeeType,
    }
    const response = await postOperation('ofm_provider_employees', payload)
    return res.status(HttpStatus.CREATED).json(new MappableObjectForFront(response, ApplicationProviderEmployeeMappings).toJSON())
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateEmployeeCertificate(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, ApplicationProviderEmployeeMappings).toJSON()
    const response = await patchOperationWithObjectId('ofm_provider_employees', req.params.providerEmployeeId, payload)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function deleteEmployeeCertificate(req, res) {
  try {
    const response = await deleteOperationWithObjectId('ofm_provider_employees', req.params.providerEmployeeId)
    return res.status(HttpStatus.OK).json(response)
  } catch (e) {
    log.error(e)
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
  createEmployeeCertificate,
  updateEmployeeCertificate,
  deleteEmployeeCertificate,
  getApplicationPDF,
  getSupplementaryApplicationPDF,
  getIrregularExpenseApplication,
}
