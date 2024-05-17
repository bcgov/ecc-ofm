'use strict'
const { getOperation, patchOperationWithObjectId, getOperationWithObjectId } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { buildDateFilterQuery, buildFilterQuery } = require('../util/common')
const { FundingAgreementMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')

async function getFundingAgreements(req, res) {
  try {
    const fundingAgreements = []
    let operation = 'ofm_fundings?$select=ofm_fundingid,ofm_funding_number,ofm_declaration,ofm_start_date,ofm_end_date,_ofm_application_value,_ofm_facility_value,statuscode,statecode'
    if (req.query?.includeEA) {
      operation += '&$expand=ofm_application($select=_ofm_expense_authority_value;$expand=ofm_expense_authority($select=ofm_first_name,ofm_last_name))'
    }
    const filter = `${buildDateFilterQuery(req?.query)}${buildFilterQuery(req?.query, FundingAgreementMappings)}`
    operation += `&$filter=(${filter})`
    const response = await getOperation(operation)
    response?.value?.forEach((funding) => {
      const fa = new MappableObjectForFront(funding, FundingAgreementMappings).toJSON()
      if (req.query?.includeEA) {
        const ea = funding.ofm_application?.ofm_expense_authority
        fa.expenseAuthority = ea ? `${ea.ofm_first_name} ${ea.ofm_last_name}` : ''
      }

      fundingAgreements.push(fa)
    })
    if (isEmpty(fundingAgreements)) {
      return res.status(HttpStatus.NO_CONTENT).json()
    }
    return res.status(HttpStatus.OK).json(fundingAgreements)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getFundingAgreementById(req, res) {
  try {
    const response = await getOperationWithObjectId('ofm_fundings', req?.params?.fundingAgreementId)
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, FundingAgreementMappings).toJSON())
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateFundingAgreement(req, res) {
  try {
    let payload
    //we are signing the FA, the logged in contact will be bound in CRM
    if (req?.body.contactId) {
      payload = {
        'ofm_provider_approver@odata.bind': `/contacts(${req.body?.contactId})`,
        ofm_provider_approval_date: req.body?.signedOn,
        ...new MappableObjectForBack(req.body, FundingAgreementMappings).data,
      }
    } else {
      payload = new MappableObjectForBack(req.body, FundingAgreementMappings).toJSON()
    }
    const response = await patchOperationWithObjectId('ofm_fundings', req?.params?.fundingAgreementId, payload)
    return res.status(HttpStatus.NO_CONTENT).json(response)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

module.exports = {
  getFundingAgreements,
  updateFundingAgreement,
  getFundingAgreementById,
}
