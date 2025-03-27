'use strict'
const { getOperation, patchOperationWithObjectId, getOperationWithObjectId, handleError } = require('./utils')
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject')
const { buildDateFilterQuery, buildFilterQuery } = require('../util/common')
const { getTopUpFundingByFilter } = require('./topups')
const { TOP_UP_FUNDING_STATUS_CODES } = require('../util/constants')
const { FundingAgreementMappings, FundingReallocationRequestMappings } = require('../util/mapping/Mappings')
const HttpStatus = require('http-status-codes')
const log = require('./logger')
const { isEmpty } = require('lodash')

async function getFundingAgreements(req, res) {
  try {
    let fundingAgreements = []
    let operation = 'ofm_fundings?$select=ofm_fundingid,ofm_funding_number,ofm_declaration,ofm_start_date,ofm_end_date,_ofm_application_value,_ofm_facility_value,statuscode,statecode'
    if (req.query?.includeFundingEnvelopes) {
      operation +=
        ',ofm_envelope_hr_total,ofm_envelope_hr_wages_paidtimeoff,ofm_envelope_hr_benefits,ofm_envelope_hr_employerhealthtax,ofm_envelope_hr_prodevhours,ofm_envelope_hr_prodevexpenses,ofm_envelope_programming,ofm_envelope_administrative,ofm_envelope_operational,ofm_envelope_facility'
    }
    if (req.query?.includeEA) {
      operation += '&$expand=ofm_application($select=_ofm_expense_authority_value;$expand=ofm_expense_authority($select=ofm_first_name,ofm_last_name))'
    }
    const filter = `${buildDateFilterQuery(req?.query, 'ofm_start_date')}${buildFilterQuery(req?.query, FundingAgreementMappings)}`
    operation += `&$filter=(${filter})&pageSize=500&$orderby=ofm_version_number desc`
    const response = await getOperation(operation)
    response?.value?.forEach((funding) => {
      const fa = new MappableObjectForFront(funding, FundingAgreementMappings).toJSON()
      if (req.query?.includeEA) {
        const ea = funding.ofm_application?.ofm_expense_authority
        fa.expenseAuthority = ea ? `${ea.ofm_first_name ?? ''} ${ea.ofm_last_name}` : ''
      }
      fundingAgreements.push(fa)
    })

    if (req.query?.includeTopUp) {
      const topUpFilter = filter + ` and statuscode ne ${TOP_UP_FUNDING_STATUS_CODES.DRAFT}`
      const topUps = await getTopUpFundingByFilter(topUpFilter)
      fundingAgreements = [...topUps, ...fundingAgreements]
    }

    if (isEmpty(fundingAgreements)) {
      return res.status(HttpStatus.NO_CONTENT).json()
    }

    return res.status(HttpStatus.OK).json(fundingAgreements)
  } catch (e) {
    handleError(res, e)
  }
}

async function getFundingAgreementById(req, res) {
  try {
    const fundingAgreement = await getRawFundingAgreementById(req?.params?.fundingAgreementId)
    return res.status(HttpStatus.OK).json(fundingAgreement)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function getRawFundingAgreementById(fundingAgreementId) {
  const response = await getOperationWithObjectId('ofm_fundings', fundingAgreementId)
  return new MappableObjectForFront(response, FundingAgreementMappings).toJSON()
}

async function getFundingPDFById(req, res) {
  try {
    const operation = `ofm_fundings(${req?.params?.fundingAgreementId})/ofm_agreement_file`
    const response = await getOperation(operation)
    return res.status(HttpStatus.OK).json(response?.value)
  } catch (e) {
    log.error(e)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status)
  }
}

async function updateFundingAgreement(req, res) {
  try {
    let payload
    //we are signing the FA, the logged in contact will be bound in CRM
    if (req?.body.agreeConsentCertify) {
      payload = {
        'ofm_provider_approver@odata.bind': `/contacts(${req.body?.contactId})`,
        ofm_provider_approval_date: req.body?.signedOn,
        ...new MappableObjectForBack(req.body, FundingAgreementMappings).data,
      }
    } else if (req?.body.stateCode) {
      payload = {
        'ofm_provider_decliner@odata.bind': `/contacts(${req.body?.contactId})`, // Bind decliner's contact ID
        ofm_provider_decline_date: req.body?.signedOn,
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

async function getFundingReallocationRequests(req, res) {
  try {
    const fundingReallocationRequests = []
    const operation = `ofm_funding_envelope_changes?$select=ofm_funding_envelope_changeid,_ofm_funding_value,ofm_funding_envelope_from,ofm_funding_envelope_to,ofm_amount_base,createdon,statuscode
              &$filter=(_ofm_funding_value eq ${req?.params?.fundingAgreementId})&pageSize=500`
    const response = await getOperation(operation)
    response?.value?.forEach((reallocationRequest) => fundingReallocationRequests.push(new MappableObjectForFront(reallocationRequest, FundingReallocationRequestMappings).toJSON()))
    return res.status(HttpStatus.OK).json(fundingReallocationRequests)
  } catch (e) {
    handleError(res, e)
  }
}

module.exports = {
  getFundingAgreements,
  getFundingAgreementById,
  getFundingReallocationRequests,
  getFundingPDFById,
  getRawFundingAgreementById,
  updateFundingAgreement,
}
